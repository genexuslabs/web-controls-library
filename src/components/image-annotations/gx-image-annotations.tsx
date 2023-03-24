import { Component, Host, h, Element, Prop, State, Method } from '@stencil/core';

/**
 * @part canvas - The canvas where to make the annotations.
 */
@Component({
  tag: 'gx-image-annotations',
  styleUrl: 'gx-image-annotations.css',
  shadow: true,
})
export class GxImageAnnotations {
  private canvas: HTMLCanvasElement = null;
  private canvasAnn: any = null;
  private baseImage: HTMLImageElement = null;
  private initPaint = false;
  private xAnterior = 0;
  private yAnterior = 0;
  private xActual = 0;
  private yActual = 0;
  private lastSavedImageUrl: string = null;
  private lastSavedImageAnnUrl: string = null;

  @Element() el: HTMLGxImageAnnotationsElement;

  /**
   * The list of traces that have been painted.
   */
  @State() traceList: TraceData[] = [];

  /**
   * The actual index that the trace list in.
   */
  @State() traceInd = -1;

  /**
   * The size of the cropper selection will be.
   */
  @State() colorsItems: string[] = [];

  /**
   * A CSS class to set as the `gx-image-annotations` element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * Drawing color.
   */
  @Prop({ mutable: true }) traceColor = '#000000';

  /**
   * Drawing thickness.
   */
  @Prop({ mutable: true }) traceThickness: number = 2;

  /**
   * The source of the background image.
   */
  @Prop() backgroundImage: string;

  /**
   * If the annotations are activated or not.
   */
  @Prop() enabled: boolean = true;

  /**
   * If the component are visible or not.
   */
  @Prop() visible: boolean = true;

  /**
   * How the component will hide.
   */
  @Prop() invisibleMode: "Keep Space" | "Collapse Space" = "Keep Space";

  componentDidLoad() {
    this.canvas = this.el.shadowRoot.querySelector('#canvas');
    this.canvas.width = this.el.clientWidth;
    this.canvas.height = this.el.clientHeight;
    this.canvasAnn = this.canvas.cloneNode();
    this.canvas.addEventListener('mousedown', this.handleMousedown);
    this.canvas.addEventListener('mousemove', this.handleMousemove);
    this.canvas.addEventListener('mouseup', this.finishPaint);
    this.canvas.addEventListener('mouseout', this.finishPaint);

    if (this.backgroundImage) {
      this.baseImage = new Image();
      this.baseImage.src = this.backgroundImage;
      this.baseImage.addEventListener('load', this.loadImage);
    }
  }

  componentWillLoad() {}

  @Method()
  async cleanAll(): Promise<void> {
    this.resetTrace();
    this.cleanPaint(this.canvas);
    this.loadImage();
    this.traceChanged();
  }

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

