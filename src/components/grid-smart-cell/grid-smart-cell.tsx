import { Component, ComponentInterface, Prop } from "@stencil/core";

@Component({
  styleUrl: "grid-smart-cell.scss",
  tag: "gx-grid-smart-cell"
})
export class GridSmartCell implements ComponentInterface {
  /**
   * Whether this row is even position or not. This is specially required in Virtual scroll scenarios
   * where the position in the DOM is not the real position in the collection.
   */
  @Prop({ reflect: true }) readonly isRowEven = false;
}
