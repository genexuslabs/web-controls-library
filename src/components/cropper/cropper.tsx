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

const WAIT_TO_REMOVE_POPUP = 300; // 300ms
const popupHeaderId = "header";

/**
 * @part cropper-container - The container of gx-cropper.
 * @part header - The header of the popup of gx-cropper.
 * @part body - The body of the popup of gx-cropper.
 * @part footer - The footer of the popup of gx-cropper.
 * @part close-button - The button for close the popup of gx-cropper.
 * @part cropper-image - Where reside the image.
 * @part cropper-selection - The selection tool of gx-cropper.
 *
 * @slot header - The slot where live the header title of the popup.
 * @slot primaryaction - The slot where live the primary action of popup.
 * @slot secondaryaction - The slot where live the secondary action of popup.
 */

@Component({
  tag: "gx-cropper",
  styleUrl: "cropper.scss",
  shadow: true
})
export class GxCropper {
  private canvas: HTMLCanvasElement = null;
  private dismissTimer: NodeJS.Timeout = null;
  private calculateSizeTimer: NodeJS.Timeout = null;

  private cropperSelParent: HTMLElement = null;
  private cropperImg: HTMLGxCropperImageElement = null;
  private cropperSel: HTMLGxCropperSelectionElement = null;
  // private cropOrientation = 'h';
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
   * This attribute lets you specify if the popup is automatically closed when an action is clicked.
   */
  @Prop() readonly autoClose: boolean;

  /**
   * This attribute lets you specify the label for the close button. Important for accessibility.
   */
  @Prop() readonly closeButtonLabel: string;

  /**
   * A CSS class to set as the `gx-cropper` element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * The source for crop the image.
   */
  @Prop() readonly height: number = CROPPER_INITIAL_SIZE;

  /**
   * If the showBehavior is popup, this attribute lets you specify if the popup is opened or closed.
   */
  @Prop({ mutable: true }) opened = false;

  @Watch("opened")
  openedHandler(newValue: boolean, oldValue = false) {
    if (newValue === oldValue) {
      return;
    }

    if (newValue) {
      clearTimeout(this.dismissTimer);
      this.presented = true;
      // Emit the event
      this.gxCropperPopupOpen.emit();

      this.calculateSizeTimer = setTimeout(() => {
        this.calculateSize();
      }, WAIT_TO_REMOVE_POPUP);
    } else {
      clearTimeout(this.calculateSizeTimer);
      this.dismissTimer = setTimeout(() => {
        this.presented = false;
        // Emit the event after the dismiss animation has finished
        this.gxCropperPopupClose.emit();
      }, WAIT_TO_REMOVE_POPUP);
    }
  }

  /**
   * This attribute lets you specify the height of the popup.
   */
  @Prop() readonly popupHeight: string = null;

  /**
   * This attribute lets you specify the width of the popup.
   */
  @Prop() readonly popupWidth: string = null;

  /**
   * This attribute lets you specify if a footer is rendered at the bottom of the popup.
   */
  @Prop() readonly showFooter: boolean = true;

  /**
   * How the cropper will be show.
   */
  @Prop() readonly showBehavior: "popup" | "inline" = "inline";

  /**
   * This attribute lets you specify if a header is rendered on top of the popup.
   */
  @Prop() readonly showHeader: boolean = true;

  /**
   * The source of the image.
   */
  @Prop() readonly src: string;

  /**
   * The width for crop the image.
   */
  @Prop() readonly width: number = CROPPER_INITIAL_SIZE;

  /**
   * Fired when the popup is closed
   */
  @Event({
    eventName: "gxCropperPopupClose",
    bubbles: true
  })
  gxCropperPopupClose: EventEmitter;

  /**
   * Fired when the popup is opened
   */
  @Event({
    eventName: "gxCropperPopupOpen",
    bubbles: true
  })
  @Event()
  gxCropperPopupOpen: EventEmitter;

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
    // if (this.height > this.width) this.cropOrientation = 'v';

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

  private closePopup = (e: UIEvent) => {
    e.stopPropagation();

    if (this.showBehavior === "inline" || !this.opened) {
      return;
    }
    this.opened = false;
  };

  private stopPropagation = (e: UIEvent) => {
    e.stopPropagation();
  };

  render() {
    const isPopup = this.showBehavior === "popup";
    return (
      <Host
        class={{
          [this.cssClass]: !!this.cssClass,
          popup: isPopup,
          presented: isPopup && this.presented,
          "dismiss-animation": isPopup && !this.opened
        }}
        onClick={this.closePopup}
      >
        <div class="background-shadow">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={this.showHeader ? popupHeaderId : undefined}
            tabindex="-1"
            part="cropper-container"
            onClick={this.stopPropagation}
            class={{
              "cropper-container": true,
              "gx-modal-dialog": isPopup
            }}
            style={{
              width: this.popupWidth,
              height: this.popupHeight,
              "min-width": this.popupWidth
            }}
          >
            {isPopup && (
              <button
                aria-label={this.closeButtonLabel}
                part="close-button"
                class="close-button"
                type="button"
                onClick={this.closePopup}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14">
                  <path d="M13 1L1 13" class="vector" />
                  <path d="M1 1L13 13" class="vector" />
                </svg>
              </button>
            )}
            {this.showHeader && (
              <div
                part="header"
                class="header"
                // ref={el => (this.headerDiv = el as HTMLDivElement)}
              >
                <h5 id={popupHeaderId}>
                  <slot name="header" />
                </h5>
              </div>
            )}
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
            {this.showFooter && (
              <div part="footer" class="footer">
                <slot name="secondaryaction" />
                <slot name="primaryaction" />
              </div>
            )}
          </div>
        </div>
      </Host>
    );
  }
}

export interface GxCropperSize {
  width: number;
  height: number;
}
