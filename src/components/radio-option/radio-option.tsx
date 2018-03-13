import {
  Watch,
  Element,
  Component,
  Prop,
  Event,
  EventEmitter
} from "@stencil/core";
import { BaseComponent } from "../common/base-component";
import { RadioOptionRender } from "../renders";

@Component({
  tag: "gx-radio-option",
  styleUrl: "radio-option.scss",
  shadow: false
})
export class RadioOption extends RadioOptionRender(BaseComponent) {
  @Element() element: HTMLElement;

  @Prop() caption: string;
  @Prop({ mutable: true })
  checked: boolean;
  @Prop() cssClass: string;
  @Prop() disabled: boolean = false;
  @Prop() id: string;
  @Prop() invisibleMode: "collapse" | "keep-space" = "collapse";
  @Prop() name: string;
  @Prop({ mutable: true })
  value: string;

  @Event() onChange: EventEmitter;
  @Event() gxSelect: EventEmitter;
  @Event() gxRadioDidLoad: EventEmitter;
  @Event() gxRadioDidUnload: EventEmitter;

  @Watch("checked")
  protected checkedChanged(isChecked: boolean) {
    super.checkedChanged(isChecked);
  }

  @Watch("disabled")
  disabledChanged(isDisabled: boolean) {
    super.disabledChanged(isDisabled);
  }

  componentDidLoad() {
    this.gxRadioDidLoad.emit({ radio: this });
    super.componentDidLoad();
    this.nativeInput.checked = this.checked;
  }

  componentDidUnload() {
    this.gxRadioDidUnload.emit({ radio: this });
    super.componentDidUnload();
  }
}

export interface HTMLRadioOptionElementEvent extends CustomEvent {
  target: any;
}
