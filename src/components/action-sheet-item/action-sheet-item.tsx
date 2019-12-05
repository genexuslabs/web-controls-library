import {
  Component,
  Element,
  Event,
  EventEmitter,
  Prop,
  h,
  Host
} from "@stencil/core";
import {
  ClickableComponent,
  Component as GxComponent
} from "../common/interfaces";
import { ActionSheetItemRender } from "../renders/bootstrap/action-sheet-item/action-sheet-item-render";

@Component({
  shadow: false,
  styleUrl: "action-sheet-item.scss",
  tag: "gx-action-sheet-item"
})
export class ActionSheetItem implements ClickableComponent, GxComponent {
  constructor() {
    this.renderer = new ActionSheetItemRender(this, {
      handleClick: this.handleClick
    });
  }

  private renderer: ActionSheetItemRender;
  @Element() element: HTMLGxActionSheetItemElement;

  /**
   * This attribute lets you specify the type of action. `"cancel"` and `"destructive"` are style differently
   */
  @Prop() readonly actionType: "cancel" | "default" | "destructive" = "default";

  /**
   * This attribute lets you specify if the element is disabled.
   * If disabled, it will not fire any user interaction related event
   * (for example, click event).
   */
  @Prop() readonly disabled = false;

  /**
   * Fired when the action sheet item is clicked
   */
  @Event() onClick: EventEmitter;

  private handleClick(event: UIEvent) {
    if (this.disabled) {
      return;
    }

    this.onClick.emit(event);
    event.preventDefault();
  }

  componentDidLoad() {
    this.renderer.componentDidLoad();
  }

  render() {
    return <Host>{this.renderer.render({ default: <slot /> })}</Host>;
  }
}
