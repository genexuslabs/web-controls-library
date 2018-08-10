import { Component, Element, Prop } from "@stencil/core";
import { BaseComponent } from "../common/base-component";
import { CardRender } from "../renders/bootstrap/card/card-render";

@Component({
  shadow: false,
  styleUrl: "card.scss",
  tag: "gx-card"
})
export class Card extends CardRender(BaseComponent) {
  @Element() element: HTMLElement;

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
