import { Element, Component, Prop, Event, EventEmitter } from "@stencil/core";
import { BaseComponent } from "../common/base-component";

@Component({
  tag: "gx-table",
  styleUrl: "table.scss",
  shadow: false
})
export class Table extends BaseComponent {
  @Element() element: HTMLElement;

  @Prop() invisibleMode: "collapse" | "keep-space" = "collapse";
  @Prop() disabled: boolean = false;
  @Prop() areasTemplate: string;
  @Prop() columnsTemplate: string;
  @Prop() rowsTemplate: string;
  @Prop() autoGrow: boolean;

  @Event() onClick: EventEmitter;
  // TODO: Implement touch devices events (Tap, DoubleTap, LongTap, SwipeX)

  handleClick(event: UIEvent) {
    if (this.disabled) return;

    this.onClick.emit(event);
  }

  render() {
    if (this.areasTemplate) {
      this.element.style["gridTemplateAreas"] = this.areasTemplate;
    }
    if (this.columnsTemplate) {
      this.element.style["gridTemplateColumns"] = this.columnsTemplate;
    }
    if (this.rowsTemplate) {
      this.element.style["gridTemplateRows"] = this.rowsTemplate;
    }

    this.element.addEventListener("click", this.handleClick.bind(this));

    return <slot />;
  }
}
