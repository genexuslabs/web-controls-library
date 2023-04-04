import {
  Component,
  Host,
  h,
  Element,
  Prop,
  Watch,
  Event,
  EventEmitter
} from "@stencil/core";
import { GxCropperSize } from "../cropper/cropper";

const MINIMUM_SIZE = 20;
const ARROWUP_KEY_CODE = "ArrowUp";
const ARROWLEFT_KEY_CODE = "ArrowLeft";
const ARROWDOWN_KEY_CODE = "ArrowDown";
const ARROWRIGHT_KEY_CODE = "ArrowRight";
const ENTER_KEY_CODE = "Enter";
const SPACE_KEY_CODE = "Space";

/**
 * @part selector-inside - The inside part of the selector tool.
 */

@Component({
  tag: "gx-cropper-selection",
  styleUrl: "cropper-selection.scss",
  shadow: true
})
export class GxCropperSelection {
  private scale = 1;
  private moveLeft = 0;
  private moveTop = 0;
  private moveAspectRatio = 1;
  private cornerPress: HTMLDivElement = null;

  private originalWidth = 0;
  private originalHeight = 0;
  private originalX = 0;
  private originalY = 0;
  private originalMouseX = 0;
  private originalMouseY = 0;
  private originalKeyBoardX = 0;
  private originalKeyBoardY = 0;
  private moveCornerFromKey = true;

  private actualWidth = 0;
  private actualHeight = 0;
  private actualDirection = "";

  @Element() el: HTMLGxCropperSelectionElement;

  /**
   * Respect aspect ratio of width and height.
   */
  @Prop() readonly respectAspectRatio = true;

  /**
   * Show or not the grid inside the selector cropper.
   */
  @Prop({ mutable: true }) showInside = false;

  /**
   * The size for crop the image.
   */
  @Prop() readonly size: GxCropperSize;

  @Watch("size")
  watchPropHandler() {
    this.calculateTransformSelector();
  }

  /**
   * Fired when the selector increases it dimensions.
   */
  @Event({
    eventName: "gxCropperSelectionIncrease",
    bubbles: true
  })
  gxCropperSelectionIncrease: EventEmitter<GxCropperSelectionIncreaseEvent>;

  componentDidLoad() {
    this.el.shadowRoot
      .querySelectorAll(".corner")
      .forEach((corner: HTMLDivElement) => {
        if (corner) {
          corner.addEventListener("mousedown", this.handleCornerMousedown);
          corner.addEventListener("keydown", this.handleActionKeyDown);
          corner.addEventListener("focus", this.handleCornerFocus);
          corner.addEventListener("blur", this.handleCornerBlur);
        }
      });
  }

  private handleActionKeyDown = (keyboardEvent: KeyboardEvent) => {
    if (this.moveCornerFromKey) {
      switch (keyboardEvent.code) {
        case ARROWUP_KEY_CODE:
        case ARROWLEFT_KEY_CODE:
        case ARROWDOWN_KEY_CODE:
        case ARROWRIGHT_KEY_CODE:
          keyboardEvent.preventDefault();
          this.resizeSelectorFromKey(keyboardEvent.code);
          break;
        case ENTER_KEY_CODE:
        case SPACE_KEY_CODE:
          keyboardEvent.preventDefault();
          this.resetCornerData();
          break;
      }
    }
  };

  private handleCornerFocus = (event: FocusEvent) => {
    event.stopPropagation();
    event.preventDefault();
    this.cornerPress = event.target as HTMLDivElement;
    this.putCornerDataFromFocus();
  };

  private handleCornerBlur = () => {
    this.cornerPress = null;
    this.resetCornerData();
  };

  private resetCornerData = () => {
    this.calculateTransformSelector(true);

    this.showInside = false;
    this.moveCornerFromKey = false;
    setTimeout(() => {
      this.moveCornerFromKey = true;
      this.putCornerDataFromFocus();
    }, 600);
  };

  private putCornerDataFromFocus = () => {
    if (this.cornerPress) {
      this.originalWidth = parseFloat(
        getComputedStyle(this.el, null)
          .getPropertyValue("width")
          .replace("px", "")
      );
      this.originalHeight = parseFloat(
        getComputedStyle(this.el, null)
          .getPropertyValue("height")
          .replace("px", "")
      );
      this.originalX = this.moveLeft;
      this.originalY = this.moveTop;
      this.originalMouseX = this.cornerPress.getBoundingClientRect().x;
      this.originalMouseY = this.cornerPress.getBoundingClientRect().y;
      this.originalKeyBoardX = this.originalMouseX;
      this.originalKeyBoardY = this.originalMouseY;
    }
  };

