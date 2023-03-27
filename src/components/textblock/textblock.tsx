import {
  Component,
  Element,
  Host,
  Listen,
  Prop,
  State,
  h
} from "@stencil/core";
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

// Class transforms
import { getClasses } from "../common/css-transforms/css-transforms";

@Component({
  shadow: true,
  styleUrl: "textblock.scss",
  tag: "gx-textblock"
})
export class TextBlock
  implements
    GxComponent,
    DisableableComponent,
    VisibilityComponent,
    LineClampComponent,
    HighlightableComponent
{
  constructor() {
    makeLinesClampable(
      this,
      ".gx-textblock-container",
      ".line-measuring",
      true
    );
  }

  @Element() element: HTMLGxTextblockElement;

  /**
   * A CSS class to set as the `gx-textblock` element class.
   */
  @Prop() readonly cssClass: string;

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
  private shouldLineClamp: boolean;

  componentWillLoad() {
    this.shouldLineClamp = this.format === "Text" && this.lineClamp;
  }

  componentDidLoad() {
    makeHighlightable(this);
  }

  render() {
    // Styling for gx-textblock control.
    const classes = getClasses(this.cssClass);

    const body = (
      <div class="gx-textblock-container" part="valign">
        {this.lineClamp && <div class="line-measuring">{"A"}</div>}
        {this.format === "Text" ? (
          <span
            class={{
              "gx-textblock-content": true,
              "gx-line-clamp": this.shouldLineClamp
            }}
            style={
              this.shouldLineClamp
                ? {
                    "--max-lines": this.maxLines.toString()
                  }
                : undefined
            }
            part="content"
          >
            <slot />
          </span>
        ) : (
          <div
            class="gx-textblock-content"
            innerHTML={this.inner}
            part="content"
          ></div>
        )}
      </div>
    );

    return (
      <Host
        class={{
          [this.cssClass]: !!this.cssClass,
          [classes.vars]: true,
          disabled: this.disabled
        }}
        data-has-action={this.highlightable ? "" : undefined}
        // Add focus to the control through sequential keyboard navigation and visually clicking
        tabindex={this.highlightable && !this.disabled ? "0" : undefined}
      >
        {this.href ? <a href={this.href}>{body}</a> : body}
      </Host>
    );
  }
}
