import { Component, Element, Listen, Prop, State, h } from "@stencil/core";
import {
  DisableableComponent,
  Component as GxComponent,
  VisibilityComponent
} from "../common/interfaces";
import {
  HighlightableComponent,
  makeHighlightable
} from "../common/highlightable";
import { LineClampComponent, makeLinesClampable } from "../common/line-clamp";

@Component({
  shadow: false,
  styleUrl: "textblock.scss",
  tag: "gx-textblock"
})
export class TextBlock
  implements
    GxComponent,
    DisableableComponent,
    VisibilityComponent,
    LineClampComponent,
    HighlightableComponent {
  constructor() {
    makeLinesClampable(this, ".content", ".line-measuring");
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
   * True to cut text when it overflows, showing an ellipsis.
   */
  @Prop() readonly lineClamp = false;

  /**
   * True to highlight control when an action is fired.
   */
  @Prop() readonly highlightable = false;

  @State() maxLines = 0;
  @State() maxHeight = 0;

  @Listen("click", { capture: true })
  handleClick(event: UIEvent) {
    event.preventDefault();
    if (this.disabled) {
      event.stopPropagation();
      return;
    }
  }

  componentDidLoad() {
    makeHighlightable(this);
  }

  render() {
    const body = (
      <div
        class={{
          content: true,
          "gx-line-clamp": this.shouldClampLines()
        }}
        style={
          this.shouldClampLines() && {
            "--max-lines": this.maxLines.toString(),
            "--max-height": `${this.maxHeight}px`
          }
        }
      >
        {this.lineClamp && (
          <div class="line-measuring" aria-hidden>
            {"A"}
          </div>
        )}
        <slot />
      </div>
    );

    if (this.href) {
      return <a href={this.href}>{body}</a>;
    }

    return body;
  }

  private shouldClampLines() {
    return this.lineClamp && this.maxLines > 0;
  }
}