  private handleCornerMousedown = (ev: MouseEvent) => {
    ev.stopPropagation();
    ev.preventDefault();

    this.originalWidth = parseFloat(
      getComputedStyle(this.el, null)
        .getPropertyValue("width")
        .replace("px", "")
    );
    this.originalHeight = parseFloat(
      getComputedStyle(this.el, null)
        .getPropertyValue("height")
        .replace("px", "")
    );
    this.originalX = this.moveLeft;
    this.originalY = this.moveTop;
    this.originalMouseX = ev.pageX;
    this.originalMouseY = ev.pageY;

    ev.composedPath().forEach((item: HTMLElement) => {
      if (item.classList && item.classList.contains("corner")) {
        this.cornerPress = item as HTMLDivElement;
      }
    });

    window.addEventListener("mousemove", this.resizeSelectorFromMouse);
    window.addEventListener("mouseup", this.stopResizeSelector);
  };

  private resizeSelectorFromKey = (key: string) => {
    if (this.cornerPress) {
      let valWidth = 1;
      let valHeight = 1;
      if (
        this.cornerPress.classList.contains("corner-tl") ||
        this.cornerPress.classList.contains("corner-br")
      ) {
        switch (key) {
          case ARROWUP_KEY_CODE:
          case ARROWLEFT_KEY_CODE:
            valWidth = -1;
            valHeight = -1;
            break;
          case ARROWDOWN_KEY_CODE:
          case ARROWRIGHT_KEY_CODE:
            // nop
            break;
        }
      }
      if (
        this.cornerPress.classList.contains("corner-tr") ||
        this.cornerPress.classList.contains("corner-bl")
      ) {
        switch (key) {
          case ARROWUP_KEY_CODE:
          case ARROWRIGHT_KEY_CODE:
            valHeight = -1;
            break;
          case ARROWDOWN_KEY_CODE:
          case ARROWLEFT_KEY_CODE:
            valWidth = -1;
            break;
        }
      }

      this.originalKeyBoardX += 10 * valWidth;
      this.originalKeyBoardY += 10 * valHeight;

      // if (this.cornerPress.classList.contains('corner-tl')){
      //   if(this.originalKeyBoardX < this.originalMouseX) this.originalKeyBoardX = this.originalMouseX;
      //   if(this.originalKeyBoardY < this.originalMouseY) this.originalKeyBoardY = this.originalMouseY;
      // }
      // if (this.cornerPress.classList.contains('corner-br')){
      //   if(this.originalKeyBoardX > this.originalMouseX) this.originalKeyBoardX = this.originalMouseX;
      //   if(this.originalKeyBoardY > this.originalMouseY) this.originalKeyBoardY = this.originalMouseY;
      // }
      // if (this.cornerPress.classList.contains('corner-tr')){
      //   if(this.originalKeyBoardX > this.originalMouseX) this.originalKeyBoardX = this.originalMouseX;
      //   if(this.originalKeyBoardY < this.originalMouseY) this.originalKeyBoardY = this.originalMouseY;
      // }
      // if (this.cornerPress.classList.contains('corner-bl')){
      //   if(this.originalKeyBoardX < this.originalMouseX) this.originalKeyBoardX = this.originalMouseX;
      //   if(this.originalKeyBoardY > this.originalMouseY) this.originalKeyBoardY = this.originalMouseY;
      // }

      const width = this.originalKeyBoardX - this.originalMouseX;
      const height = this.originalKeyBoardY - this.originalMouseY;

      this.resizeSelector(width, height);
    }
  };

  private resizeSelectorFromMouse = (e: MouseEvent) => {
    if (this.cornerPress) {
      const width = e.pageX - this.originalMouseX;
      const height = e.pageY - this.originalMouseY;

      this.resizeSelector(width, height);
    }
  };

  private resizeSelector = (width: number, height: number) => {
    if (this.cornerPress) {
      this.showInside = true;

      let finalWidth = 0;
      let finalHeight = 0;
      const heightAspectRatio = width / this.moveAspectRatio;
      let adjustWidth = true;
      let adjustHeight = true;

      let moveLeft = this.moveLeft;
      let moveTop = this.moveTop;

      if (this.cornerPress.classList.contains("corner-br")) {
        this.actualDirection = "br";
        finalWidth = this.originalWidth + width;
        if (this.respectAspectRatio) {
          finalHeight = this.originalHeight + heightAspectRatio;
          if (width > 0) {
            adjustWidth = false;
          }
          if (height > 0) {
            adjustHeight = false;
          }
        } else {
          finalHeight = this.originalHeight + height;
        }
      } else if (this.cornerPress.classList.contains("corner-bl")) {
        this.actualDirection = "bl";
        finalWidth = this.originalWidth - width;
        if (this.respectAspectRatio) {
          moveLeft = this.originalX + width;
          finalHeight = this.originalHeight - heightAspectRatio;
          if (width < 0) {
            adjustWidth = false;
          }
          if (height > 0) {
            adjustHeight = false;
          }
        } else {
          moveLeft = this.originalX + width;
          finalHeight = this.originalHeight + height;
        }
      } else if (this.cornerPress.classList.contains("corner-tr")) {
        this.actualDirection = "tr";
        finalWidth = this.originalWidth + width;
        if (this.respectAspectRatio) {
          moveTop = this.originalY - heightAspectRatio;
          finalHeight = this.originalHeight + heightAspectRatio;
          if (width > 0) {
            adjustWidth = false;
          }
          if (height < 0) {
            adjustHeight = false;
          }
        } else {
          moveTop = this.originalY + height;
          finalHeight = this.originalHeight - height;
        }
      } else if (this.cornerPress.classList.contains("corner-tl")) {
        this.actualDirection = "tl";
        finalWidth = this.originalWidth - width;
        if (this.respectAspectRatio) {
          moveLeft = this.originalX + width;
          moveTop = this.originalY + heightAspectRatio;
          finalHeight = this.originalHeight - heightAspectRatio;
          if (width < 0) {
            adjustWidth = false;
          }
          if (height < 0) {
            adjustHeight = false;
          }
        } else {
          moveLeft = this.originalX + width;
          moveTop = this.originalY + height;
          finalHeight = this.originalHeight - height;
        }
      }

      if (!this.respectAspectRatio || (adjustWidth && adjustHeight)) {
        if (finalWidth > MINIMUM_SIZE) {
          this.el.style.width = `${finalWidth}px`;
          this.moveLeft = moveLeft;
        }
        if (finalHeight > MINIMUM_SIZE && adjustHeight) {
          this.el.style.height = `${finalHeight}px`;
          this.moveTop = moveTop;
        }

        this.transformSelector();
      } else if (this.respectAspectRatio) {
        this.gxCropperSelectionIncrease.emit({
          lastWidth: this.actualWidth,
          lastHeight: this.actualHeight,
          newWidth: finalWidth,
          newHeight: finalHeight,
          direction: this.actualDirection
        });
      }
    }
  };

