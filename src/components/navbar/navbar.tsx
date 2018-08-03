import { Component, Element, Prop } from "@stencil/core";
import { BaseComponent } from "../common/base-component";
import { NavBarRender } from "../renders";

@Component({
  shadow: false,
  styleUrl: "navbar.scss",
  tag: "gx-navbar"
})
export class NavBar extends NavBarRender(BaseComponent) {
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
}
