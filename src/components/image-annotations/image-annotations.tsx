import {
  Component,
  Element,
  Event,
  EventEmitter,
  Host,
  Prop,
  State,
  Watch,
  h
} from "@stencil/core";

const EMPTY_TRACE_LIST_INDEX = -3;

const PERCENTAGE_VALUE_REGEX = /[0-9]*\.?[0-9]*%/g;

/**
 * @part image-annotations__canvas - The canvas where to make the annotations.
 */
@Component({
  tag: "gx-image-annotations",
  styleUrl: "image-annotations.scss",
  shadow: true
})
export class GxImageAnnotations {
  private initPaint = false;
  private currentMousePositionX = 0;
  private currentMousePositionY = 0;
  private lastSavedImageUrl: string = null;
  private lastSavedImageAnnUrl: string = null;
  private traceIndexChangedFromInside = false;

  // Refs
  private canvas: HTMLCanvasElement = null;
  private canvasAnn: any = null;
  private baseImage: HTMLImageElement = null;
  private resizeObserver: ResizeObserver = null;

  private needForRAF = true; // To prevent redundant RAF (request animation frame) calls

  @Element() el: HTMLGxImageAnnotationsElement;

  /**
   * The size of the cropper selection will be.
   */
  @State() colorsItems: string[] = [];

  /**
   * The list of traces that have been painted.
   */
  @State() traceList: TraceData[] = [];

  /**
   * If the annotations are activated or not.
   */
  @Prop() readonly disabled: boolean = false;

  /**
   * Specifies the `fontFamily` for the texts
   */
  @Prop() readonly fontFamily: string = "Arial";

  @Watch("fontFamily")
  handleFontFamilyChange() {
    this.loadTexts();
    this.traceChanged();
  }

  /**
   * Specifies the `fontSize` for the texts
   */
  @Prop() readonly fontSize: number = 16;

  @Watch("fontSize")
  handleFontSizeChange() {
    this.loadTexts();
    this.traceChanged();
  }

  /**
   * The source of the background image.
   */
  @Prop() readonly imageLabel = "Image to be annotated";

  /**
   * This attribute lets you specify how this element will behave when hidden.
   *
   * | Value        | Details                                                                     |
   * | ------------ | --------------------------------------------------------------------------- |
   * | `keep-space` | The element remains in the document flow, and it does occupy space.         |
   * | `collapse`   | The element is removed form the document flow, and it doesn't occupy space. |
   */
  @Prop() readonly invisibleMode: "collapse" | "keep-space" = "collapse";

  /**
   * Specifies the lines that will be drawn on the gx-image-annotations control
   */
  @Prop() readonly lines: ImageAnnotationLine[] = [];

  @Watch("lines")
  handleLinesChange() {
    this.loadLines();
    this.traceChanged();
  }

  /**
   * Specifies the texts that will be drawn on the gx-image-annotations control
   */
  @Prop() readonly texts: ImageAnnotationText[] = [];

  @Watch("texts")
  handleTextsChange() {
    this.loadTexts();
    this.traceChanged();
  }

  /**
   * Drawing color.
   */
  @Prop() readonly traceColor: string = "#000000";

  /**
   * Property used for change the traceInd state and go forward or backward.
   */
  @Prop({ mutable: true }) traceIndex = -1;

  @Watch("traceIndex")
  watchTraceIndHandler(newValue: number, oldValue: number) {
    if (this.traceIndexChangedFromInside) {
      this.traceIndexChangedFromInside = false;
      return;
    }

    if (newValue === EMPTY_TRACE_LIST_INDEX) {
      this.cleanAll();
    } else {
      this.moveIndex(oldValue - newValue);
    }
  }

  /**
   * Drawing thickness.
   */
  @Prop() readonly traceThickness: number = 2;

  /**
   * The source of the background image.
   */
  @Prop() readonly value: string;
  @Watch("value")
  watchValueHandler(newValue: string) {
    this.resetTrace();
    this.cleanPaint(this.canvas);
    this.baseImage = new Image();
    this.baseImage.src = newValue;
    this.baseImage.addEventListener("load", () => {
      this.loadImage();
      this.traceChanged();
    });
  }

  /**
   * Fired when the annotations change.
   */
  @Event() annotationsChange: EventEmitter<AnnotationsChangeEvent>;

  /**
   * Fired when the traceIndex property value is changed.
   */
  @Event() traceIndexChange: EventEmitter<number>;

  componentDidLoad() {
    this.canvasAnn = this.canvas.cloneNode();
    this.canvas.addEventListener("mousedown", this.handleMousedown);
    this.canvas.addEventListener("touchstart", this.handleTouchStart);

    if (this.value) {
      this.baseImage = new Image();
      this.baseImage.src = this.value;
      this.baseImage.addEventListener("load", this.loadAll);
    }

    this.canvasChangedObserver();
  }

