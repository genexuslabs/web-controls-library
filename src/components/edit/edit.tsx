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
import { EditRender } from "../renders";

@Component({
  tag: "gx-edit",
  styleUrl: "edit.scss",
  shadow: false
})
export class Edit extends EditRender(BaseComponent) {
  @Element() element: HTMLElement;

  @Prop() autocapitalize: "none" | "sentences" | "words" | "characters";
  @Prop() autocomplete: "on" | "off";
  @Prop() autocorrect: string;
  @Prop() cssClass: string;
  @Prop() disabled: boolean = false;
  @Prop() id: string;
  @Prop() invisibleMode: "collapse" | "keep-space" = "collapse";
  @Prop() multiline: boolean;
  @Prop() placeholder: string;
  @Prop() readonly: boolean;
  @Prop() showTrigger: boolean;
  @Prop() triggerText: string;
  @Prop() triggerClass: string;
  @Prop()
  type:
    | "date"
    | "datetime-local"
    | "email"
    | "file"
    | "number"
    | "password"
    | "search"
    | "tel"
    | "text"
    | "url" = "text";
  @Prop({ mutable: true })
  value: string;

  @Event() onChange: EventEmitter;
  @Event() onInput: EventEmitter;
  @Event() gxTriggerClick: EventEmitter;

  @Method()
  getNativeInputId() {
    return super.getNativeInputId();
  }

  @Watch("value")
  protected valueChanged() {
    super.valueChanged();
    this.toggleValueSetClass();
  }

  private toggleValueSetClass() {
    if (this.value === "") {
      this.element.classList.remove("value-set");
    } else {
      this.element.classList.add("value-set");
    }
  }

  componentDidLoad() {
    this.toggleValueSetClass();
  }
}
