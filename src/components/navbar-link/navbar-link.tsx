import {
  Component,
  Element,
  Event,
  EventEmitter,
  Host,
  Prop,
  h
} from "@stencil/core";
import { NavBarLinkRender } from "../renders/bootstrap/navbar-link/navbar-link-render";
import {
  Component as GxComponent,
  DisableableComponent,
  VisibilityComponent
} from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "navbar-link.scss",
  tag: "gx-navbar-link"
})
export class NavBarLink
  implements GxComponent, DisableableComponent, VisibilityComponent {
  constructor() {
    this.renderer = new NavBarLinkRender(this);
  }

  private renderer: NavBarLinkRender;

  @Element() element: HTMLGxNavbarLinkElement;

  /**
   * Indicates if the navbar item is the active one (for example, when the item represents the current page)
   */
  @Prop() readonly active = false;

  /**
   * A CSS class to set as the inner element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * This attribute lets you specify if the navbar item is disabled.
   */
  @Prop() readonly disabled = false;

  /**
   * This attribute lets you specify the URL of the navbar item.
   */
  @Prop() readonly href = "";

  /**
   * This attribute lets you specify the URL of an icon for the navbar item.
   */
  @Prop() readonly iconSrc = "";

  /**
   * This attribute lets you specify how this element will behave when hidden.
   *
   * | Value        | Details                                                                     |
   * | ------------ | --------------------------------------------------------------------------- |
   * | `keep-space` | The element remains in the document flow, and it does occupy space.         |
   * | `collapse`   | The element is removed form the document flow, and it doesn't occupy space. |
   */
  @Prop() readonly invisibleMode: "collapse" | "keep-space" = "collapse";

  /**
   * Emitted when the element is clicked.
   */
  @Event() gxClick: EventEmitter;

  render() {
    return <Host>{this.renderer.render({ default: <slot /> })}</Host>;
  }
}
