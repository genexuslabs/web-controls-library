import {
  Component,
  Element,
  Event,
  EventEmitter,
  Host,
  Listen,
  Prop,
  h
} from "@stencil/core";
import {
  DisableableComponent,
  Component as GxComponent,
  CustomizableComponent,
  VisibilityComponent
} from "../common/interfaces";
import {
  HighlightableComponent,
  makeHighlightable
} from "../common/highlightable";
import { Swipeable, makeSwipeable } from "../common/events/swipeable";

import { DISABLED_CLASS } from "../../common/reserved-names";

// Class transforms
import { getClasses } from "../common/css-transforms/css-transforms";

@Component({
  shadow: true,
  styleUrl: "table.scss",
  tag: "gx-table"
})
export class Table
  implements
    GxComponent,
    DisableableComponent,
    CustomizableComponent,
    VisibilityComponent,
    HighlightableComponent,
    Swipeable {
  @Element() element: HTMLGxTableElement;

  /**
   * Like the `grid-templates-areas` CSS property, this attribute defines a grid
   * template by referencing the names of the areas which are specified with the
   * cells [area attribute](../table-cell/readme.md#area). Repeating the name of
   * an area causes the content to span those cells. A period signifies an
   * empty cell. The syntax itself provides a visualization of the structure of
   * the grid.
   */
  @Prop() readonly areasTemplate: string = null;

  /**
   * Like the `grid-templates-columns` CSS property, this attribute defines
   * the columns of the grid with a space-separated list of values. The values
   * represent the width of column.
   */
  @Prop() readonly columnsTemplate: string = null;

  /**
   * A CSS class to set as the `gx-table` element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * This attribute lets you specify if the element is disabled.
   * If disabled, it will not fire any user interaction related event
   * (for example, click event).
   */
  @Prop() readonly disabled = false;

  /**
   * True to highlight control when an action is fired.
   */
  @Prop() readonly highlightable = false;

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
   * This attribute lets you determine whether the gx-table control has a scroll or not.
   *
   * | Value    | Details                                                                                                           |
   * | -------- | ----------------------------------------------------------------------------------------------------------------- |
   * | `scroll` | The table provides scrollable behavior. When the table height exceeds the space available, a scroll bar is shown. |
   * | `clip`   | The table doesn't provide scroll in any case; content is clipped at the bottom.                                   |
   */
  @Prop() readonly overflowBehavior: "scroll" | "clip" = "clip";

  /**
   * Like the `grid-templates-rows` CSS property, this attribute defines the
   * rows of the grid with a space-separated list of values. The values
   * represent the height of each row.
   */
  @Prop() readonly rowsTemplate: string = null;

  /**
   * Emitted when the element is swiped.
   */
  @Event() swipe: EventEmitter;

  /**
   * Emitted when the element is swiped in upward direction.
   */
  @Event() swipeUp: EventEmitter;

  /**
   * Emitted when the element is swiped right direction.
   */
  @Event() swipeRight: EventEmitter;

  /**
   * Emitted when the element is swiped downward direction.
   */
  @Event() swipeDown: EventEmitter;

  /**
   * Emitted when the element is swiped left direction..
   */
  @Event() swipeLeft: EventEmitter;

  /**
   * Stops event bubbling when the table is disabled
   * @param event The UI Event
   */
  @Listen("click", {})
  handleClick(event: UIEvent) {
    if (this.disabled) {
      event.stopPropagation();
    }

    // @todo: TODO Use a custom vdom event "gxClick"
  }

  componentDidLoad() {
    makeSwipeable(this);
    makeHighlightable(this);
  }

  render() {
    // Styling for gx-table control.
    const classes = getClasses(this.cssClass);

    return (
      <Host
        class={{
          [this.cssClass]: !!this.cssClass,
          [classes.vars]: true,
          [DISABLED_CLASS]: this.disabled,

          // Overflow Behavior
          "overflow-behavior--default": this.overflowBehavior === "clip",
          "overflow-behavior--scroll": this.overflowBehavior === "scroll"
        }}
        style={{
          "--grid-template-areas": this.areasTemplate,
          "grid-template-columns": this.columnsTemplate,
          "grid-template-rows": this.rowsTemplate
        }}
        // Mouse pointer to indicate action
        data-has-action={this.highlightable && !this.disabled ? "" : undefined}
      >
        <slot />
      </Host>
    );
  }
}
