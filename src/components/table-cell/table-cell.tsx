import { Element, Component, Prop } from "@stencil/core";
import { BaseComponent } from "../common/base-component";

@Component({
  tag: "gx-table-cell",
  styleUrl: "table-cell.scss",
  shadow: false
})
export class TableCell extends BaseComponent {
  @Element() element: HTMLElement;

  @Prop() area: string;
  @Prop() align: "left" | "right" | "center" = "left";
  @Prop() autoGrow: boolean;
  @Prop() valign: "top" | "bottom" | "medium" = "top";

  render() {
    if (this.element) {
      this.element.style["gridArea"] = this.area;
    }

    return <slot />;
  }
}
