import { h, Host } from "@stencil/core";
import { Renderer } from "../../../common/interfaces";
import { Button } from "../../../button/button";
import {
  imagePositionRender,
  imagePositionClass,
  hideMainImageWhenDisabledClass
} from "../../../common/image-position";
import { getFileNameWithoutExtension } from "../../../common/utils";

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

    // True if the button does not have any text
    const isEmptyCaption = button.element.textContent.trim() === "";

    /*  Main image and disabled image are set with an empty alt as they are
        decorative images, but if the button has no caption, the alt property
        will take the name of the image.
    */
    const images = button.element.querySelectorAll(
      "[slot='main-image'], [slot='disabled-image']"
    );

    Array.from(images).forEach((img: HTMLImageElement) => {
      if (!img.alt) {
        // The src image property always contains a path to the image file
        const alt = isEmptyCaption ? getFileNameWithoutExtension(img.src) : "";

        img.setAttribute("alt", alt);
      }
    });

    return (
      <Host
        role="button"
        class={{
          "gx-button--disabled": button.disabled,
          [imagePositionClass(button.imagePosition)]: true,
          [hideMainImageWhenDisabledClass]:
            button.disabled && this.hasDisabledImage,
          ["stretch-height"]: button.height === "",

          // Strings with only white spaces are taken as null captions
          "empty-caption": isEmptyCaption
        }}
        style={{
          "--width": button.width === "" ? "100%" : button.width,
          "--height": button.height === "" ? "auto" : button.height
        }}
      >
        <gx-bootstrap />
        <button
          class={{
            btn: true,
            "p-0": true,
            "btn-lg": button.size === "large",
            "btn-sm": button.size === "small",
            "gx-button": true,
            [button.cssClass]: !!button.cssClass
          }}
          disabled={button.disabled}
          onClick={this.handleClick}
          tabindex="0"
        >
          {imagePositionRender(slots)}
        </button>
      </Host>
    );
  }
}
