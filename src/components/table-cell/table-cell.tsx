import { Component, Element, Prop } from "@stencil/core";
import { BaseComponent } from "../common/base-component";

@Component({
  shadow: false,
  styleUrl: "table-cell.scss",
  tag: "gx-table-cell"
})
export class TableCell extends BaseComponent {
  @Element() element: HTMLElement;

  /**
   * Like the `grid-area` CSS property, this attribute gives a name to the item,
   * so it can be used from the [areas-template attributes](../table/readme.md#areas-template)
   * of the gx-table element.
   */
  @Prop() area: string;

  /**
   * Defines the horizontal aligmnent of the content of the cell.
   */
  @Prop() align: "left" | "right" | "center" = "left";

  /**
   * This attribute defines if the control size will grow automatically,
   * to adjust to its content size.
   * If set to `false`, it won't grow automatically and it will show scrollbars
   * if the content overflows.
   */
  @Prop() autoGrow: boolean;

  /**
   * Defines the vertical aligmnent of the content of the cell.
   */
  @Prop() valign: "top" | "bottom" | "medium" = "top";

  render() {
    if (this.element) {
      // tslint:disable-next-line
      this.element.style["gridArea"] = this.area;
    }

    return <slot />;
  }
}
