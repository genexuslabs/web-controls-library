import {
  Component,
  Host,
  h,
  Element,
  Prop,
  Event,
  EventEmitter,
  Method,
  Watch,
  Listen
} from "@stencil/core";
import { GxCropperSize } from "../cropper/cropper";
import { GxCropperSelectionIncreaseEvent } from "../cropper-selection/cropper-selection";

@Component({
  tag: "gx-cropper-image",
  styleUrl: "cropper-image.scss",
  shadow: true
})
export class GxCropperImage {
  private img: HTMLImageElement = null;
  private whoCenter = "h";
  private initialScale = 1;
  private scale: number = this.initialScale;
  private moveLeft = 0;
  private moveTop = 0;

  @Element() el: HTMLGxCropperImageElement;

  /**
   * The size for crop the image.
   */
  @Prop() readonly size: GxCropperSize;

  @Watch("size")
  watchPropHandler() {
    this.moveLeft = 0;
    this.moveTop = 0;
    this.calculateDimensions();
    this.changeImage();
  }

  /**
   * The source of the image.
   */
  @Prop() readonly src: string;

  /**
   * Fired when the image has finished load.
   */
  @Event({
    eventName: "gxCropperImageLoaded",
    bubbles: true
  })
  gxCropperImageLoaded: EventEmitter;

  /**
   * Fired when the image has changed it size nor scale .
   */
  @Event({
    eventName: "gxCropperImageChanged",
    bubbles: true
  })
  gxCropperImageChanged: EventEmitter<GxCropperImageChangeEvent>;

  componentDidLoad() {
    this.img = this.el.shadowRoot.querySelector("img");
    if (this.img) {
      this.img.addEventListener("load", this.loadImage);
    }
  }

  @Listen("gxCropperSelectionIncrease", { target: "document" })
  handleGxCropperSelectionIncrease(
    event: CustomEvent<GxCropperSelectionIncreaseEvent>
  ) {
    const hostWidth = this.el.clientWidth;
    const hostHeight = this.el.clientHeight;
    const imgWidth = this.img.width;
    const imgHeight = this.img.height;

    const ratio = event.detail.lastWidth / event.detail.newWidth;
    const newScale = this.scale * ratio;
    const newLeft = this.moveLeft * ratio;
    const newTop = this.moveTop * ratio;

    const newImgWidth = imgWidth * newScale;
    const newImgHeight = imgHeight * newScale;

    const newDistWidth = (newImgWidth - hostWidth) / 2;
    const newDistHeight = (newImgHeight - hostHeight) / 2;

    const wDiff = (this.size.width / 2) * (ratio - 1);
    const hDiff = (this.size.height / 2) * (ratio - 1);

    switch (event.detail.direction) {
      case "tl":
        this.moveLeft = newLeft - wDiff;
        this.moveTop = newTop - hDiff;
        break;
      case "tr":
        this.moveLeft = newLeft + wDiff;
        this.moveTop = newTop - hDiff;
        break;
      case "bl":
        this.moveLeft = newLeft - wDiff;
        this.moveTop = newTop + hDiff;
        break;
      case "br":
        this.moveLeft = newLeft + wDiff;
        this.moveTop = newTop + hDiff;
        break;
    }

    this.scale = this.calculateNewPlaceforImage(
      newDistWidth,
      newDistHeight,
      newLeft,
      newTop,
      newScale
    );

    const transform = `translate(${this.moveLeft}px, ${this.moveTop}px) scale(${this.scale})`;
    const imgAnimate = this.img.animate(
      [
        // keyframes
        { transform }
      ],
      {
        // timing options
        duration: 200,
        iterations: 1
      }
    );

    imgAnimate.onfinish = () => {
      this.img.style.transform = transform;

      this.gxCropperImageChanged.emit({
        img: this.img,
        scale: this.scale,
        imgWidth,
        imgHeight,
        selectorWidth: hostWidth,
        selectorHeight: hostHeight,
        moveLeft: this.moveLeft,
        moveTop: this.moveTop
      });
    };
  }

  /**
   * Change the image zoom when scrolling.
   */
  @Method()
  async changeWhenScroll(depth: boolean) {
    const hostWidth = this.el.clientWidth;
    const hostHeight = this.el.clientHeight;
    const imgWidth = this.img.width;
    const imgHeight = this.img.height;

    const proof = depth ? 0.03 : -0.03;
    let newScale = this.scale + proof;

    const newImgWidth = imgWidth * newScale;
    const newImgHeight = imgHeight * newScale;

    const newDistWidth = (newImgWidth - hostWidth) / 2;
    const newDistHeight = (newImgHeight - hostHeight) / 2;

    if (!depth) {
      newScale = this.calculateNewPlaceforImage(
        newDistWidth,
        newDistHeight,
        this.moveLeft,
        this.moveTop,
        newScale
      );
    }

    this.scale = newScale;
    this.img.style.transform = `translate(${this.moveLeft}px, ${this.moveTop}px) scale(${this.scale})`;

    this.gxCropperImageChanged.emit({
      img: this.img,
      scale: this.scale,
      imgWidth,
      imgHeight,
      selectorWidth: hostWidth,
      selectorHeight: hostHeight,
      moveLeft: this.moveLeft,
      moveTop: this.moveTop
    });
  }

