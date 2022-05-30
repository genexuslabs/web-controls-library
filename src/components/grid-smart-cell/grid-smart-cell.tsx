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
  getClasses,
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
  @Prop() readonly highlightable = true;

  /**
   * Whether this row is even position or not. This is specially required in Virtual scroll scenarios
   * where the position in the DOM is not the real position in the collection.
   */
  @Prop({ reflect: true }) readonly isRowEven = false;

  /**
   * True to show horizontal line.
   */
  @Prop() readonly showHorizontalLine = false;

  componentDidLoad() {
    makeHighlightable(this);
  }

  render() {
    const tClass = this.isRowEven ? tEvenRow : tOddRow;

    // Styling for gx-grid-smart-cell control.
    const classes = getClasses(this.cssClass, -1, tClass);

    const horizontalLineClasses = !!this.cssClass
      ? this.cssClass
          .split(" ")
          .map(tHorizontalLine)
          .join(" ")
      : "";

    return (
      <Host
        class={{
          "gx-grid-row": true,
          [classes.transformedCssClass]: !!this.cssClass,
          [classes.vars]: true,
          [horizontalLineClasses]: this.showHorizontalLine
        }}
        data-has-action
      ></Host>
    );
  }
}
