import { EventEmitter } from "@stencil/core";

type Constructor<T> = new (...args: any[]) => T;
export function ButtonRender<T extends Constructor<{}>>(Base: T) {
  return class extends Base {
    element: HTMLElement;
    disabled: boolean;
    onClick: EventEmitter;
    size: string;

    handleClick(event: UIEvent) {
      if (this.disabled) {
        return;
      }

      this.onClick.emit(event);
    }

    render() {
      // Main image and disabled image are set an empty alt as they are decorative images.
      const images = this.element.querySelectorAll(
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
            "btn-lg": this.size === "large",
            "btn-sm": this.size === "small",
            "gx-button": true
          }}
          onClick={this.handleClick.bind(this)}
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
  };
}
