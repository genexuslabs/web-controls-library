import {
  Component,
  Element,
  Event,
  EventEmitter,
  Prop,
  Watch
} from "@stencil/core";
import { RadioOptionRender } from "../renders/bootstrap/radio-option/radio-option-render";
import {
  IComponent,
  IDisableableComponent,
  IVisibilityComponent
} from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "radio-option.scss",
  tag: "gx-radio-option"
})
export class RadioOption
  implements IComponent, IDisableableComponent, IVisibilityComponent {
  constructor() {
    this.renderer = new RadioOptionRender(this);
  }

  private renderer: RadioOptionRender;

  @Element() element: HTMLElement;

  /**
   * Specifies the label of the radio.
   */
  @Prop() caption: string;

  /**
   * Indicates that the control is selected by default.
   */
  @Prop({ mutable: true })
  checked: boolean;

  /**
   * A CSS class to set as the inner `input` element class.
   */
  @Prop() cssClass: string;

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
   * This attribute lets you specify if the element is disabled.
   * If disabled, it will not fire any user interaction related event
   * (for example, click event).
   */
  @Prop() disabled = false;

  /**
   * The identifier of the control. Must be unique.
   */
  @Prop() id: string;

  /**
   * The name of the inner input of type radio
   */
  @Prop() name: string;

  /**
   * The initial value of the control.
   */
  @Prop({ mutable: true })
  value: string;

  /**
   * The `change` event is emitted when a change to the element's value is
   * committed by the user.
   */
  @Event() onChange: EventEmitter;

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

  componentDidUnload() {
    this.gxRadioDidUnload.emit({ radio: this });
    this.renderer.componentDidUnload();
  }

  render() {
    return this.renderer.render();
  }
}
