import {
  Component,
  Host,
  h,
  Element,
  Prop,
  State,
  Method
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
  private xBefore = 0;
  private yBefore = 0;
  private xCurrent = 0;
  private yCurrent = 0;
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
   * The source of the background image.
   */
  @Prop() readonly backgroundImageSrc: string;

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

  componentDidLoad() {
    this.canvas.width = this.el.clientWidth;
    this.canvas.height = this.el.clientHeight;
    this.canvasAnn = this.canvas.cloneNode();
    this.canvas.addEventListener("mousedown", this.handleMousedown);
    this.canvas.addEventListener("mouseup", this.finishPaint);
    this.canvas.addEventListener("mouseout", this.finishPaint);

    this.canvas.addEventListener("touchstart", this.handleTouchStart);
    this.canvas.addEventListener("touchend", this.finishPaint);
    this.canvas.addEventListener("touchcancel", this.finishPaint);
    this.canvas.addEventListener("touchleave", this.finishPaint);

    if (this.backgroundImageSrc) {
      this.baseImage = new Image();
      this.baseImage.src = this.backgroundImageSrc;
      this.baseImage.addEventListener("load", this.loadImage);
    }
  }

  /**
   * Clean all annotations in canvas and memory.
   */
  @Method()
  async cleanAll(): Promise<void> {
    this.resetTrace();
    this.cleanPaint(this.canvas);
    this.loadImage();
    this.traceChanged();
  }

  /**
   * Go back one step, if the array of annotations have any: erase the last annotation.
   */
  @Method()
  async goBack(): Promise<void> {
    if (this.traceInd >= 0) {
      this.traceInd--;
      this.cleanPaint(this.canvas);
      this.loadImage();
      this.paintToInd(this.canvas);
      this.traceChanged();
    }
  }

  /**
   * Go foward one step, if the array of annotations have any and user go back previously: recover the annotation in the index where it is.
   */
  @Method()
  async goTo(): Promise<void> {
    if (this.traceInd < this.traceList.length - 1) {
      this.traceInd++;
      this.cleanPaint(this.canvas);
      this.loadImage();
      this.paintToInd(this.canvas);
      this.traceChanged();
    }
  }

  /**
   * Get the last image with annotations that have the gx-image-annotations.
   */
  @Method()
  async getLastSavedImage(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.lastSavedImageUrl) {
        resolve(this.lastSavedImageUrl);
      }

      reject();
    });
  }

  /**
   * Get the last annotations only that have the gx-image-annotations.
   */
  @Method()
  async getLastSavedImageAnnotations(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.lastSavedImageAnnUrl) {
        resolve(this.lastSavedImageAnnUrl);
      }

      reject();
    });
  }

  private loadImage = () => {
    if (this.baseImage) {
      const hostWidth = this.canvas.width;
      const hostHeight = this.canvas.height;
      const imgWidth = this.baseImage.width;
      const imgHeight = this.baseImage.height;

      let newLeft = 0;
      let newTop = 0;

      let ratio = imgWidth / imgHeight;
      let newImgWidth = hostWidth;
      let newImgHeight = hostHeight;
      if (imgWidth > imgHeight) {
        ratio = imgHeight / imgWidth;
        newImgHeight = hostHeight * ratio;
        newTop = (hostHeight - newImgHeight) / 2;
      } else {
        newImgWidth = hostWidth * ratio;
        newLeft = (hostWidth - newImgWidth) / 2;
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
  };

  private traceChanged = () => {
    this.canvas.toBlob(blob => {
      if (this.lastSavedImageUrl) {
        URL.revokeObjectURL(this.lastSavedImageUrl);
        this.lastSavedImageUrl = null;
      }

      const url = URL.createObjectURL(blob);
      if (url) {
        this.lastSavedImageUrl = url;
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
      }
    });
  };

  private handleMousedown = (ev: MouseEvent) => {
    if (!this.disabled) {
      this.canvas.addEventListener("mousemove", this.handleMousemove);
      ev.preventDefault();

      this.startPainting(ev.clientX, ev.clientY);
    }
  };

  private handleTouchStart = (ev: TouchEvent) => {
    if (!this.disabled) {
      this.canvas.addEventListener("touchmove", this.handleTouchmove);
      ev.preventDefault();

      const touches = ev.changedTouches;
      this.startPainting(touches[0].pageX, touches[0].pageY);
    }
  };

  private startPainting = (pageX: number, pageY: number) => {
    // In this event we only have initiated the click, so we will draw a point
    this.xBefore = this.xCurrent;
    this.yBefore = this.yCurrent;
    this.xCurrent = this.getRealX(pageX);
    this.yCurrent = this.getRealY(pageY);

    // And put the flag
    this.initPaint = true;

    this.resetTraceList();
    this.traceList.push({
      color: this.traceColor,
      thickness: this.traceThickness,
      point: { x: this.xCurrent, y: this.yCurrent },
      paths: []
    });
    this.traceInd++;

    this.paintToInd(this.canvas);
    this.traceChanged();
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

    this.xBefore = this.xCurrent;
    this.yBefore = this.yCurrent;
    this.xCurrent = this.getRealX(pageX);
    this.yCurrent = this.getRealY(pageY);
    this.joinPath(
      this.canvas,
      this.xBefore,
      this.yBefore,
      this.xCurrent,
      this.yCurrent,
      this.traceColor,
      this.traceThickness
    );
  };

  private finishPaint = (ev: MouseEvent) => {
    if (!this.disabled) {
      ev.preventDefault();
      this.canvas.removeEventListener("mousemove", this.handleMousemove);
      this.canvas.addEventListener("touchmove", this.handleTouchmove);
      this.initPaint = false;
      this.traceChanged();
    }
  };

  private cleanPaint = (canvas: HTMLCanvasElement) => {
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  private resetTrace = () => {
    this.traceInd = -1;
    this.resetTraceList();
  };

  private paintPoint = (
    canvas: HTMLCanvasElement,
    xCurrent: number,
    yCurrent: number,
    color: string,
    thickness: number
  ) => {
    const context = canvas.getContext("2d");
    context.beginPath();
    context.fillStyle = color;
    context.fillRect(xCurrent, yCurrent, thickness, thickness);
    context.closePath();
  };

  private joinPath = (
    canvas: HTMLCanvasElement,
    xBefore: number,
    yBefore: number,
    xCurrent: number,
    yCurrent: number,
    color: string,
    thickness: number,
    addTolist = true
  ) => {
    const context = canvas.getContext("2d");
    context.beginPath();
    context.moveTo(xBefore, yBefore);
    context.lineTo(xCurrent, yCurrent);
    context.strokeStyle = color;
    context.lineWidth = thickness;
    context.stroke();
    context.closePath();

    if (addTolist && this.traceList[this.traceInd]) {
      this.traceList[this.traceInd].paths.push({
        xBefore: xBefore,
        yBefore: yBefore,
        xCurrent: xCurrent,
        yCurrent: yCurrent
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
          path.xBefore,
          path.yBefore,
          path.xCurrent,
          path.yCurrent,
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

  private getRealX = (clientX: number) => {
    return clientX - this.canvas.getBoundingClientRect().left;
  };
  private getRealY = (clientY: number) => {
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
  xBefore: number;
  yBefore: number;
  xCurrent: number;
  yCurrent: number;
}
