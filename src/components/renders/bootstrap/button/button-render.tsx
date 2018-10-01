import { IRenderer } from "../../../common/interfaces";
import { Button } from "../../../button/button";

export class ButtonRender implements IRenderer {
  constructor(public component: Button) {}

  render() {
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
      <button
        class={{
          btn: true,
          "btn-default": true,
          "btn-lg": button.size === "large",
          "btn-sm": button.size === "small",
          "gx-button": true,
          [button.cssClass]: true
        }}
        onClick={button.handleClick.bind(button)}
        tabindex="0"
      >
        <slot name="main-image" />
        <slot name="disabled-image" />
        <span>
          <slot />
        </span>
      </button>
    );
  }
}
