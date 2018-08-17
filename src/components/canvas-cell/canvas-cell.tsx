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
   * This attribute defines how the control behaves when the content overflows.
   * 
   * | Value    | Details                                                     |
   * | -------- | ----------------------------------------------------------- |
   * | `scroll` | The overflowin content is hidden, but scrollbars are shown  |
   * | `clip`   | The overflowing content is hidden, without scrollbars       |
   * 
   */
  @Prop() overflowMode: "scroll" | "clip";

  /**
   * Defines the vertical aligmnent of the content of the cell.
   */
  @Prop() valign: "top" | "bottom" | "medium" = "top";

  render() {
    return <slot />;
  }
}
