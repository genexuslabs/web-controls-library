import {
  Component,
  Element,
  Event,
  EventEmitter,
  Prop,
  Watch
} from "@stencil/core";
import { BaseComponent } from "../common/base-component";
import { ModalRender } from "../renders";

@Component({
  shadow: false,
  styleUrl: "modal.scss",
  tag: "gx-modal"
})
export class Modal extends ModalRender(BaseComponent) {
  @Element() element: HTMLElement;

  /**
   * This attribute lets you specify if the modal dialog is automatically closed when an action is clicked.
   */
  @Prop() autoClose: boolean;

  /**
   * This attribute lets you specify the label for the close button. Important for accessibility.
   */
  @Prop() closeButtonLabel: string;

  /**
   * This attribute lets you specify if the modal dialog is opened or closed.
   */
  @Prop({ mutable: true })
  opened = false;

  /**
   * Fired when the modal dialog is closed
   */
  @Event() onClose: EventEmitter;

  /**
   * Fired when the modal dialog is opened
   */
  @Event() onOpen: EventEmitter;

  @Watch("opened")
  openedHandler(newValue: boolean, oldValue = false) {
    if (newValue === oldValue) {
      return;
    }

    if (newValue) {
      this.open();
    } else {
      this.close();
    }
  }
}
