import {
  Component,
  Element,
  Event,
  EventEmitter,
  Host,
  Prop,
  h
} from "@stencil/core";
import { Component as GxComponent } from "../common/interfaces";

@Component({
  shadow: true,
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
  @Prop() readonly disabled: boolean = false;

  /**
   * Fired when the action sheet item is clicked
   */
  @Event() actionSheetItemClick: EventEmitter<any>;

  private handleClick = (e: UIEvent) => {
    e.stopPropagation();
    this.actionSheetItemClick.emit();
  };

  render() {
    return (
      <Host
        class={{
          danger: this.actionType === "destructive",
          disabled: this.disabled
        }}
        onClick={this.handleClick}
      >
        <slot />
      </Host>
    );
  }
}
