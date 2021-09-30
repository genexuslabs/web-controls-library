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
    makeLinesClampable(this, ".readonly-content-container", ".line-measuring");
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
  @Prop({ reflect: true }) readonly disabled = false;

  /**
   * True to cut text when it overflows, showing an ellipsis.
   */
  @Prop() readonly lineClamp = false;

  /**
   * True to highlight control when an action is fired.
   */
  @Prop() readonly highlightable = false;

  /**
   * It specifies the format that will have the textblock control.
   *
   * If `format` = `HTML`, the textblock control works as an HTML div and the
   * innerHTML will be the same as the `inner` property specifies.
   *
   * If `format` = `Text`, the control works as a normal textblock control and
   * it is affected by most of the defined properties.
   */
  @Prop() readonly format: "Text" | "HTML" = "Text";

  /**
   * Used as the innerHTML when `format` = `HTML`.
   */
  @Prop() readonly inner: string = "";

  @State() maxLines = 0;

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
    if (this.format == "Text") {
      const body = (
        <div class="content text-content">
          <div class="readonly-content-container">
            <div
              class={{
                "text-container": true,
                "gx-line-clamp": this.lineClamp,
                relative: !this.lineClamp
              }}
              style={{
                "--max-lines": this.lineClamp ? this.maxLines.toString() : "0"
              }}
            >
              {this.lineClamp && (
                <div class="line-measuring" aria-hidden>
                  {"A"}
                </div>
              )}
              <slot />
            </div>
          </div>
        </div>
      );

      if (this.href) {
        return <a href={this.href}>{body}</a>;
      }

      return body;
    } else {
      return (
        <div class="content html-content">
          <div class="html-container">
            <div class="inner-content" innerHTML={this.inner}></div>
          </div>
        </div>
      );
    }
  }
}
