import { Component, Element, Prop, h, Host } from "@stencil/core";
import { NavBarRender } from "../renders/bootstrap/navbar/navbar-render";
import {
  Component as GxComponent,
  VisibilityComponent
} from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "navbar.scss",
  tag: "gx-navbar"
})
export class NavBar implements GxComponent, VisibilityComponent {
  constructor() {
    this.renderer = new NavBarRender(this);
  }

  private renderer: NavBarRender;

  @Element() element: HTMLGxNavbarElement;

  /**
   * This attribute lets you specify an optional title for the navigation bar
   *
   * | Value        | Details                                                                     |
   * | ------------ | --------------------------------------------------------------------------- |
   * | `keep-space` | The element remains in the document flow, and it does occupy space.         |
   * | `collapse`   | The element is removed form the document flow, and it doesn't occupy space. |
   */
  @Prop() readonly caption: string;

  /**
   * This attribute lets you specify the label for the toggle button. Important for accessibility.
   */
  @Prop() readonly toggleButtonLabel: string;

  /**
   * A CSS class to set as the inner element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * This attribute lets you specify how this element will behave when hidden.
   *
   * | Value        | Details                                                                     |
   * | ------------ | --------------------------------------------------------------------------- |
   * | `keep-space` | The element remains in the document flow, and it does occupy space.         |
   * | `collapse`   | The element is removed form the document flow, and it doesn't occupy space. |
   */
  @Prop() readonly invisibleMode: "collapse" | "keep-space" = "collapse";

  render() {
    return (
      <Host>
        {this.renderer.render({
          default: <slot />,
          header: <slot name="header" />
        })}
      </Host>
    );
  }
}
