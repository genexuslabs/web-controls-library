import { Component, Element, Prop, h } from "@stencil/core";
import { MessageRender } from "../renders/bootstrap/message/message-render";
import { IComponent, IVisibilityComponent } from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "message.scss",
  tag: "gx-message"
})
export class Message implements IComponent, IVisibilityComponent {
  constructor() {
    this.renderer = new MessageRender(this);
  }

  private renderer: MessageRender;

  @Element() element: HTMLElement;

  /**
   * This attribute lets you specify how this element will behave when hidden.
   *
   * | Value        | Details                                                                     |
   * | ------------ | --------------------------------------------------------------------------- |
   * | `keep-space` | The element remains in the document flow, and it does occupy space.         |
   * | `collapse`   | The element is removed form the document flow, and it doesn't occupy space. |
   */
  @Prop() invisibleMode: "collapse" | "keep-space" = "collapse";

  /**
   * Show a button for closing the meesage box
   */
  @Prop() showCloseButton: boolean;

  /**
   * Text for the close button.
   */
  @Prop() closeButtonText: string;

  /**
   * Type of the button:
   * * `info`: Information message
   * * `warning`: Warning Message
   * * `error`: Error message
   */
  @Prop() type: "info" | "warning" | "error";

  /**
   * The time in miliseconds before the message is automatically dismissed.
   * If no duration is specified, the message will not be automatically dismissed.
   */
  @Prop() duration: number;

  componentDidLoad() {
    this.renderer.componentDidLoad();
  }

  render() {
    return this.renderer.render({ default: <slot /> });
  }
}
