import { Component, Element, Prop, h } from "@stencil/core";
import { Component as GxComponent } from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "canvas-cell.scss",
  tag: "gx-canvas-cell"
})
export class CanvasCell implements GxComponent {
  @Element() element: HTMLGxCanvasCellElement;

  /**
   * Defines the horizontal aligmnent of the content of the cell.
   */
  @Prop() readonly align: "left" | "right" | "center" = "left";

  /**
   * This attribute defines how the control behaves when the content overflows.
   *
   * | Value    | Details                                                     |
   * | -------- | ----------------------------------------------------------- |
   * | `scroll` | The overflowin content is hidden, but scrollbars are shown  |
   * | `clip`   | The overflowing content is hidden, without scrollbars       |
   *
   */
  @Prop() readonly overflowMode: "scroll" | "clip";

  /**
   * Defines the vertical aligmnent of the content of the cell.
   */
  @Prop() readonly valign: "top" | "bottom" | "medium" = "top";

  render() {
    return <slot />;
  }
}
