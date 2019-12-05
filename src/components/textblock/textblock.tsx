import {
  Component,
  Element,
  Event,
  EventEmitter,
  Prop,
  h
} from "@stencil/core";
import {
  ClickableComponent,
  Component as GxComponent,
  DisableableComponent,
  VisibilityComponent
} from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "textblock.scss",
  tag: "gx-textblock"
})
export class TextBlock
  implements
    ClickableComponent,
    GxComponent,
    DisableableComponent,
    VisibilityComponent {
  constructor() {
    this.handleClick = this.handleClick.bind(this);
  }

  @Element() element: HTMLGxTextblockElement;

  /**
   * This attribute lets you specify an URL. If a URL is specified, the textblock acts as an anchor.
   */

  @Prop() readonly href = "";

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
   * This attribute lets you specify if the element is disabled.
   * If disabled, it will not fire any user interaction related event
   * (for example, click event).
   */
  @Prop() readonly disabled = false;

  /**
   * Emitted when the element is clicked.
   */
  @Event() onClick: EventEmitter;

  private handleClick(event: UIEvent) {
    this.onClick.emit(event);
    event.preventDefault();
  }

  render() {
    const body = (
      <div class="content" onClick={!this.disabled ? this.handleClick : null}>
        <slot />
      </div>
    );

    if (this.href) {
      return <a href={this.href}>{body}</a>;
    }

    return body;
  }
}
