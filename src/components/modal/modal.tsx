import {
  Component,
  Element,
  Event,
  EventEmitter,
  Prop,
  Watch,
  h,
  Host
} from "@stencil/core";
import { ModalRender } from "../renders/bootstrap/modal/modal-render";
import { Component as GxComponent } from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "modal.scss",
  tag: "gx-modal"
})
export class Modal implements GxComponent {
  constructor() {
    this.renderer = new ModalRender(this);
  }

  private renderer: ModalRender;

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
   * This attribute lets you specify if the modal dialog is opened or closed.
   */
  @Prop({ mutable: true }) opened = false;

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
      this.renderer.open();
      this.onOpen.emit();
    } else {
      this.renderer.close();
      this.onClose.emit();
    }
  }

  componentDidLoad() {
    this.renderer.componentDidLoad();
  }

  render() {
    return (
      <Host>
        {this.renderer.render({
          body: <slot name="body" />,
          header: <slot name="header" />,
          primaryAction: <slot name="primary-action" />,
          secondaryAction: <slot name="secondary-action" />
        })}
      </Host>
    );
  }
}
