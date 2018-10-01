import { IRenderer } from "../../../common/interfaces";
import { Switch } from "../../../switch/switch";

export class SwitchRender implements IRenderer {
  constructor(public component: Switch) {}

  protected nativeInput: HTMLInputElement;
  private inputId: string;

  getNativeInputId() {
    return this.nativeInput.id;
  }

  private getValueFromEvent(event: UIEvent): boolean {
    return event.target && (event.target as HTMLInputElement).checked;
  }

  handleChange(event: UIEvent) {
    this.component.checked = this.getValueFromEvent(event);
    this.component.onChange.emit(event);
  }

  /**
   * Update the native input element when the value changes
   */
  checkedChanged() {
    const inputEl = this.nativeInput;
    if (inputEl && inputEl.checked !== this.component.checked) {
      inputEl.checked = this.component.checked;
    }
  }

  componentDidUnload() {
    this.nativeInput = null;
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
      disabled: this.component.disabled,
      id: this.inputId,
      onChange: this.handleChange.bind(this),
      ref: input => (this.nativeInput = input as any),
      type: "checkbox"
    };

    return (
      <span class="switch switch-sm">
        <input {...inputAttrs} />
        <label htmlFor={this.inputId}>{this.component.caption}</label>
      </span>
    );
  }
}

let autoCheckBoxId = 0;
