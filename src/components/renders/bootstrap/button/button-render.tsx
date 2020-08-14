import { h, Host } from "@stencil/core";
import { Renderer } from "../../../common/interfaces";
import { Button } from "../../../button/button";
import {
  imagePositionRender,
  imagePositionClass,
  hideMainImageWhenDisabledClass
} from "../../../common/image-position";

export class ButtonRender implements Renderer {
  constructor(private component: Button, handlers: { handleClick }) {
    this.handleClick = handlers.handleClick;
  }

  private handleClick: (event: UIEvent) => void;
  private hasDisabledImage = false;

  componentWillLoad() {
    const element = this.component.element;
    this.hasDisabledImage =
      element.querySelector("[slot='disabled-image']") !== null;
  }

  render(slots: { default; disabledImage; mainImage }) {
    const button = this.component;

    // Main image and disabled image are set an empty alt as they are decorative images.
    const images = button.element.querySelectorAll(
      "[slot='main-image'], [slot='disabled-image']"
    );
    Array.from(images).forEach((img: HTMLImageElement) => {
      if (!img.alt) {
        img.setAttribute("alt", "");
      }
    });

    return (
      <Host
        role="button"
        class={{
          "gx-button--disabled": this.component.disabled,
          [imagePositionClass(this.component.imagePosition)]: true,
          [hideMainImageWhenDisabledClass]:
            this.component.disabled && this.hasDisabledImage
        }}
      >
        <gx-bootstrap />
        <button
          class={{
            btn: true,
            "btn-lg": button.size === "large",
            "btn-outline-secondary": true,
            "btn-sm": button.size === "small",
            "gx-button": true,
            [button.cssClass]: !!button.cssClass
          }}
          disabled={this.component.disabled}
          onClick={this.handleClick}
          tabindex="0"
        >
          {imagePositionRender(slots)}
        </button>
      </Host>
    );
  }
}
