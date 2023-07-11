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
  HighlightableComponent,
  makeHighlightable
} from "../common/highlightable";
import {
  DisableableComponent,
  Component as GxComponent,
  VisibilityComponent
} from "../common/interfaces";
import { LineClampComponent, makeLinesClampable } from "../common/line-clamp";

import {
  DISABLED_CLASS,
  HEIGHT_MEASURING,
  LINE_CLAMP,
  LINE_MEASURING
} from "../../common/reserved-names";

// Class transforms
import { getClasses } from "../common/css-transforms/css-transforms";

/**
 * @part gx-textblock__content - The main content displayed in the control. This part only applies when `format="Text"`.
 * @part gx-textblock__html-container - The container of the main content displayed in the control. This part only applies when `format="HTML"`.
 * @part gx-textblock__html-content - The main content displayed in the control. This part only applies when `format="HTML"`.
 *
 * @slot - The slot for the html content when `format="HTML"`.
 */
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
      "." + HEIGHT_MEASURING,
      "." + LINE_MEASURING,
      true
    );
  }

  @Element() element: HTMLGxTextblockElement;

  @State() maxLines = 0;

  /**
   * A CSS class to set as the `gx-textblock` element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * This attribute lets you specify if the element is disabled.
   * If disabled, it will not fire any user interaction related event
   * (for example, click event).
   */
  @Prop({ reflect: true }) readonly disabled: boolean = false;

  /**
   * It specifies the format that will have the textblock control.
   *
   *  - If `format` = `HTML`, the textblock control works as an HTML div and
   *    the innerHTML will be taken from the default slot.
   *
   *  - If `format` = `Text`, the control works as a normal textblock control
   *    and it is affected by most of the defined properties.
   */
  @Prop() readonly format: "Text" | "HTML" = "Text";

  /**
   * True to highlight control when an action is fired.
   */
  @Prop() readonly highlightable: boolean = false;

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
   * True to cut text when it overflows, showing an ellipsis.
   */
  @Prop() readonly lineClamp: boolean = false;

  @Listen("click", { capture: true })
  handleClick(event: UIEvent) {
    if (this.disabled) {
      event.stopPropagation();
      return;
    }
  }

  componentDidLoad() {
    makeHighlightable(this);
  }

  /**
   * This function is called either when `format="HTML"` or when
   * `lineClamp="true"`.
   * @returns The textblock content based on the current state.
   */
  private getContent = () =>
    this.format === "Text" ? (
      [
        <div class={LINE_MEASURING}>{"A"}</div>,
        <div class={HEIGHT_MEASURING}></div>,
        <p
          class={`content ${LINE_CLAMP}`}
          part="gx-textblock__content"
          style={{ "--max-lines": this.maxLines.toString() }}
        >
          <slot />
        </p>
      ]
    ) : (
      <div class="html-container" part="gx-textblock__html-container gx-valign">
        <div class="html-content" part="gx-textblock__html-content">
          <slot />
        </div>
      </div>
    );

  render() {
    // Styling for gx-textblock control.
    const classes = getClasses(this.cssClass);

    const justRenderTheSlot = this.format === "Text" && !this.lineClamp;
    const shouldAddFocus = this.highlightable && !this.disabled;

    return (
      <Host
        role={justRenderTheSlot ? "paragraph" : null}
        aria-disabled={this.disabled ? "true" : null}
        class={{
          [this.cssClass]: !!this.cssClass,
          [classes.vars]: true,
          [DISABLED_CLASS]: this.disabled
        }}
        data-has-action={shouldAddFocus ? "" : undefined}
        // Add focus to the control through sequential keyboard navigation and visually clicking
        tabindex={shouldAddFocus ? "0" : undefined}
      >
        {justRenderTheSlot ? <slot /> : this.getContent()}
      </Host>
    );
  }
}
