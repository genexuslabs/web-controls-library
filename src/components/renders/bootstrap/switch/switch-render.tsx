import { h } from "@stencil/core";
import { IRenderer } from "../../../common/interfaces";
import { Switch } from "../../../switch/switch";

export class SwitchRender implements IRenderer {
  constructor(public component: Switch) {}

  private inputId: string;

  getNativeInputId() {
    return this.getNativeInput().id;
  }

  private getNativeInput(): HTMLInputElement {
    return this.component.element.querySelector("[data-native-element]");
  }

  private getValueFromEvent(event: UIEvent): boolean {
    return event.target && (event.target as HTMLInputElement).checked;
  }

  handleChange(event: UIEvent) {
    this.component.checked = this.getValueFromEvent(event);
    this.component.input.emit(event);
  }

  /**
   * Update the native input element when the value changes
   */
  checkedChanged() {
    const inputEl = this.getNativeInput();
    if (inputEl && inputEl.checked !== this.component.checked) {
      inputEl.checked = this.component.checked;
    }
  }

  render() {
    if (!this.inputId) {
      this.inputId = this.component.id
        ? `${this.component.id}_checkbox`
        : `gx-checkbox-auto-id-${autoCheckBoxId++}`;
    }

    const inputAttrs = {
      "aria-checked": this.component.checked ? "true" : "false",
      "aria-disabled": this.component.disabled ? "true" : "false",
      checked: this.component.checked,
      class: "switch",
      "data-native-element": "",
      disabled: this.component.disabled,
      id: this.inputId,
      onChange: this.handleChange.bind(this),
      type: "checkbox"
    };

    return [
      <gx-bootstrap />,
      <span class="switch switch-sm">
        <input {...inputAttrs} />
        <label htmlFor={this.inputId}>{this.component.caption}</label>
      </span>
    ];
  }
}

let autoCheckBoxId = 0;
