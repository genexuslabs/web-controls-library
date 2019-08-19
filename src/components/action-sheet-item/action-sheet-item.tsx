import {
  Component,
  Element,
  Event,
  EventEmitter,
  Prop,
  h
} from "@stencil/core";
import { IClickableComponent, IComponent } from "../common/interfaces";
import { ActionSheetItemRender } from "../renders/bootstrap/action-sheet-item/action-sheet-item-render";

@Component({
  shadow: false,
  styleUrl: "action-sheet-item.scss",
  tag: "gx-action-sheet-item"
})
export class ActionSheetItem implements IClickableComponent, IComponent {
  constructor() {
    this.renderer = new ActionSheetItemRender(this);
  }

  private renderer: ActionSheetItemRender;
  @Element() element: HTMLGxActionSheetItemElement;

  /**
   * This attribute lets you specify the type of action. `"cancel"` and `"destructive"` are style differently
   */
  @Prop() actionType: "cancel" | "default" | "destructive" = "default";

  /**
   * This attribute lets you specify if the element is disabled.
   * If disabled, it will not fire any user interaction related event
   * (for example, click event).
   */
  @Prop() disabled = false;

  /**
   * Fired when the action sheet item is clicked
   */
  @Event() onClick: EventEmitter;

  handleClick(event: UIEvent) {
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
    return this.renderer.render({ default: <slot /> });
  }
}