  @Method()
  async getLastSavedImage(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.lastSavedImageUrl) resolve(this.lastSavedImageUrl);
      reject();
    });
  }

  @Method()
  async getLastSavedImageAnnotations(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.lastSavedImageAnnUrl) resolve(this.lastSavedImageAnnUrl);
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

      let ratio = imgWidth/imgHeight;
      let newImgWidth = hostWidth;
      let newImgHeight = hostHeight;
      if(imgWidth > imgHeight){
        ratio = imgHeight/imgWidth;
        newImgHeight = hostHeight*ratio;
        newTop = (hostHeight-newImgHeight)/2;
      }
      else{
        newImgWidth = hostWidth*ratio;
        newLeft = (hostWidth-newImgWidth)/2;
      }



      // let newDistWidth = (newImgWidth - hostWidth) / 2;
      // let newDistHeight = (newImgHeight - hostHeight) / 2;

      // const wDiff = (this.size.width / 2) * (ratio - 1);
      // const hDiff = (this.size.height / 2) * (ratio - 1);

      const context = this.canvas.getContext('2d');
      context.drawImage(this.baseImage, 0, 0, this.baseImage.width, this.baseImage.height, newLeft, newTop, newImgWidth, newImgHeight);
    }
  };

  private traceChanged = () => {
    this.canvas.toBlob(blob => {
      if(this.lastSavedImageUrl){
        URL.revokeObjectURL(this.lastSavedImageUrl);
        this.lastSavedImageUrl = null;
      }
      const url = URL.createObjectURL(blob);
      if (url) this.lastSavedImageUrl = url;
    });

    this.cleanPaint(this.canvasAnn);
    this.paintToInd(this.canvasAnn);
    this.canvasAnn.toBlob(blob => {
      if(this.lastSavedImageAnnUrl){
        URL.revokeObjectURL(this.lastSavedImageAnnUrl);
        this.lastSavedImageAnnUrl = null;
      }
      const url = URL.createObjectURL(blob);
      if (url) this.lastSavedImageAnnUrl = url;
    });
  };

  private handleMousedown = (ev: MouseEvent) => {
    if(this.enabled){
      ev.preventDefault();
      // En este evento solo se ha iniciado el clic, así que dibujamos un punto
      this.xAnterior = this.xActual;
      this.yAnterior = this.yActual;
      this.xActual = this.getRealX(ev.clientX);
      this.yActual = this.getRealY(ev.clientY);

      // Y establecemos la bandera
      this.initPaint = true;

      this.resetTraceList();
      this.traceList.push({
        color: this.traceColor,
        thickness: this.traceThickness,
        point: { x: this.xActual, y: this.yActual },
        paths: [],
      });
      this.traceInd++;

      this.paintToInd(this.canvas);
      this.traceChanged();
    }
  };

  private handleMousemove = (ev: MouseEvent) => {
    if(this.enabled){
      ev.preventDefault();

      if (!this.initPaint) {
        return;
      }
      // El mouse se está moviendo y el usuario está presionando el botón, así que dibujamos todo

      this.xAnterior = this.xActual;
      this.yAnterior = this.yActual;
      this.xActual = this.getRealX(ev.clientX);
      this.yActual = this.getRealY(ev.clientY);
      this.joinPath(this.canvas, this.xAnterior, this.yAnterior, this.xActual, this.yActual, this.traceColor, this.traceThickness);
    }
  };

  private finishPaint = (ev: MouseEvent) => {
    if(this.enabled){
      ev.preventDefault();
      this.initPaint = false;
      this.traceChanged();
    }
  };

  private cleanPaint = (canvas: HTMLCanvasElement) => {
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  private resetTrace = () => {
    this.traceInd = -1;
    this.resetTraceList();
  };

  private paintPoint = (canvas: HTMLCanvasElement, xActual: number, yActual: number, color: string, thickness: number) => {
    const context = canvas.getContext('2d');
    context.beginPath();
    context.fillStyle = color;
    context.fillRect(xActual, yActual, thickness, thickness);
    context.closePath();
  };

  private joinPath = (canvas: HTMLCanvasElement, xAnterior: number, yAnterior: number, xActual: number, yActual: number, color: string, thickness: number, addTolist = true) => {
    const context = canvas.getContext('2d');
    context.beginPath();
    context.moveTo(xAnterior, yAnterior);
    context.lineTo(xActual, yActual);
    context.strokeStyle = color;
    context.lineWidth = thickness;
    context.stroke();
    context.closePath();

    if (addTolist) {
      if (this.traceList[this.traceInd]) {
        this.traceList[this.traceInd].paths.push({
          xAnterior,
          yAnterior,
          xActual,
          yActual,
        });
      }
    }
  };

  private paintToInd = (canvas: HTMLCanvasElement) => {
    let ind = 0;
    while (ind <= this.traceInd) {
      const trace = this.traceList[ind];
      this.paintPoint(canvas, trace.point.x, trace.point.y, trace.color, trace.thickness);
      for (let path of trace.paths) {
        this.joinPath(canvas, path.xAnterior, path.yAnterior, path.xActual, path.yActual, trace.color, trace.thickness, false);
      }
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
        role="img" aria-label="Image to be annotated"
        class={{
          [this.cssClass]: !!this.cssClass,
          'hide-keep': !this.visible && this.invisibleMode === 'Keep Space',
          'hide-collapse': !this.visible && this.invisibleMode === 'Collapse Space',
        }}
      >
        <canvas id="canvas" part="canvas"></canvas>
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
  xAnterior: number;
  yAnterior: number;
  xActual: number;
  yActual: number;
}
