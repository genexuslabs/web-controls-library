import { Component, Element, Prop, h, Host, Listen } from "@stencil/core";
import { Component as GxComponent } from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "action-sheet-item.scss",
  tag: "gx-action-sheet-item"
})
export class ActionSheetItem implements GxComponent {
  constructor() {
    this.handleClick = this.handleClick.bind(this);
  }
  @Element() element: HTMLGxActionSheetItemElement;

  /**
   * This attribute lets you specify the type of action. `"cancel"` and `"destructive"` are styled differently
   */
  @Prop() readonly actionType: "default" | "destructive" = "default";

  /**
   * This attribute lets you specify if the element is disabled.
   * If disabled, it will not fire any user interaction related event
   * (for example, gxClick event).
   */
  @Prop() readonly disabled = false;

  @Listen("click", { capture: true })
  private handleClick(event: UIEvent) {
    if (this.disabled) {
      event.stopPropagation();
    }

    event.preventDefault();
  }

  render() {
    return (
      <Host
        class={{
          "gx-as-item": true,
          "gx-as-item--danger": this.actionType === "destructive",
          "gx-as-item--disabled": this.disabled
        }}
      >
        <slot />
      </Host>
    );
  }
}
