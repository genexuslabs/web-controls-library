import { Component, Element, Prop } from "@stencil/core";
import { BaseComponent } from "../common/base-component";

@Component({
  shadow: false,
  styleUrl: "canvas-cell.scss",
  tag: "gx-canvas-cell"
})
export class CanvasCell extends BaseComponent {
  @Element() element: HTMLElement;

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
    return <slot />;
  }
}
