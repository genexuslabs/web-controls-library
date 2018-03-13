import {
  Method,
  Watch,
  Element,
  Component,
  Prop,
  Event,
  EventEmitter
} from "@stencil/core";
import { BaseComponent } from "../common/base-component";
import { CheckBoxRender } from "../renders";

@Component({
  tag: "gx-checkbox",
  styleUrl: "checkbox.scss",
  shadow: false
})
export class CheckBox extends CheckBoxRender(BaseComponent) {
  @Element() element: HTMLElement;

  @Prop() caption: string;
  @Prop({ mutable: true })
  checked: boolean;
  @Prop() cssClass: string;
  @Prop() disabled: boolean = false;
  @Prop() id: string;
  @Prop() invisibleMode: "collapse" | "keep-space" = "collapse";

  @Event() onChange: EventEmitter;

  @Method()
  getNativeInputId() {
    return super.getNativeInputId();
  }

  @Watch("checked")
  protected checkedChanged() {
    super.checkedChanged();
  }
}
