type Constructor<T> = new (...args: any[]) => T;
export function NavBarLinkRender<T extends Constructor<{}>>(Base: T) {
  return class extends Base {
    active: boolean;
    cssClass: string;
    disabled: boolean;
    element: HTMLElement;
    href: string;

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
        >
          <slot />
        </a>
      );
    }
  };
}
