import { Element, Component, Prop } from '@stencil/core';

@Component({
  tag: 'gx-table-cell',
  styleUrl: 'table-cell.scss',
  shadow: false
})

export class TableCell {
  @Element() element: HTMLElement;

  @Prop() area: string;
  @Prop() align: "left" | "right" | "center" = "left";
  @Prop() valign: "top" | "bottom" | "medium" = "top";

  componentDidLoad()  {
    if (this.element) {
      this.element.style["gridArea"] = this.area;
    }
  }

  render() {
    return (
      <slot />
    );
  }
}
