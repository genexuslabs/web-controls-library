import {
  Component,
  ComponentInterface,
  Element,
  Host,
  Prop,
  h
} from "@stencil/core";

import {
  HighlightableComponent,
  makeHighlightable
} from "../common/highlightable";

// Class transforms
import {
  getTransformedClassesWithoutFocus,
  tEvenRow,
  tHorizontalLine,
  tOddRow
} from "../common/css-transforms/css-transforms";

@Component({
  styleUrl: "grid-smart-cell.scss",
  tag: "gx-grid-smart-cell"
})
export class GridSmartCell
  implements ComponentInterface, HighlightableComponent {
  @Element() element: HTMLGxGridSmartCellElement;

  /**
   * The CSS class of gx-grid parent element.
   */
  @Prop() readonly cssClass: string;

  /**
   * True to highlight control when an action is fired.
   */
  @Prop() readonly highlightable = false;

  /**
   * This attribute lets you specify the index of the cell. Useful when Inverse
   * Loading is enabled on the grid.
   */
  @Prop() readonly index: number = null;

  /**
   * Whether this row is even position or not. This is specially required in Virtual scroll scenarios
   * where the position in the DOM is not the real position in the collection.
   */
  @Prop({ reflect: true }) readonly isRowEven = false;

  /**
   * Number of Columns to be shown in the grid. Useful when Inverse Loading is
   * enabled on the grid.
   */
  @Prop() readonly itemsPerRow: number = null;

  /**
   * True to show horizontal line.
   */
  @Prop() readonly showHorizontalLine = false;

  componentWillLoad() {
    // Not null when inverse loading is enabled
    if (this.index == null) {
      return;
    }
    const cellIndex = this.index;
    const itemsPerRow = this.itemsPerRow;

    // Set index when Item Layout Mode = Single
    this.element.style.setProperty(
      "--gx-cell-index--single",
      `-${cellIndex + 1}`
    );

    // Set index when Item Layout Mode = Multiple By Quantity
    if (itemsPerRow != null) {
      const leftover = cellIndex % itemsPerRow;
      const gridRowStart = (cellIndex - leftover) / itemsPerRow + 1;

      this.element.style.setProperty(
        "--gx-cell-index--mbyq",
        `-${gridRowStart}`
      );
    }
  }

  componentDidLoad() {
    makeHighlightable(this);
  }

  render() {
    const tClass = this.isRowEven ? tEvenRow : tOddRow;

    // Styling for gx-grid-smart-cell control.
    const classes = getTransformedClassesWithoutFocus(this.cssClass, tClass);

    const horizontalLineClasses = !!this.cssClass
      ? this.cssClass
          .split(" ")
          .map(tHorizontalLine)
          .join(" ")
      : "";

    return (
      <Host
        role="gridcell"
        class={{
          "gx-grid-row": true,
          [classes.transformedCssClass]: !!this.cssClass,
          [classes.vars]: true,
          [horizontalLineClasses]: this.showHorizontalLine
        }}
        data-has-action={this.highlightable ? "" : undefined}
      ></Host>
    );
  }
}
