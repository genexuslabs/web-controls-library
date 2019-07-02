import { Component, Element, Prop } from "@stencil/core";
import { CardRender } from "../renders/bootstrap/card/card-render";
import { IComponent, IVisibilityComponent } from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "card.scss",
  tag: "gx-card"
})
export class Card implements IComponent, IVisibilityComponent {
  constructor() {
    this.renderer = new CardRender(this);
  }

  private renderer: CardRender;

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

  /**
   * True to show the card footer. False to hide it.
   */
  @Prop() showFooter = true;

  /**
   * True to show the card header. False to hide it.
   */
  @Prop() showHeader = true;

  componentDidLoad() {
    this.renderer.componentDidLoad();
  }

  componentDidUpdate() {
    this.renderer.componentDidUpdate();
  }

  componentDidUnload() {
    this.renderer.componentDidUnload();
  }

  render() {
    return this.renderer.render();
  }
}
