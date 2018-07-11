import { EventEmitter } from "@stencil/core";

type Constructor<T> = new (...args: any[]) => T;
export function NavBarLinkRender<T extends Constructor<{}>>(Base: T) {
  return class extends Base {
    active: boolean;
    cssClass: string;
    disabled: boolean;
    element: HTMLElement;
    href: string;

    onClick: EventEmitter;

    private handleClick(event: UIEvent) {
      if (this.disabled) {
        return;
      }

      this.onClick.emit(event);
      event.preventDefault();
    }

    render() {
      this.element.classList.add("nav-item");

      return (
        <a
          class={{
            active: this.active,
            disabled: this.disabled,
            "nav-link": true,
            [this.cssClass]: !!this.cssClass
          }}
          href={this.href}
          onClick={this.handleClick.bind(this)}
        >
          <slot />
        </a>
      );
    }
  };
}
