import {
  Component,
  Element,
  Event,
  EventEmitter,
  Prop,
  h,
  Host
} from "@stencil/core";
import { Component as GxComponent } from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "modal.scss",
  tag: "gx-modal"
})
export class Modal implements GxComponent {
  @Element() element: HTMLGxModalElement;

  /**
   * This attribute lets you specify if the modal dialog is automatically closed when an action is clicked.
   */
  @Prop() readonly autoClose: boolean;

  /**
   * This attribute lets you specify the label for the close button. Important for accessibility.
   */
  @Prop() readonly closeButtonLabel: string;

  /**
   * This attribute lets you specify the height of the control.
   */
  @Prop() readonly height: string = null;

  /**
   * This attribute lets you specify if the modal dialog is opened or closed.
   */
  @Prop({ mutable: true }) opened = false;

  /**
   * This attribute lets you specify if a header is renderd on top of the modal dialog.
   */
  @Prop() showHeader = true;

  /**
   * This attribute lets you specify the width of the control.
   */
  @Prop() readonly width: string = null;

  /**
   * Fired when the modal dialog is closed
   */
  @Event() close: EventEmitter;

  /**
   * Fired when the modal dialog is opened
   */
  @Event() open: EventEmitter;

  render() {
    return <Host></Host>;
  }
}
