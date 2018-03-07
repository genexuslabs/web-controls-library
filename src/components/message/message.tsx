import { Component, Element, Prop } from "@stencil/core";
import { BaseComponent } from "../common/base-component";
import { MessageRender } from "../renders";

@Component({
  tag: "gx-message",
  styleUrl: "message.scss",
  shadow: false
})
export class Message extends MessageRender(BaseComponent) {
  @Element() element: HTMLElement;
  @Prop() showCloseButton: boolean;
  @Prop() closeButtonText: string;
  @Prop() type: "info" | "warning" | "error";
  @Prop() duration: number;

  componentDidLoad() {
    super.componentDidLoad();
  }
}
