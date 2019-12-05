import {
  Component,
  Element,
  Event,
  EventEmitter,
  Listen,
  Prop,
  h,
  Host
} from "@stencil/core";
import { Component as GxComponent } from "../common/interfaces";
import { ActionSheetRender } from "../renders/bootstrap/action-sheet/action-sheet-render";

@Component({
  shadow: false,
  styleUrl: "action-sheet.scss",
  tag: "gx-action-sheet"
})
export class ActionSheet implements GxComponent {
  constructor() {
    this.renderer = new ActionSheetRender(this);
  }

  private renderer: ActionSheetRender;

  @Element() element: HTMLGxActionSheetElement;

  /**
   * This attribute lets you specify the label for the close button. Important for accessibility.
   */
  @Prop() readonly closeButtonLabel: string;

  /**
   * This attribute lets you specify if the action sheet is opened or closed.
   */
  @Prop({ mutable: true }) opened = false;

  /**
   * Fired when the action sheet is closed
   */
  @Event() onClose: EventEmitter;

  /**
   * Fired when the action sheet is opened
   */
  @Event() onOpen: EventEmitter;

  @Listen("onClick")
  handleItemClick() {
    this.opened = false;
  }

  render() {
    return <Host>{this.renderer.render({ default: <slot /> })}</Host>;
  }
}
