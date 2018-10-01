import {
  Component,
  Element,
  Event,
  EventEmitter,
  Listen,
  Prop,
  Watch
} from "@stencil/core";
import {
  IComponent,
  IDisableableComponent,
  IVisibilityComponent
} from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "radio-group.scss",
  tag: "gx-radio-group"
})
export class RadioGroup
  implements IComponent, IDisableableComponent, IVisibilityComponent {
  private radios: any[] = [];
  private didLoad: boolean;

  @Element() element: HTMLElement;

  /**
   * Specifies how the child `gx-radio-option` will be layed out.
   * It supports two values:
   *
   * * `horizontal`
   * * `vertical` (default)
   */
  @Prop() direction: "horizontal" | "vertical" = "horizontal";

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
   * The name that will be set to all the inner inputs of type radio
   */
  @Prop() name: string;

  /**
   * The initial value of the control. Setting the value automatically selects
   * the corresponding radio option.
   */
  @Prop({ mutable: true })
  value: string;

  /**
   * The `change` event is emitted when a change to the element's value is
   * committed by the user.
   */
  @Event() onChange: EventEmitter;

  private getValueFromEvent(event: UIEvent): string {
    return event.target && (event.target as HTMLInputElement).value;
  }

  handleChange(event: UIEvent) {
    this.value = this.getValueFromEvent(event);
    this.onChange.emit(event);
  }

  @Watch("disabled")
  disabledChanged() {
    this.setDisabled();
  }

  @Watch("value")
  valueChanged() {
    // this radio group's value just changed
    // double check the button with this value is checked
    if (this.value === undefined) {
      // set to undefined
      // ensure all that are checked become unchecked
      this.radios.filter(r => r.checked).forEach(radio => {
        radio.checked = false;
      });
    } else {
      let hasChecked = false;

      this.radios.forEach(radio => {
        if (radio.value === this.value) {
          if (!radio.checked && !hasChecked) {
            // correct value for this radio
            // but this radio isn't checked yet
            // and we haven't found a checked yet
            // so CHECK IT!
            radio.checked = true;
          } else if (hasChecked && radio.checked) {
            // somehow we've got multiple radios
            // with the same value, but only one can be checked
            radio.checked = false;
          }

          // remember we've got a checked radio button now
          hasChecked = true;
        } else if (radio.checked) {
          // this radio doesn't have the correct value
          // and it's also checked, so let's uncheck it
          radio.checked = false;
        }
      });
    }

    if (this.didLoad) {
      // emit the new value
      this.onChange.emit({ value: this.value });
    }
  }

  @Listen("gxRadioDidLoad")
  onRadioDidLoad(ev: IHTMLRadioOptionElementEvent) {
    const radio = ev.target;
    this.radios.push(radio);
    radio.name = this.name;

    if (this.value !== undefined && radio.value === this.value) {
      // this radio-group has a value and this
      // radio equals the correct radio-group value
      // so let's check this radio
      radio.checked = true;
    } else if (this.value === undefined && radio.checked) {
      // this radio-group does not have a value
      // but this radio is checked, so let's set the
      // radio-group's value from the checked radio
      this.value = radio.value;
    } else if (radio.checked) {
      // if it doesn't match one of the above cases, but the
      // radio is still checked, then we need to uncheck it
      radio.checked = false;
    }
  }

  @Listen("gxRadioDidUnload")
  onRadioDidUnload(ev: IHTMLRadioOptionElementEvent) {
    const index = this.radios.indexOf(ev.target);
    if (index > -1) {
      this.radios.splice(index, 1);
    }
  }

  @Listen("gxSelect")
  onRadioSelect(ev: IHTMLRadioOptionElementEvent) {
    this.radios.forEach(radio => {
      if (radio === ev.target) {
        if (radio.value !== this.value) {
          this.value = radio.value;
        }
      } else {
        radio.checked = false;
      }
    });
  }

  setDisabled() {
    this.radios.forEach(radio => {
      radio.disabled = this.disabled;
    });
  }

  componentDidLoad() {
    this.setDisabled();
    this.didLoad = true;
  }

  hostData() {
    return {
      role: "radiogroup"
    };
  }

  render() {
    return <slot />;
  }
}

interface IHTMLRadioOptionElementEvent extends CustomEvent {
  target: any;
}
