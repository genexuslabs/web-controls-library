import { Component, Element, Prop, h, Host } from "@stencil/core";
import { Component as GxComponent } from "../common/interfaces";

import {
  AccessibleRoleCell,
  AccessibleRoleCellComponent
} from "../../common/interfaces";

@Component({
  shadow: true,
  styleUrl: "canvas-cell.scss",
  tag: "gx-canvas-cell"
})
export class CanvasCell implements GxComponent, AccessibleRoleCellComponent {
  @Element() element: HTMLGxCanvasCellElement;

  /**
   * Specifies the semantics of the control. Specifying the Role allows
   * assistive technologies to give information about how to use the control to
   * the user.
   */
  @Prop() readonly accessibleRole: AccessibleRoleCell;

  /**
   * Defines the horizontal alignment of the content of the cell.
   */
  @Prop({ reflect: true }) readonly align: "left" | "right" | "center";

  /**
   * Defines the left position of the control which is relative to the position
   * of its `gx-canvas` container.
   * This attribute maps directly to the `left` CSS property.
   */
  @Prop() readonly left: string = "0px";

  /**
   * This attribute defines the maximum height of the cell.
   */
  @Prop() readonly maxHeight: string = null;

  /**
   * This attribute defines the minimum height of the cell.
   */
  @Prop() readonly minHeight: string = "100%";

  /**
   * Defines the top position of the control which is relative to the position
   * of its `gx-canvas` container.
   * This attribute maps directly to the `top` CSS property.
   */
  @Prop() readonly top: string = "0px";

  /**
   * Defines the vertical alignment of the content of the cell.
   */
  @Prop({ reflect: true }) readonly valign: "top" | "bottom" | "middle";

  /**
   * This attribute lets you specify the width of the control.
   */
  @Prop() readonly width: string = "100%";

  render() {
    return (
      <Host
        role={this.accessibleRole}
        class={{
          "gx-cell": true,
          "auto-grow-cell": this.maxHeight == null,
          "without-auto-grow-cell": this.maxHeight != null
        }}
        style={{
          top: this.top,
          left: this.left,
          width: this.width,
          "min-height": this.minHeight,
          "max-height": this.maxHeight
        }}
      >
        <slot />
      </Host>
    );
  }
}
