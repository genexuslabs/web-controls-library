import { Component, Element, Prop, h, Host } from "@stencil/core";
import { CardRender } from "../renders/bootstrap/card/card-render";
import {
  Component as GxComponent,
  VisibilityComponent
} from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "card.scss",
  tag: "gx-card"
})
export class Card implements GxComponent, VisibilityComponent {
  constructor() {
    this.renderer = new CardRender(this);
  }

  private renderer: CardRender;

  @Element() element: HTMLGxCardElement;

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
   * True to show the card border. False to hide it.
   */
  @Prop() readonly showBorder = true;

  /**
   * True to show the card footer. False to hide it.
   */
  @Prop() readonly showFooter = true;

  /**
   * True to show the card header. False to hide it.
   */
  @Prop() readonly showHeader = true;

  componentDidLoad() {
    this.renderer.componentDidLoad();
  }

  componentDidUpdate() {
    this.renderer.componentDidUpdate();
  }

  disconnectedCallback() {
    this.renderer.disconnectedCallback();
  }

  render() {
    return (
      <Host>
        {this.renderer.render({
          body: <slot name="body" />,
          default: <slot />,
          footer: <slot name="footer" />,
          header: <slot name="header" />,
          highPriorityAction: <slot name="high-priority-action" />,
          lowPriorityAction: <slot name="low-priority-action" />,
          normalPriorityAction: <slot name="normal-priority-action" />
        })}
      </Host>
    );
  }
}