  /**
   * Move image to the desired position.
   */
  @Method()
  async moveImage(left: number, top: number) {
    const hostBound = this.el.getBoundingClientRect();
    const imgBound = this.img.getBoundingClientRect();

    const imgWidth = this.img.width;
    const imgHeight = this.img.height;

    const newLeft = imgBound.left + left;
    const newRight = imgBound.right + left;
    const newTop = imgBound.top + top;
    const newBootom = imgBound.bottom + top;

    if (newLeft < hostBound.left && newRight > hostBound.right) {
      this.moveLeft += left;
    }

    if (newTop < hostBound.top && newBootom > hostBound.bottom) {
      this.moveTop += top;
    }

    this.img.style.transform = `translate(${this.moveLeft}px, ${this.moveTop}px) scale(${this.scale})`;

    this.gxCropperImageChanged.emit({
      img: this.img,
      scale: this.scale,
      imgWidth,
      imgHeight,
      selectorWidth: hostBound.width,
      selectorHeight: hostBound.height,
      moveLeft: this.moveLeft,
      moveTop: this.moveTop
    });
  }

  private calculateDimensions = () => {
    const parentWidth = this.el.parentElement.clientWidth;
    const parentHeight = this.el.parentElement.clientHeight;

    const wDiff = parentWidth - this.size.width;
    const hDiff = parentHeight - this.size.height;

    const top = hDiff / 2;
    const left = wDiff / 2;

    this.el.style.width = `${this.size.width}px`;
    this.el.style.height = `${this.size.height}px`;
    this.el.style.top = `${top}px`;
    this.el.style.left = `${left}px`;
  };

  private loadImage = () => {
    this.gxCropperImageLoaded.emit();
  };

  private changeImage = () => {
    const hostWidth = this.el.clientWidth;
    const hostHeight = this.el.clientHeight;

    const imgWidth = this.img.width;
    const imgHeight = this.img.height;
    if (imgWidth > 0 && imgHeight > 0) {
      const imgRatio = imgWidth / imgHeight;

      const selWidth = hostHeight * imgRatio;
      if (selWidth > hostWidth) {
        this.whoCenter = "v";
      }

      switch (this.whoCenter) {
        case "h":
          this.initialScale = hostWidth / imgWidth;
          break;

        case "v":
          this.initialScale = hostHeight / imgHeight;
          break;
      }

      this.scale = this.initialScale;

      const wDiff = hostWidth - imgWidth;
      const hDiff = hostHeight - imgHeight;

      this.img.style.left = `${wDiff / 2}px`;
      this.img.style.top = `${hDiff / 2}px`;

      this.img.style.transform = `translate(${this.moveLeft}px, ${this.moveTop}px) scale(${this.scale})`;
      this.gxCropperImageChanged.emit({
        img: this.img,
        scale: this.scale,
        imgWidth,
        imgHeight,
        selectorWidth: hostWidth,
        selectorHeight: hostHeight,
        moveLeft: this.moveLeft,
        moveTop: this.moveTop
      });
    }
  };

  private calculateNewPlaceforImage = (
    newDistWidth: number,
    newDistHeight: number,
    moveLeft: number,
    moveTop: number,
    newScale: number
  ) => {
    let hImgInBox = this.imageIsInBox(newDistWidth, moveLeft);
    let vImgInBox = this.imageIsInBox(newDistHeight, moveTop);

    if (!hImgInBox || !vImgInBox) {
      let newMoveLeft = moveLeft;
      if (!hImgInBox) {
        if (moveLeft > 0) {
          newMoveLeft = newDistWidth - 1;
        }
        if (moveLeft < 0) {
          newMoveLeft = -newDistWidth + 1;
        }
      }

      let newMoveTop = moveTop;
      if (!vImgInBox) {
        if (moveTop > 0) {
          newMoveTop = newDistHeight - 1;
        }
        if (moveTop < 0) {
          newMoveTop = -newDistHeight + 1;
        }
      }

      hImgInBox = this.imageIsInBox(newDistWidth, newMoveLeft);
      vImgInBox = this.imageIsInBox(newDistHeight, newMoveTop);
      if (hImgInBox && vImgInBox) {
        this.moveLeft = newMoveLeft;
        this.moveTop = newMoveTop;
      } else {
        this.moveLeft = 0;
        this.moveTop = 0;
        newScale = this.initialScale;
      }
    }

    return newScale;
  };

  private imageIsInBox = (dist: number, move: number) => {
    const x = dist - move;
    return x > 0 && x < dist * 2;
  };

  render() {
    return (
      <Host role="img" aria-label="Image to be cropped">
        <img src={this.src} alt="" />
      </Host>
    );
  }
}

export interface GxCropperImageChangeEvent {
  scale: number;
  imgWidth: number;
  imgHeight: number;
  selectorWidth: number;
  selectorHeight: number;
  moveLeft: number;
  moveTop: number;
  img: HTMLImageElement;
}
