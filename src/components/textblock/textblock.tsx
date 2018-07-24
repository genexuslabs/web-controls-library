import { Component, Event, EventEmitter, Prop } from "@stencil/core";
import { BaseComponent } from "../common/base-component";

@Component({
  shadow: true,
  styleUrl: "textblock.scss",
  tag: "gx-textblock"
})
export class TextBlock extends BaseComponent {
  /**
   * This attribute lets you specify an URL. If a URL is specified, the textblock acts as an anchor.
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
   * This attribute lets you specify if the element is disabled.
   * If disabled, it will not fire any user interaction related event
   * (for example, click event).
   */
  @Prop() disabled = false;

  /**
   * Emitted when the element is clicked.
   */
  @Event() onClick: EventEmitter;

  handleClick(event: UIEvent) {
    if (this.disabled) {
      return;
    }

    this.onClick.emit(event);
    event.preventDefault();
  }

  render() {
    const body = (
      <div class="content" onClick={this.handleClick.bind(this)}>
        <slot />
      </div>
    );

    if (this.href) {
      return <a href={this.href}>{body}</a>;
    }

    return body;
  }
}
