import {
  Component,
  Element,
  Event,
  EventEmitter,
  Method,
  Prop,
  h,
  Host
} from "@stencil/core";
import { FormComponent } from "../common/interfaces";

// Class transforms
import { getClasses } from "../common/css-transforms/css-transforms";

let autoSwitchId = 0;

@Component({
  shadow: false,
  styleUrl: "switch.scss",
  tag: "gx-switch"
})
export class Switch implements FormComponent {
  constructor() {
    if (!this.inputId) {
      this.inputId = this.element.id
        ? `${this.element.id}_switch`
        : `gx-switch-auto-id-${autoSwitchId++}`;
    }
  }

  private inputId: string;

  @Element() element: HTMLGxSwitchElement;

  /**
   * Caption displayed when the switch is 'on'
   */
  @Prop() readonly checkedCaption: string;

  /**
   * The value when the switch is 'on'
   */
  @Prop() readonly checkedValue: string;

  /**
   * A CSS class to set as the `gx-switch` element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * This attribute allows you specify if the element is disabled.
   * If disabled, it will not trigger any user interaction related event
   * (for example, click event).
   */
  @Prop() readonly disabled = false;

  /**
   * This attribute lets you specify how this element will behave when hidden.
   *
   * | Value        | Details                                                                     |
   * | ------------ | --------------------------------------------------------------------------- |
   * | `keep-space` | The element remains in the document flow, and it does occupy space.         |
   * | `collapse`   | The element is removed form the document flow, and it doesn't occupy space. |
   */
  @Prop() readonly invisibleMode: "collapse" | "keep-space" = "collapse";

  /**
   * Caption displayed when the switch is 'off'
   */
  @Prop() readonly unCheckedCaption: string;

  /**
   * The value when the switch is 'off'
   */
  @Prop() readonly unCheckedValue: string;

  /**
   * The value of the control.
   */
  @Prop({ mutable: true }) value: string = null;

  /**
   * The 'input' event is emitted when a change to the element's value is committed by the user.
   */
  @Event() input: EventEmitter;

  /**
   * Returns the id of the inner `input` element (if set).
   */
  @Method()
  async getNativeInputId() {
    return this.inputId;
  }

  private handleChange = (event: UIEvent) => {
    const checked = event.target && (event.target as HTMLInputElement).checked;

    // Toggle the value property
    this.value = checked ? this.checkedValue : this.unCheckedValue;

    this.input.emit(event);
  };

  componentWillLoad() {
    // Set initial value to unchecked if empty
    if (!this.value) {
      this.value = this.unCheckedValue;
    }
  }

  render() {
    // Styling for gx-switch control.
    const classes = getClasses(this.cssClass);

    const checked = this.value === this.checkedValue;

    const inputAttrs = {
      role: "switch",
      "aria-checked": checked ? "true" : "false",
      "aria-disabled": this.disabled ? "true" : "false",
      "aria-valuetext": checked ? this.checkedCaption : this.unCheckedCaption,
      checked: checked,
      disabled: this.disabled,
      id: this.inputId,
      type: "checkbox",
      value: checked ? this.checkedValue : this.unCheckedValue,
      onchange: this.handleChange
    };

    return (
      <Host
        class={{
          [this.cssClass]: !!this.cssClass,
          [classes.vars]: true,
          disabled: this.disabled
        }}
        // Horizontal and vertical alignment support
        data-align
        data-valign
      >
        <label
          htmlFor={this.inputId}
          class={{
            "gx-switch-container": true,
            "gx-switch-container--checked": checked
          }}
        >
          <input {...inputAttrs} />
          <span class="gx-switch-slider" aria-hidden="true"></span>
          <span aria-hidden="true">
            {checked ? this.checkedCaption : this.unCheckedCaption}
          </span>
        </label>
      </Host>
    );
  }
}
