import { Component, Element, Event, EventEmitter, Prop } from "@stencil/core";
import { NavBarLinkRender } from "../renders/bootstrap/navbar-link/navbar-link-render";
import {
  IComponent,
  IDisableableComponent,
  IVisibilityComponent
} from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "navbar-link.scss",
  tag: "gx-navbar-link"
})
export class NavBarLink
  implements IComponent, IDisableableComponent, IVisibilityComponent {
  constructor() {
    this.renderer = new NavBarLinkRender(this);
  }

  private renderer: NavBarLinkRender;

  @Element() element: HTMLElement;

  /**
   * Indicates if the navbar item is the active one (for example, when the item represents the current page)
   */
  @Prop() active = false;

  /**
   * A CSS class to set as the inner element class.
   */
  @Prop() cssClass: string;

  /**
   * This attribute lets you specify if the navbar item is disabled.
   */
  @Prop() disabled = false;

  /**
   * This attribute lets you specify the URL of the navbar item.
   */
  @Prop() href = "";

  /**
   * This attribute lets you specify how this element will behave when hidden.
   *
   * | Value        | Details                                                                     |
   * | ------------ | --------------------------------------------------------------------------- |
   * | `keep-space` | The element remains in the document flow, and it does occupy space.         |
   * | `collapse`   | The element is removed form the document flow, and it doesn't occupy space. |
   */
  @Prop() invisibleMode: "collapse" | "keep-space" = "collapse";

  /**
   * Emitted when the element is clicked.
   */
  @Event() onClick: EventEmitter;

  render() {
    return this.renderer.render();
  }
}
