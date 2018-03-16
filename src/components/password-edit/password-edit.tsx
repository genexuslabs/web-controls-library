import {
  State,
  Listen,
  Method,
  Watch,
  Element,
  Component,
  Prop,
  Event,
  EventEmitter
} from "@stencil/core";
import { BaseComponent } from "../common/base-component";
import { PasswordEditRender } from "../renders";

@Component({
  tag: "gx-password-edit",
  styleUrl: "password-edit.scss",
  shadow: false
})
export class PasswordEdit extends PasswordEditRender(BaseComponent) {
  @Element() element: HTMLElement;

  @Prop() cssClass: string;
  @Prop() disabled: boolean = false;
  @Prop() id: string;
  @Prop() invisibleMode: "collapse" | "keep-space" = "collapse";
  @Prop() placeholder: string;
  @Prop() readonly: boolean;
  @Prop() revealButtonTextOn: string;
  @Prop() revealButtonTextOff: string;
  @Prop() showRevealButton: boolean;
  @Prop({ mutable: true })
  value: string;

  @State() protected revealed: boolean = false;

  @Event() onChange: EventEmitter;
  @Event() onInput: EventEmitter;

  @Method()
  getNativeInputId() {
    return super.getNativeInputId();
  }

  @Watch("value")
  protected valueChanged() {
    super.valueChanged();
  }

  @Listen("gxTriggerClick")
  protected handleTriggerClick() {
    this.revealed = !this.revealed;
    super.handleTriggerClick();
  }
}