  private stopResizeSelector = () => {
    window.removeEventListener("mousemove", this.resizeSelectorFromMouse);
    window.removeEventListener("mouseup", this.stopResizeSelector);
    this.cornerPress = null;
    this.calculateTransformSelector(true);

    this.showInside = false;
  };

  private calculateTransformSelector = (animate = false) => {
    if (!animate) {
      this.el.style.width = `${this.size.width}px`;
      this.el.style.height = `${this.size.height}px`;
    }

    const parentWidth = this.el.parentElement.clientWidth;
    const parentHeight = this.el.parentElement.clientHeight;

    let selWidth = this.size.width;
    let selHeight = this.size.height;
    if (!this.respectAspectRatio) {
      selWidth = parseInt(this.el.style.width);
      selHeight = parseInt(this.el.style.height);
    }

    const wDiff = parentWidth - selWidth;
    const hDiff = parentHeight - selHeight;

    this.moveTop = hDiff / 2;
    this.moveLeft = wDiff / 2;

    this.el.style.outlineWidth = `${
      Math.max(parentWidth, parentHeight) + 100
    }px`;

    this.transformSelector(animate);
  };

  private transformSelector = (animate = false) => {
    const transform = `translate(${this.moveLeft}px, ${this.moveTop}px) scale(${this.scale})`;

    const elWidth = parseInt(this.el.style.width);
    const elHeight = parseInt(this.el.style.height);
    let newWidth = this.size.width;
    let newHeight = this.size.height;
    if (!this.respectAspectRatio) {
      newWidth = elWidth;
      newHeight = elHeight;
    }

    const lastWidth = this.actualWidth;
    const lastHeight = this.actualHeight;

    this.actualWidth = newWidth;
    this.actualHeight = newHeight;

    if (animate) {
      const selectorAnimate = this.el.animate(
        [
          // keyframes
          { transform, width: `${newWidth}px`, height: `${newHeight}px` }
        ],
        {
          // timing options
          duration: 200,
          iterations: 1
        }
      );

      this.gxCropperSelectionIncrease.emit({
        lastWidth,
        lastHeight,
        newWidth: elWidth,
        newHeight: elHeight,
        direction: this.actualDirection
      });

      selectorAnimate.onfinish = () => {
        this.el.style.transform = transform;
        this.el.style.width = `${newWidth}px`;
        this.el.style.height = `${newHeight}px`;
      };
    } else {
      this.el.style.transform = transform;
    }
  };

  render() {
    return (
      <Host>
        <div class="corner corner-tl" tabindex="0">
          <div class="corner-visual"></div>
        </div>
        <div class="corner corner-tr" tabindex="0">
          <div class="corner-visual"></div>
        </div>
        <div class="corner corner-bl" tabindex="0">
          <div class="corner-visual"></div>
        </div>
        <div class="corner corner-br" tabindex="0">
          <div class="corner-visual"></div>
        </div>

        <div
          id="selector-inside"
          class={{
            visible: this.showInside
          }}
          part="selector-inside"
        >
          <div class="grid">
            <div class="row"></div>
            <div class="row"></div>
            <div class="row"></div>
          </div>
          <div class="grid grid-col">
            <div class="row"></div>
            <div class="row"></div>
            <div class="row"></div>
          </div>
        </div>
      </Host>
    );
  }
}

export interface GxCropperSelectionIncreaseEvent {
  lastWidth: number;
  lastHeight: number;
  newWidth: number;
  newHeight: number;
  direction: string;
}
