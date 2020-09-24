import {
  Component,
  Element,
  Event,
  EventEmitter,
  Prop,
  State,
  h
} from "@stencil/core";
import {
  ClickableComponent,
  Component as GxComponent,
  DisableableComponent,
  VisibilityComponent
} from "../common/interfaces";
import { makeLinesClampable, LineClampComponent } from "../common/line-clamp";

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
    VisibilityComponent,
    LineClampComponent {
  constructor() {
    this.handleClick = this.handleClick.bind(this);
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

  @State() maxLines = 0;
  @State() maxHeight = 0;

  /**
   * Emitted when the element is clicked.
   */
  @Event() gxClick: EventEmitter;

  private handleClick(event: UIEvent) {
    this.gxClick.emit(event);
    event.preventDefault();
  }

  render() {
    const body = (
      <div
        class={{
          content: true,
          "gx-line-clamp": this.shouldClampLines()
        }}
        onClick={!this.disabled ? this.handleClick : null}
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
