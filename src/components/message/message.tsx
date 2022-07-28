import { Component, Element, Host, Prop, h } from "@stencil/core";
import { Component as GxComponent } from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "message.scss",
  tag: "gx-message"
})
export class Message implements GxComponent {
  @Element() element: HTMLGxMessageElement;

  /**
   * The time in seconds before the message is automatically dismissed.
   * If no duration is specified, the message will not be automatically dismissed.
   */
  @Prop() readonly duration: number = 0;

  render() {
    return <Host></Host>;
  }
}
