import { Component, Element, Host, Prop, State, h } from "@stencil/core";
import { Component as GxComponent } from "../common/interfaces";
import {
  DismissableComponent,
  makeDismissable,
  SHOULD_DISMISS,
  STOP_DISMISS
} from "../common/motion-handlers/dismissable";
import { setContrastColor } from "../common/utils";

@Component({
  shadow: true,
  styleUrl: "message.scss",
  tag: "gx-message"
})
export class Message implements GxComponent, DismissableComponent {
  private interval: NodeJS.Timer = null;
  private intervalDuration: number;

  private presented = false;

  @Element() element: HTMLGxMessageElement;

  /**
   * A CSS class to set as the `gx-message` element class.
   */
  @Prop() readonly cssClass: string = null;

  /**
   * The time in seconds before the message is automatically dismissed.
   * If no duration is specified, the message will not be automatically dismissed.
   */
  @Prop() readonly duration: number = 0;

  /**
   * This attribute lets you identify the message.
   * If `messageId == null`, the message will not be presented.
   */
  @Prop({ mutable: true }) messageId: string = null;

  /**
   * This attribute lets you specify the text of the message.
   */
  @Prop() readonly messageText: string = null;

  @State() triggerDismiss = false;

  componentDidRender() {
    // Contrast for gx-message's background-color
    setContrastColor(
      this.element,
      this.element,
      "background-color",
      "--contrast-color"
    );
  }

  componentDidLoad() {
    makeDismissable(this);
  }

  render() {
    const wasPreviouslyPresented = this.presented;
    this.presented =
      this.messageId != null &&
      !this.element.classList.contains(SHOULD_DISMISS);

    this.intervalDuration = this.duration;

    // If the message should be dismissed because a dismiss gesture was performed
    if (this.element.classList.contains(SHOULD_DISMISS)) {
      clearInterval(this.interval);
      this.element.classList.remove(STOP_DISMISS, SHOULD_DISMISS);
    }

    // Check if should not set the interval
    if (this.duration == 0) {
      clearInterval(this.interval);

      // If duration > 0, check if should set the interval
    } else if (!wasPreviouslyPresented && this.presented) {
      this.interval = setInterval(() => {
        // Do not dismiss if the message is being dragged
        if (this.element.classList.contains(STOP_DISMISS)) {
          this.intervalDuration = this.duration;

          // Decrement the duration
        } else if (this.intervalDuration > 0) {
          this.intervalDuration--;
        } else {
          // Since each message has its unique id, we model the dismiss with
          // the null id
          this.messageId = null;
          clearInterval(this.interval);
        }
      }, 1000);
    }

    return (
      <Host
        role="alert"
        class={{ [this.cssClass]: !!this.cssClass, presented: this.presented }}
      >
        {this.presented && this.messageText}
      </Host>
    );
  }
}
