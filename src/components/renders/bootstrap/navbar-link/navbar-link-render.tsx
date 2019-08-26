import { h } from "@stencil/core";
import { IRenderer } from "../../../common/interfaces";
import { NavBarLink } from "../../../navbar-link/navbar-link";

export class NavBarLinkRender implements IRenderer {
  constructor(public component: NavBarLink) {}

  private handleClick(event: UIEvent) {
    this.component.onClick.emit(event);
    event.preventDefault();
  }

  render(slots) {
    this.component.element.classList.add("nav-item");

    return [
      <gx-bootstrap />,
      <a
        class={{
          active: this.component.active,
          disabled: this.component.disabled,
          "nav-link": true,
          [this.component.cssClass]: !!this.component.cssClass
        }}
        href={this.component.href}
        onClick={!this.component.disabled && this.handleClick.bind(this)}
        style={{
          "--gx-navbar-link-icon-src": `url("${this.component.iconSrc}")`
        }}
        data-has-icon={!!this.component.iconSrc}
      >
        {slots.default}
      </a>
    ];
  }
}
