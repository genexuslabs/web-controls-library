import { h } from "@stencil/core";
import { Renderer } from "../../../common/interfaces";
import { NavBarLink } from "../../../navbar-link/navbar-link";

export class NavBarLinkRender implements Renderer {
  constructor(private component: NavBarLink) {}

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
      >
        {this.component.iconSrc && (
          <img
            class="nav-icon"
            src={this.component.iconSrc}
            aria-hidden="true"
          />
        )}
        {slots.default}
      </a>
    ];
  }
}
