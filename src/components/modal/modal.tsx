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

  @Watch("opened")
  openedHandler(newValue: boolean, oldValue = false) {
    if (newValue === oldValue) {
      return;
    }

    if (newValue) {
      this.renderer.open();
      this.open.emit();
    } else {
      this.renderer.close();
      this.close.emit();
    }
  }

  componentDidLoad() {
    this.renderer.componentDidLoad();

    // The modal might be opened when it is first rendered, due to in some
    // cases it was open when the UI was refreshed.
    if (this.opened) {
      this.renderer.open();
      this.open.emit();
    }
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
