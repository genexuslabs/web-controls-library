import { h } from "@stencil/core";
import { Renderer } from "../../../common/interfaces";
import { Button } from "../../../button/button";

export class ButtonRender implements Renderer {
  constructor(private component: Button, handlers: { handleClick }) {
    this.handleClick = handlers.handleClick;
  }

  private handleClick: (event: UIEvent) => void;

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

    return [
      <gx-bootstrap />,
      <button
        class={{
          btn: true,
          "btn-lg": button.size === "large",
          "btn-outline-secondary": true,
          "btn-sm": button.size === "small",
          "gx-button": true,
          [button.cssClass]: !!button.cssClass
        }}
        onClick={this.handleClick}
        tabindex="0"
      >
        {slots.mainImage}
        {slots.disabledImage}
        <span>{slots.default}</span>
      </button>
    ];
  }
}
