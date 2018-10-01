import { Component, Element, Prop } from "@stencil/core";
import { NavBarRender } from "../renders/bootstrap/navbar/navbar-render";
import { IComponent, IVisibilityComponent } from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "navbar.scss",
  tag: "gx-navbar"
})
export class NavBar implements IComponent, IVisibilityComponent {
  constructor() {
    this.renderer = new NavBarRender(this);
  }

  private renderer: NavBarRender;

  @Element() element: HTMLElement;

  /**
   * This attribute lets you specify an optional title for the navigation bar
   *
   * | Value        | Details                                                                     |
   * | ------------ | --------------------------------------------------------------------------- |
   * | `keep-space` | The element remains in the document flow, and it does occupy space.         |
   * | `collapse`   | The element is removed form the document flow, and it doesn't occupy space. |
   */
  @Prop() caption: string;

  /**
   * The identifier of the control. Must be unique.
   */
  @Prop() id: string;

  /**
   * This attribute lets you specify the label for the toggle button. Important for accessibility.
   */
  @Prop() toggleButtonLabel: string;

  /**
   * A CSS class to set as the inner element class.
   */
  @Prop() cssClass: string;

  /**
   * This attribute lets you specify how this element will behave when hidden.
   *
   * | Value        | Details                                                                     |
   * | ------------ | --------------------------------------------------------------------------- |
   * | `keep-space` | The element remains in the document flow, and it does occupy space.         |
   * | `collapse`   | The element is removed form the document flow, and it doesn't occupy space. |
   */
  @Prop() invisibleMode: "collapse" | "keep-space" = "collapse";

  render() {
    return this.renderer.render();
  }
}
