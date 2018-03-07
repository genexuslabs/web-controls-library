import { EventEmitter } from "@stencil/core";

type Constructor<T> = new (...args: any[]) => T;
export function ButtonRender<T extends Constructor<{}>>(Base: T) {
  return class extends Base {
    element: HTMLElement;
    disabled: boolean;
    onClick: EventEmitter;

    handleClick(event: UIEvent) {
      if (this.disabled) return;

      this.onClick.emit(event);
    }

    render() {
      // Main image and disabled image are set an empty alt as they are decorative images.
      const images = this.element.querySelectorAll(
        '[slot="main-image"], [slot="disabled-image"]'
      );
      Array.from(images).forEach((img: HTMLElement) =>
        img.setAttribute("alt", "")
      );

      return (
        <button class="gx-button btn" onClick={this.handleClick.bind(this)}>
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
