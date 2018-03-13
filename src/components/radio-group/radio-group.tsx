import {
  Listen,
  Watch,
  Element,
  Component,
  Prop,
  Event,
  EventEmitter
} from "@stencil/core";
import { BaseComponent } from "../common/base-component";
import { HTMLRadioOptionElementEvent } from "../radio-option/radio-option";

@Component({
  tag: "gx-radio-group",
  styleUrl: "radio-group.scss",
  shadow: false
})
export class RadioGroup extends BaseComponent {
  private radios: any[] = [];
  private didLoad: boolean;

  @Element() element: HTMLElement;

  @Prop() disabled: boolean = false;
  @Prop() id: string;
  @Prop() invisibleMode: "collapse" | "keep-space" = "collapse";
  @Prop() name: string;
  @Prop({ mutable: true })
  value: string;

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
  onRadioDidLoad(ev: HTMLRadioOptionElementEvent) {
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
  onRadioDidUnload(ev: HTMLRadioOptionElementEvent) {
    const index = this.radios.indexOf(ev.target);
    if (index > -1) {
      this.radios.splice(index, 1);
    }
  }

  @Listen("gxSelect")
  onRadioSelect(ev: HTMLRadioOptionElementEvent) {
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
