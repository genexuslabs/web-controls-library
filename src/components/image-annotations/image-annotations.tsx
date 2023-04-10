import {
  Component,
  Host,
  h,
  Element,
  Prop,
  State,
  Watch,
  Event,
  EventEmitter
} from "@stencil/core";

/**
 * @part canvas - The canvas where to make the annotations.
 */
@Component({
  tag: "gx-image-annotations",
  styleUrl: "image-annotations.scss",
  shadow: true
})
export class GxImageAnnotations {
  private canvas: HTMLCanvasElement = null;
  private canvasAnn: any = null;
  private baseImage: HTMLImageElement = null;
  private initPaint = false;
  private currentMousePositionX = 0;
  private currentMousePositionY = 0;
  private lastSavedImageUrl: string = null;
  private lastSavedImageAnnUrl: string = null;

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
   * The current index that the trace list in.
   */
  @State() traceInd = -1;

  /**
   * Property used for change the traceInd state and go forward or backward.
   */
  @Prop() readonly traceIndex = this.traceInd;
  @Watch("traceIndex")
  watchTraceIndHandler(newValue: number) {
    if (newValue === -10) {
      this.cleanAll();
    } else {
      if (newValue > this.traceInd) {
        this.goTo();
      }
      if (newValue < this.traceInd) {
        this.goBack();
      }
    }
  }

  /**
   * A CSS class to set as the `gx-image-annotations` element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * If the annotations are activated or not.
   */
  @Prop() readonly disabled = false;

  /**
   * The source of the background image.
   */
  @Prop() readonly imageLabel = "Image to be annotated";

  /**
   * How the component will hide.
   */
  @Prop() readonly invisibleMode: "Keep Space" | "Collapse Space" =
    "Keep Space";

  /**
   * Drawing color.
   */
  @Prop() readonly traceColor: string = "#000000";

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
    this.baseImage.addEventListener("load", this.loadImage);
  }

  /**
   * Fired when the menu container is opened or closed.
   */
  @Event({
    eventName: "annotationsChange"
  })
  annotationsChange: EventEmitter<AnnotationsChangeEvent>;

  /**
   * Fired when the menu container is opened or closed.
   */
  @Event({
    eventName: "traceIndexChange"
  })
  traceIndexChange: EventEmitter<number>;

  componentDidLoad() {
    this.canvas.width = this.el.clientWidth;
    this.canvas.height = this.el.clientHeight;
    this.canvasAnn = this.canvas.cloneNode();
    this.canvas.addEventListener("mousedown", this.handleMousedown);

    this.canvas.addEventListener("touchstart", this.handleTouchStart);

    if (this.value) {
      this.baseImage = new Image();
      this.baseImage.src = this.value;
      this.baseImage.addEventListener("load", this.loadImage);
    }
  }

  /**
   * Go back one step, if the array of annotations have any: erase the last annotation.
   */
  private goBack() {
    if (this.traceInd >= 0) {
      this.traceInd--;
      this.cleanPaint(this.canvas);
      this.loadImage();
      this.paintToInd(this.canvas);
      this.traceChanged();
    } else {
      this.traceIndexChange.emit(this.traceInd);
    }
  }

  /**
   * Go foward one step, if the array of annotations have any and user go back previously: recover the annotation in the index where it is.
   */
  private goTo() {
    if (this.traceInd < this.traceList.length - 1) {
      this.traceInd++;
      this.cleanPaint(this.canvas);
      this.loadImage();
      this.paintToInd(this.canvas);
      this.traceChanged();
    } else {
      this.traceIndexChange.emit(this.traceInd);
    }
  }

  /**
   * Clean all annotations in canvas and memory.
   */
  private cleanAll() {
    this.resetTrace();
    this.cleanPaint(this.canvas);
    this.loadImage();
    this.traceChanged();
  }

  private loadImage = () => {
    if (this.baseImage) {
      const hostWidth = this.canvas.width;
      const hostHeight = this.canvas.height;
      const imgWidth = this.baseImage.width;
      const imgHeight = this.baseImage.height;

      let newLeft = 0;
      let newTop = 0;

      let ratioCanvas = hostWidth / hostHeight;

      let ratio = imgWidth / imgHeight;
      let newImgWidth = hostWidth;
      let newImgHeight = hostHeight;
      if (imgWidth > imgHeight) {
        ratio = imgHeight / imgWidth;
        newImgHeight = hostHeight * ratioCanvas * ratio;
        if (newImgHeight > hostHeight) {
          newImgHeight = hostHeight;
          newImgWidth = newImgHeight / ratio;
          newLeft = (hostWidth - newImgWidth) / 2;
        } else {
          newTop = (hostHeight - newImgHeight) / 2;
        }
      } else {
        ratioCanvas = hostHeight / hostWidth;
        newImgWidth = hostWidth * ratioCanvas * ratio;
        if (newImgWidth > hostWidth) {
          newImgWidth = hostWidth;
          newImgHeight = newImgWidth / ratio;
          newTop = (hostHeight - newImgHeight) / 2;
        } else {
          newLeft = (hostWidth - newImgWidth) / 2;
        }
      }

      // let newDistWidth = (newImgWidth - hostWidth) / 2;
      // let newDistHeight = (newImgHeight - hostHeight) / 2;

      // const wDiff = (this.size.width / 2) * (ratio - 1);
      // const hDiff = (this.size.height / 2) * (ratio - 1);

      const context = this.canvas.getContext("2d");
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
    this.traceChanged();
  };

  private traceChanged = () => {
    this.traceIndexChange.emit(this.traceInd);

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
    this.traceInd++;

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
    }
  };

  private resetTrace = () => {
    this.traceInd = -1;
    this.resetTraceList();
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

    if (addTolist && this.traceList[this.traceInd]) {
      this.traceList[this.traceInd].paths.push({
        lastMousePositionX: lastMousePositionX,
        lastMousePositionY: lastMousePositionY,
        currentMousePositionX: currentMousePositionX,
        currentMousePositionY: currentMousePositionY
      });
    }
  };

  private paintToInd = (canvas: HTMLCanvasElement) => {
    let ind = 0;
    while (ind <= this.traceInd) {
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
      ind++;
    }
  };

  private resetTraceList = () => {
    this.traceList.splice(this.traceInd + 1);
  };

  private getRelativePositionX = (clientX: number) => {
    return clientX - this.canvas.getBoundingClientRect().left;
  };
  private getRelativePositionY = (clientY: number) => {
    return clientY - this.canvas.getBoundingClientRect().top;
  };

  render() {
    return (
      <Host
        role="img"
        aria-label={this.imageLabel}
        class={{
          [this.cssClass]: !!this.cssClass
        }}
      >
        <canvas
          id="canvas"
          part="canvas"
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
