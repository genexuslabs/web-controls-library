import { h } from "@stencil/core";
import { Renderer } from "../../../common/interfaces";
import { Switch } from "../../../switch/switch";

let autoSwitchId = 0;

export class SwitchRender implements Renderer {
  constructor(private component: Switch) {
    const switchCmp = this.component;

    if (!this.inputId) {
      this.inputId = switchCmp.element.id
        ? `${switchCmp.element.id}_switch`
        : `gx-switch-auto-id-${autoSwitchId++}`;
    }
  }

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
    const switchCmp = this.component;

    const inputAttrs = {
      "aria-checked": switchCmp.checked ? "true" : "false",
      "aria-disabled": switchCmp.disabled ? "true" : "false",
      checked: switchCmp.checked,
      class: "switch",
      "data-native-element": "",
      disabled: switchCmp.disabled,
      id: this.inputId,
      onChange: this.handleChange.bind(this),
      type: "checkbox"
    };

    return [
      <gx-bootstrap />,
      <span class="switch switch-sm">
        <input {...inputAttrs} />
        <label htmlFor={this.inputId}>{switchCmp.caption}</label>
      </span>
    ];
  }
}
