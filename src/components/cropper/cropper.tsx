import {
  Component,
  Host,
  h,
  Element,
  Listen,
  Prop,
  State,
  Event,
  EventEmitter,
  Method,
  Watch
} from "@stencil/core";
import { GxCropperImageChangeEvent } from "../cropper-image/cropper-image";

const CROPPER_INITIAL_SIZE = 100;
const CROPPER_SELECTION_MARGIN = 100;

/**
 * @part body - The body of the popup of gx-cropper.
 * @part cropper-container - The container of gx-cropper.
 * @part cropper-image - Where reside the image.
 * @part cropper-selection - The selection tool of gx-cropper.
 */

@Component({
  tag: "gx-cropper",
  styleUrl: "cropper.scss",
  shadow: true
})
export class GxCropper {
  private canvas: HTMLCanvasElement = null;
  private calculateSizeTimer: NodeJS.Timeout = null;

  private cropperSelParent: HTMLElement = null;
  private cropperImg: HTMLGxCropperImageElement = null;
  private cropperSel: HTMLGxCropperSelectionElement = null;
  private cropperPress = false;
  private lastCropImageUrl: string = null;

  @Element() el: HTMLGxCropperElement;

  /**
   * The size of the cropper selection will be.
   */
  @State() cropSize: GxCropperSize = {
    width: CROPPER_INITIAL_SIZE,
    height: CROPPER_INITIAL_SIZE
  };

  /**
   * If the cropper is presented or not.
   */
  @State() presented: boolean;

  /**
   * A CSS class to set as the `gx-cropper` element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * The source for crop the image.
   */
  @Prop() readonly height: number = CROPPER_INITIAL_SIZE;

  /**
   * If the showBehavior is popup, calculate dimensions.
   */
  @Prop() readonly started = false;

  @Watch("started")
  startedHandler(newValue: boolean, oldValue = false) {
    if (newValue === oldValue || this.showBehavior === "Inline") {
      return;
    }

    if (newValue) {
      this.calculateSizeTimer = setTimeout(() => {
        this.calculateSize();
        clearTimeout(this.calculateSizeTimer);
      }, 300);
    }
  }

  /**
   * How the cropper will be show.
   */
  @Prop() readonly showBehavior: "Popup" | "Inline" = "Inline";

  /**
   * The source of the image.
   */
  @Prop() readonly src: string;

  /**
   * The width for crop the image.
   */
  @Prop() readonly width: number = CROPPER_INITIAL_SIZE;

  /**
   * Fired when the image has changed it size nor scale .
   */
  @Event({
    eventName: "gxCropperImageExported",
    bubbles: true
  })
  gxCropperImageExported: EventEmitter<string>;

  componentWillLoad() {
    this.canvas = document.createElement("canvas");
    this.setCanvasSize();

    window.addEventListener("resize", this.handleResize);
  }

  componentDidLoad() {
    this.cropperSelParent = this.el.shadowRoot.querySelector(".cropper-body");
    this.cropperSelParent.addEventListener("mousewheel", this.handleMousewheel);
    this.cropperSelParent.addEventListener("mousedown", this.handleMousedown);
    this.cropperSelParent.addEventListener("mousemove", this.handleMousemove);

    this.cropperImg = this.el.shadowRoot.querySelector("gx-cropper-image");
    this.cropperSel = this.el.shadowRoot.querySelector("gx-cropper-selection");
  }

  @Listen("gxCropperImageLoaded")
  handleGxCropperImageLoaded() {
    this.calculateSize();
  }

  @Listen("gxCropperImageChanged")
  handleGxCropperImageChanged(ev: CustomEvent<GxCropperImageChangeEvent>) {
    const context = this.canvas.getContext("2d");

    const image = ev.detail.img;
    const scale = ev.detail.scale;
    const realWidth = ev.detail.selectorWidth / scale;
    const realHeight = ev.detail.selectorHeight / scale;
    let moveW = (ev.detail.imgWidth - realWidth) / 2;
    let moveH = (ev.detail.imgHeight - realHeight) / 2;
    moveW -= ev.detail.moveLeft / scale;
    moveH -= ev.detail.moveTop / scale;

    context.drawImage(
      image,
      moveW,
      moveH,
      realWidth,
      realHeight,
      0,
      0,
      this.width,
      this.height
    );

    this.canvas.toBlob(blob => {
      if (this.lastCropImageUrl) {
        URL.revokeObjectURL(this.lastCropImageUrl);
        this.lastCropImageUrl = null;
      }
      const url = URL.createObjectURL(blob);
      if (url) {
        this.lastCropImageUrl = url;
      }
      this.gxCropperImageExported.emit(this.lastCropImageUrl);
    });
  }

  @Listen("mouseup", { target: "window" })
  handleWindowMouseup() {
    if (this.cropperPress) {
      this.cropperSel.showInside = false;
      this.cropperPress = false;
    }
  }

  /**
   * Get the cropped image.
   */
  @Method()
  async getLastCropImage(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.lastCropImageUrl) {
        resolve(this.lastCropImageUrl);
      }
      reject();
    });
  }

  private setCanvasSize = () => {
    this.canvas.setAttribute("width", `${this.width}px`);
    this.canvas.setAttribute("height", `${this.height}px`);
  };

  private calculateSize = () => {
    if (this.cropperSelParent) {
      const ratio = this.width / this.height;
      let selHeight = this.cropperSelParent.clientHeight;
      let selWidth = selHeight * ratio;
      if (selWidth > this.cropperSelParent.clientWidth) {
        selWidth = this.cropperSelParent.clientWidth - CROPPER_SELECTION_MARGIN;
        selHeight = selWidth / ratio;
      }
      this.cropSize = {
        width: selWidth,
        height: selHeight
      };
    }
  };

  private handleResize = () => {
    this.calculateSize();
  };

  private handleMousewheel = (ev: WheelEvent) => {
    if (ev.deltaY !== 0) {
      this.cropperImg.changeWhenScroll(ev.deltaY < 0);
    }
  };

  private handleMousedown = (ev: MouseEvent) => {
    ev.preventDefault();
    this.cropperPress = true;
  };

  private handleMousemove = (ev: MouseEvent) => {
    ev.preventDefault();
    if (this.cropperPress) {
      this.cropperSel.showInside = true;
      this.cropperImg.moveImage(ev.movementX, ev.movementY);
    }
  };

  render() {
    return (
      <Host
        class={{
          [this.cssClass]: !!this.cssClass
        }}
      >
        <div class="cropper-body" part="body">
          <gx-cropper-image
            part="cropper-image"
            src={this.src}
            size={this.cropSize}
          ></gx-cropper-image>
          <gx-cropper-selection
            part="cropper-selection"
            exportparts="selector-inside"
            size={this.cropSize}
            respect-aspect-ratio="true"
          ></gx-cropper-selection>
        </div>
      </Host>
    );
  }
}

export interface GxCropperSize {
  width: number;
  height: number;
}
