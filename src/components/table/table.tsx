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
  VisibilityComponent
} from "../common/interfaces";
import {
  HighlightableComponent,
  makeHighlightable
} from "../common/highlightable";
import { Swipeable, makeSwipeable } from "../common/swipeable";

@Component({
  shadow: false,
  styleUrl: "table.scss",
  tag: "gx-table"
})
export class Table
  implements
    GxComponent,
    DisableableComponent,
    Swipeable,
    VisibilityComponent,
    HighlightableComponent {
  @Element() element: HTMLGxTableElement;

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
   * Like the `grid-templates-areas` CSS property, this attribute defines a grid
   * template by referencing the names of the areas which are specified with the
   * cells [area attribute](../table-cell/readme.md#area). Repeating the name of
   * an area causes the content to span those cells. A period signifies an
   * empty cell. The syntax itself provides a visualization of the structure of
   * the grid.
   */
  @Prop() readonly areasTemplate: string;

  /**
   * Like the `grid-templates-columns` CSS property, this attribute defines
   * the columns of the grid with a space-separated list of values. The values
   * represent the width of column.
   */

  @Prop() readonly columnsTemplate: string;

  /**
   * Like the `grid-templates-rows` CSS property, this attribute defines the
   * rows of the grid with a space-separated list of values. The values
   * represent the height of each row.
   */
  @Prop() readonly rowsTemplate: string;

  /**
   * True to highlight control when fire actions.
   */
  @Prop() readonly highlightable = false;

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

  @Listen("click", { capture: true })
  handleClick(event: UIEvent) {
    if (this.disabled) {
      event.stopPropagation();
      return;
    }
  }

  componentDidLoad() {
    makeSwipeable(this);
    makeHighlightable(this);
  }

  render() {
    if (this.areasTemplate) {
      this.element.style["gridTemplateAreas"] = this.areasTemplate;
    }
    if (this.columnsTemplate) {
      this.element.style["gridTemplateColumns"] = this.columnsTemplate;
    }
    if (this.rowsTemplate) {
      this.element.style["gridTemplateRows"] = this.rowsTemplate;
    }

    return (
      <Host>
        <slot />
      </Host>
    );
  }
}