  disconnectedCallback() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }

  /**
   * Observer to listener the change of size in canvas.
   */
  private canvasChangedObserver() {
    // Create instance of observer
    this.resizeObserver = new ResizeObserver(entries => {
      if (!entries[0] || !this.needForRAF) {
        return;
      }

      this.needForRAF = false; // No need to call RAF up until next frame

      requestAnimationFrame(() => {
        this.needForRAF = true; // RAF now consumes the movement instruction so a new one can come

        this.canvas.width = entries[0].contentRect.width;
        this.canvas.height = entries[0].contentRect.height;

        // Reload annotations
        this.loadAll();
        this.paintToInd(this.canvas);
        this.traceChanged();
      });
    });

    // Start the observation
    this.resizeObserver.observe(this.canvas);
  }

  /**
   * Move over the array of annotations.
   */
  private moveIndex(forwardPositionSum: number) {
    if (this.traceIndex >= -1 && this.traceIndex <= this.traceList.length - 1) {
      this.cleanPaint(this.canvas);
      this.loadImage();
      this.paintToInd(this.canvas);
      this.traceChanged();
    } else {
      this.changeIndexAndEmit(this.traceIndex + forwardPositionSum);
    }
  }

  /**
   * Clean all annotations in canvas and memory.
   */
  private cleanAll() {
    this.resetTrace();
    this.cleanPaint(this.canvas);
    this.loadAll();
    this.traceChanged();
  }

  /**
   * Load a text, lines and background image in the canvas.
   */
  private loadAll = () => {
    // Add the texts
    this.loadTexts();

    // Add the lines
    this.loadLines();

    // Add the background image
    this.loadImage();
  };

  private loadImage() {
    // If no image, return
    if (!this.baseImage) {
      return;
    }
    const context = this.canvas.getContext("2d");

    const hostWidth = this.canvas.width;
    const hostHeight = this.canvas.height;
    const imgWidth = this.baseImage.width;
    const imgHeight = this.baseImage.height;

    let newImgWidth = hostWidth;
    let newImgHeight = hostHeight;
    let newLeft = 0;
    let newTop = 0;
    let ratio = imgWidth / imgHeight;

    // It's important calculate the image dimensions based on the ratio of the image and the ratio of the canvas.
    if (imgWidth > imgHeight) {
      ratio = imgHeight / imgWidth;
      newImgHeight = (hostWidth * imgHeight) / imgWidth;

      if (newImgHeight > hostHeight) {
        newImgHeight = hostHeight;
        newImgWidth = newImgHeight / ratio;
        newLeft = (hostWidth - newImgWidth) / 2;
      } else {
        newTop = (hostHeight - newImgHeight) / 2;
      }
    } else {
      newImgWidth = hostHeight * ratio;

      if (newImgWidth > hostWidth) {
        newImgWidth = hostWidth;
        newImgHeight = newImgWidth / ratio;
        newTop = (hostHeight - newImgHeight) / 2;
      } else {
        newLeft = (hostWidth - newImgWidth) / 2;
      }
    }

    // Draw the image in canvas.
    context.drawImage(
      this.baseImage,
      0,
      0,
      this.baseImage.width,
      this.baseImage.height,
      newLeft,
      newTop,
      newImgWidth,
      newImgHeight
    );
  }

  private loadTexts() {
    if (!this.texts) {
      return;
    }
    const context = this.canvas.getContext("2d");

    this.texts.forEach(text => {
      // Set text alignment
      context.textAlign = (
        text.TextAlign || "Start"
      ).toLowerCase() as CanvasTextAlign;

      // Set the font
      context.font =
        text.FontSize && text.FontFamily
          ? `${text.FontSize}px ${text.FontFamily}`
          : `${this.fontSize}px ${this.fontFamily}`;

      const lines = text.FillText.split("\n");

      // Draw each line with vertical separation
      lines.forEach((line, index) => {
        const initialY = this.fontSize + (text.OffSetY || 0);
        const separation = this.fontSize + (text.SeparationBetweenLines || 0);

        const offSetX = text.OffSetX || 0;

        context.fillText(
          line,
          text.TextAlign === "Center"
            ? this.canvas.width / 2 + offSetX
            : offSetX,
          initialY + index * separation
        );
      });
    });
  }

  private loadLines() {
    if (!this.lines) {
      return;
    }
    const context = this.canvas.getContext("2d");

    this.lines.forEach(line => {
      context.beginPath();

      context.moveTo(
        this.getLineValue(line.FromX, "X"),
        this.getLineValue(line.FromY, "Y")
      );
      context.lineTo(
        this.getLineValue(line.ToX, "X"),
        this.getLineValue(line.ToY, "Y")
      );

      context.strokeStyle = line.Color ?? "#000000";
      context.stroke();
    });
  }

  private getLineValue(line: string, axis: "X" | "Y"): number {
    let trimmedLine = line.trim();
    const hasPercentage = trimmedLine.includes("%");

    if (!hasPercentage) {
      return Number(trimmedLine);
    }
    const percentagesToReplace = trimmedLine.match(PERCENTAGE_VALUE_REGEX);

    percentagesToReplace.forEach(valueToReplaceWithPercentage => {
      // Remove % and parse to number
      const valueToReplace =
        Number(valueToReplaceWithPercentage.replace("%", "")) / 100;

      // Calculate value in pixels
      const computedValue =
        axis === "X"
          ? valueToReplace * this.canvas.width
          : valueToReplace * this.canvas.height;

      // Replace percentages with values in pixel
      trimmedLine = trimmedLine.replace(
        valueToReplaceWithPercentage,
        computedValue.toString()
      );
    });

    return eval(trimmedLine);
  }

  private traceChanged = () => {
    this.canvas.toBlob(blob => {
      if (this.lastSavedImageUrl) {
        URL.revokeObjectURL(this.lastSavedImageUrl);
        this.lastSavedImageUrl = null;
      }

      const url = URL.createObjectURL(blob);
      if (url) {
        this.lastSavedImageUrl = url;
        this.annotationsChange.emit({
          annotatedImage: this.lastSavedImageUrl,
          annotations: this.lastSavedImageAnnUrl
        });
      }
    });

    this.cleanPaint(this.canvasAnn);
    this.paintToInd(this.canvasAnn);
    this.canvasAnn.toBlob((blob: any) => {
      if (this.lastSavedImageAnnUrl) {
        URL.revokeObjectURL(this.lastSavedImageAnnUrl);
        this.lastSavedImageAnnUrl = null;
      }

      const url = URL.createObjectURL(blob);
      if (url) {
        this.lastSavedImageAnnUrl = url;
        this.annotationsChange.emit({
          annotatedImage: this.lastSavedImageUrl,
          annotations: this.lastSavedImageAnnUrl
        });
      }
    });
  };

  private handleMousedown = (ev: MouseEvent) => {
    if (!this.disabled) {
      this.canvas.addEventListener("mousemove", this.handleMousemove);
      this.canvas.addEventListener("mouseup", this.finishPaint);
      this.canvas.addEventListener("mouseout", this.finishPaint);
      ev.preventDefault();

      this.startPainting(ev.clientX, ev.clientY);
    }
  };

  private handleTouchStart = (ev: TouchEvent) => {
    if (!this.disabled) {
      this.canvas.addEventListener("touchmove", this.handleTouchmove);
      this.canvas.addEventListener("touchend", this.finishPaint);
      this.canvas.addEventListener("touchcancel", this.finishPaint);
      this.canvas.addEventListener("touchleave", this.finishPaint);
      ev.preventDefault();

      const touches = ev.changedTouches;
      this.startPainting(touches[0].pageX, touches[0].pageY);
    }
  };

  private startPainting = (pageX: number, pageY: number) => {
    // In this event we only have initiated the click, so we will draw a point
    this.currentMousePositionX = this.getRelativePositionX(pageX);
    this.currentMousePositionY = this.getRelativePositionY(pageY);

    // And put the flag
    this.initPaint = true;

    this.resetTraceList();
    this.traceList.push({
      color: this.traceColor,
      thickness: this.traceThickness,
      point: { x: this.currentMousePositionX, y: this.currentMousePositionY },
      paths: []
    });

    this.changeIndexAndEmit(this.traceIndex + 1);

    this.paintToInd(this.canvas);
    // this.traceChanged();
  };

  private handleMousemove = (ev: MouseEvent) => {
    if (!this.disabled) {
      ev.preventDefault();

      this.movePincel(ev.clientX, ev.clientY);
    }
  };

  private handleTouchmove = (ev: TouchEvent) => {
    if (!this.disabled) {
      ev.preventDefault();

      const touches = ev.changedTouches;
      this.movePincel(touches[0].pageX, touches[0].pageY);
    }
  };

  private movePincel = (pageX: number, pageY: number) => {
    if (!this.initPaint) {
      return;
    }
    // The mouse is moving and user is pushing the button, so we draw all.

    const lastMousePositionX = this.currentMousePositionX;
    const lastMousePositionY = this.currentMousePositionY;
    this.currentMousePositionX = this.getRelativePositionX(pageX);
    this.currentMousePositionY = this.getRelativePositionY(pageY);
    this.joinPath(
      this.canvas,
      lastMousePositionX,
      lastMousePositionY,
      this.currentMousePositionX,
      this.currentMousePositionY,
      this.traceColor,
      this.traceThickness
    );
  };

  private finishPaint = (ev: MouseEvent) => {
    if (!this.disabled) {
      ev.preventDefault();
      this.canvas.removeEventListener("mousemove", this.handleMousemove);
      this.canvas.removeEventListener("mouseup", this.finishPaint);
      this.canvas.removeEventListener("mouseout", this.finishPaint);
      this.canvas.removeEventListener("touchmove", this.handleTouchmove);
      this.canvas.removeEventListener("touchend", this.finishPaint);
      this.canvas.removeEventListener("touchcancel", this.finishPaint);
      this.canvas.removeEventListener("touchleave", this.finishPaint);
      this.initPaint = false;
      this.traceChanged();
    }
  };

  private cleanPaint = (canvas: HTMLCanvasElement) => {
    if (this.canvas) {
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Clear paths
      context.beginPath();
    }
  };

  private resetTrace = () => {
    this.traceIndex = -1;
    this.resetTraceList();
  };

  private changeIndexAndEmit = (newTaceIndex: number) => {
    this.traceIndexChangedFromInside = true;
    this.traceIndex = newTaceIndex;
    this.traceIndexChange.emit(this.traceIndex);
  };

  private paintPoint = (
    canvas: HTMLCanvasElement,
    currentMousePositionX: number,
    currentMousePositionY: number,
    color: string,
    thickness: number
  ) => {
    const context = canvas.getContext("2d");
    context.beginPath();
    context.fillStyle = color;
    context.fillRect(
      currentMousePositionX,
      currentMousePositionY,
      thickness,
      thickness
    );
    context.closePath();
  };

  private joinPath = (
    canvas: HTMLCanvasElement,
    lastMousePositionX: number,
    lastMousePositionY: number,
    currentMousePositionX: number,
    currentMousePositionY: number,
    color: string,
    thickness: number,
    addTolist = true
  ) => {
    const context = canvas.getContext("2d");
    context.beginPath();
    context.moveTo(lastMousePositionX, lastMousePositionY);
    context.lineTo(currentMousePositionX, currentMousePositionY);
    context.strokeStyle = color;
    context.lineWidth = thickness;
    context.stroke();
    context.closePath();

    if (addTolist && this.traceList[this.traceIndex]) {
      this.traceList[this.traceIndex].paths.push({
        lastMousePositionX: lastMousePositionX,
        lastMousePositionY: lastMousePositionY,
        currentMousePositionX: currentMousePositionX,
        currentMousePositionY: currentMousePositionY
      });
    }
  };

  private paintToInd = (canvas: HTMLCanvasElement) => {
    for (let ind = 0; ind <= this.traceIndex; ind++) {
      const trace = this.traceList[ind];
      this.paintPoint(
        canvas,
        trace.point.x,
        trace.point.y,
        trace.color,
        trace.thickness
      );
      trace.paths.forEach(path =>
        this.joinPath(
          canvas,
          path.lastMousePositionX,
          path.lastMousePositionY,
          path.currentMousePositionX,
          path.currentMousePositionY,
          trace.color,
          trace.thickness,
          false
        )
      );
    }
  };

  private resetTraceList = () => {
    this.traceList.splice(this.traceIndex + 1);
  };

  private getRelativePositionX = (clientX: number) =>
    clientX - this.canvas.getBoundingClientRect().left;

  private getRelativePositionY = (clientY: number) =>
    clientY - this.canvas.getBoundingClientRect().top;

  render() {
    return (
      <Host role="img" aria-label={this.imageLabel}>
        <canvas
          class="canvas"
          part="image-annotations__canvas"
          ref={canvasElement =>
            (this.canvas = canvasElement as HTMLCanvasElement)
          }
        ></canvas>
      </Host>
    );
  }
}

interface TraceData {
  color: string;
  thickness: number;
  point: TraceDataPoint;
  paths: TraceDataPath[];
}

interface TraceDataPoint {
  x: number;
  y: number;
}

interface TraceDataPath {
  lastMousePositionX: number;
  lastMousePositionY: number;
  currentMousePositionX: number;
  currentMousePositionY: number;
}

export interface AnnotationsChangeEvent {
  annotations: string;
  annotatedImage: string;
}

export interface ImageAnnotationText {
  FillText: string;
  FontFamily?: string;
  FontSize?: number;
  OffSetX?: number;
  OffSetY?: number;
  SeparationBetweenLines?: number;
  TextAlign?: "Start" | "Center" | "End";
}

export interface ImageAnnotationLine {
  FromX: string;
  FromY: string;
  ToX: string;
  ToY: string;
  Color?: string;
}
