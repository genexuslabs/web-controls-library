import {
  Component,
  Element,
  Event,
  EventEmitter,
  Prop,
  h
} from "@stencil/core";
import {
  Component as GxComponent,
  DisableableComponent,
  VisibilityComponent
} from "../common/interfaces";
import { Swipeable, makeSwipeable } from "../common/swipeable";

@Component({
  shadow: false,
  styleUrl: "table.scss",
  tag: "gx-table"
})
export class Table
  implements GxComponent, DisableableComponent, Swipeable, VisibilityComponent {
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
   * Emitted when the element is swiped.
   */
  @Event() onSwipe: EventEmitter;
  /**
   * Emitted when the element is swiped in upward direction.
   */
  @Event() onSwipeUp: EventEmitter;
  /**
   * Emitted when the element is swiped right direction.
   */
  @Event() onSwipeRight: EventEmitter;
  /**
   * Emitted when the element is swiped downward direction.
   */
  @Event() onSwipeDown: EventEmitter;
  /**
   * Emitted when the element is swiped left direction..
   */
  @Event() onSwipeLeft: EventEmitter;

  componentDidLoad() {
    makeSwipeable(this);
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
