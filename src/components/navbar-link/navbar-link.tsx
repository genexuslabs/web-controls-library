import { Component, Element, Host, Prop, h } from "@stencil/core";
import { Component as GxComponent } from "../common/interfaces";

@Component({
  shadow: true,
  styleUrl: "navbar-link.scss",
  tag: "gx-navbar-link"
})
export class NavBarLink implements GxComponent {
  @Element() element: HTMLGxNavbarLinkElement;

  /**
   * Indicates if the navbar item is the active one (for example, when the item represents the current page)
   */
  @Prop() readonly active = false;

  /**
   * This attribute lets you specify the URL of the navbar item.
   */
  @Prop() readonly href = "";

  /**
   * This attribute lets you specify the URL of an icon for the navbar item.
   */
  @Prop() readonly iconSrc = "";

  render() {
    return (
      <Host>
        <a
          class={{
            "link--active": this.active
          }}
          href={this.href}
        >
          {this.iconSrc && <img class="link-icon" src={this.iconSrc} />}
          <slot />
        </a>
      </Host>
    );
  }
}
