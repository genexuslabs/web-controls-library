import { Component, Prop, h, Host } from "@stencil/core";

import {
  AccessibleRoleCell,
  AccessibleRoleCellComponent
} from "../../common/interfaces";

@Component({
  shadow: false,
  tag: "gx-table-cell"
})
export class TableCell implements AccessibleRoleCellComponent {
  /**
   * Specifies the semantics of the control. Specifying the Role allows
   * assistive technologies to give information about how to use the control to
   * the user.
   */
  @Prop() readonly accessibleRole: AccessibleRoleCell;

  /**
   * Like the `grid-area` CSS property, this attribute gives a name to the item,
   * so it can be used from the [areas-template attributes](../table/readme.md#areas-template)
   * of the gx-table element.
   */
  @Prop() readonly area: string = null;

  /**
   * Defines the horizontal alignment of the content of the cell.
   */
  @Prop({ reflect: true }) readonly align: "left" | "right" | "center";

  /**
   * This attribute defines the maximum height of the cell.
   */
  @Prop() readonly maxHeight: string = null;

  /**
   * This attribute defines the minimum height of the cell when its contents are visible.
   * Ignored if its content has `invisible-mode="collapse"` and is hidden.
   */
  @Prop() readonly minHeight: string = null;

  /**
   * Defines the vertical alignment of the content of the cell.
   */
  @Prop({ reflect: true }) readonly valign: "top" | "bottom" | "middle";

  render() {
    return (
      <Host
        role={this.accessibleRole}
        class="gx-cell"
        style={{
          "grid-area": this.area,
          "min-height": this.minHeight,
          "max-height": this.maxHeight
        }}
      ></Host>
    );
  }
}
