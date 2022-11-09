import { Component, Element, Host, Prop, h } from "@stencil/core";
import { Component as GxComponent } from "../common/interfaces";

/**
 * @slot body - This slot will be rendered as the body of the card.
 * @slot header - This slot will be rendered as the header of the card.
 * @slot - The default slot will also be rendered as the body of the card. Typically, this slot will contain gx-action-sheet controls.
 */
@Component({
  shadow: true,
  styleUrl: "card.scss",
  tag: "gx-card"
})
export class Card implements GxComponent {
  @Element() element: HTMLGxCardElement;

  /**
   * True to show the card header. False to hide it.
   */
  @Prop() readonly showHeader = true;

  render() {
    return (
      <Host>
        {this.showHeader && <slot name="header" />}

        <slot name="body" />
        {this.showHeader && <slot />}
      </Host>
    );
  }
}
