import { EventEmitter } from "@stencil/core";

type Constructor<T> = new (...args: any[]) => T;
export function TabCaptionRender<T extends Constructor<{}>>(Base: T) {
  return class extends Base {
    element: HTMLElement;

    disabled = false;
    selected = false;

    onTabSelect: EventEmitter;

    render() {
      this.element.setAttribute("aria-selected", this.selected.toString());

      return (
        <a
          class={{
            active: this.selected,
            disabled: this.disabled,
            "nav-link": true
          }}
          href="#"
          onClick={this.clickHandler.bind(this)}
        >
          <slot />
        </a>
      );
    }

    private clickHandler(event: UIEvent) {
      if (this.disabled) {
        return;
      }
      event.preventDefault();
      this.onTabSelect.emit(event);
    }
  };
}
