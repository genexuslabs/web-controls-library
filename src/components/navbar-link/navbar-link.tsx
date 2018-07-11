import { Component, Element, Event, EventEmitter, Prop } from "@stencil/core";
import { BaseComponent } from "../common/base-component";
import { NavBarLinkRender } from "../renders";

@Component({
  shadow: false,
  styleUrl: "navbar-link.scss",
  tag: "gx-navbar-link"
})
export class NavBarLink extends NavBarLinkRender(BaseComponent) {
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
}
