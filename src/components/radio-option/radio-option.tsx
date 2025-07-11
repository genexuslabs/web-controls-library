import {
  Component,
  Element,
  Event,
  EventEmitter,
  Host,
  Prop,
  Watch,
  h
} from "@stencil/core";
import {
  DisableableComponent,
  Component as GxComponent
} from "../common/interfaces";
import { RadioOptionRender } from "../renders/bootstrap/radio-option/radio-option-render";

@Component({
  shadow: false,
  styleUrl: "radio-option.scss",
  tag: "gx-radio-option"
})
export class RadioOption implements GxComponent, DisableableComponent {
  constructor() {
    this.renderer = new RadioOptionRender(this);
  }

  private renderer: RadioOptionRender;

  @Element() element: HTMLGxRadioOptionElement;

  /**
   * Specifies the label of the radio.
   */
  @Prop() readonly caption: string;

  /**
   * Indicates that the control is selected by default.
   */
  @Prop({ mutable: true }) checked: boolean;

  /**
   * This attribute lets you specify if the element is disabled.
   * If disabled, it will not fire any user interaction related event
   * (for example, click event).
   */
  @Prop() readonly disabled: boolean = false;

  /**
   * The name of the inner input of type radio
   */
  @Prop() readonly name: string;

  /**
   * The initial value of the control.
   */
  @Prop({ mutable: true }) value: string;

  /**
   * The `change` event is emitted when a change to the element's value is
   * committed by the user.
   */
  @Event() change: EventEmitter;

  /**
   * Emitted when the radio button is selected.
   */
  @Event() gxSelect: EventEmitter;

  /**
   * Emitted when the radio loads.
   */
  @Event() gxRadioDidLoad: EventEmitter;

  /**
   * Emitted when the radio unloads.
   */
  @Event() gxRadioDidUnload: EventEmitter;

  @Watch("checked")
  protected checkedChanged(isChecked: boolean) {
    this.renderer.checkedChanged(isChecked);
  }

  @Watch("disabled")
  disabledChanged(isDisabled: boolean) {
    this.renderer.disabledChanged(isDisabled);
  }

  componentDidLoad() {
    this.gxRadioDidLoad.emit({ radio: this });
    this.renderer.componentDidLoad();
  }

  disconnectedCallback() {
    this.gxRadioDidUnload.emit({ radio: this });
  }

  render() {
    return <Host>{this.renderer.render()}</Host>;
  }
}
