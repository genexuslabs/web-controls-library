import { Component, Element, Event, EventEmitter, Prop } from "@stencil/core";
import {
  IClickableComponent,
  IComponent,
  IDisableableComponent,
  IVisibilityComponent
} from "../common/interfaces";
import { ISwipeable, makeSwipeable } from "../common/swipeable";

@Component({
  shadow: false,
  styleUrl: "table.scss",
  tag: "gx-table"
})
export class Table
  implements
    IClickableComponent,
    IComponent,
    IDisableableComponent,
    ISwipeable,
    IVisibilityComponent {
  @Element() element: HTMLElement;

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
   * Like the `grid-templates-areas` CSS property, this attribute defines a grid
   * template by referencing the names of the areas which are specified with the
   * cells [area attribute](../table-cell/readme.md#area). Repeating the name of
   * an area causes the content to span those cells. A period signifies an
   * empty cell. The syntax itself provides a visualization of the structure of
   * the grid.
   */
  @Prop() areasTemplate: string;

  /**
   * Like the `grid-templates-columns` CSS property, this attribute defines
   * the columns of the grid with a space-separated list of values. The values
   * represent the width of column.
   */

  @Prop() columnsTemplate: string;

  /**
   * Like the `grid-templates-rows` CSS property, this attribute defines the
   * rows of the grid with a space-separated list of values. The values
   * represent the height of each row.
   */
  @Prop() rowsTemplate: string;

  /**
   * Emitted when the element is clicked.
   */
  @Event() onClick: EventEmitter;
  // TODO: Implement touch devices events (Tap, DoubleTap, LongTap, SwipeX)

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

  handleClick(event: UIEvent) {
    if (this.disabled) {
      return;
    }

    this.onClick.emit(event);
  }

  render() {
    if (this.areasTemplate) {
      // tslint:disable-next-line
      this.element.style["gridTemplateAreas"] = this.areasTemplate;
    }
    if (this.columnsTemplate) {
      // tslint:disable-next-line
      this.element.style["gridTemplateColumns"] = this.columnsTemplate;
    }
    if (this.rowsTemplate) {
      // tslint:disable-next-line
      this.element.style["gridTemplateRows"] = this.rowsTemplate;
    }

    this.element.addEventListener("click", this.handleClick.bind(this));

    return <slot />;
  }
}
