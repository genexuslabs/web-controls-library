import { h } from "@stencil/core";
import { Renderer } from "../../../common/interfaces";
import { CheckBox } from "../../../checkbox/checkbox";

let autoCheckBoxId = 0;

export class CheckBoxRender implements Renderer {
  constructor(private component: CheckBox, handlers: { handleChange }) {
    this.handleChange = handlers.handleChange;
  }
  private inputId: string;
  private handleChange: (event: UIEvent) => void;

  getNativeInputId() {
    return this.getNativeInput().id;
  }

  private getNativeInput(): HTMLInputElement {
    return this.component.element.querySelector("[data-native-element]");
  }

  private getCssClasses() {
    const checkbox = this.component;

    const classList = [];

    classList.push("control-input");

    if (checkbox.cssClass) {
      classList.push(checkbox.cssClass);
    }

    if (!checkbox.caption) {
      classList.push("position-static");
    }

    return classList.join(" ");
  }

  getValueFromEvent(event: UIEvent): boolean {
    return event.target && (event.target as HTMLInputElement).checked;
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
    const checkbox = this.component;

    if (!this.inputId) {
      this.inputId = checkbox.element.id
        ? `${checkbox.element.id}__checkbox`
        : `gx-checkbox-auto-id-${autoCheckBoxId++}`;
    }

    const attris = {
      "aria-disabled": checkbox.disabled ? "true" : undefined,
      class: this.getCssClasses(),
      "data-native-element": "",
      disabled: checkbox.disabled,
      id: this.inputId,
      onInput: this.handleChange
    };

    const forAttris = {
      for: attris.id
    };

    return [
      <gx-bootstrap />,
      <div class="container">
        <div class="option-container">
          <input
            {...attris}
            type="checkbox"
            checked={checkbox.checked}
            value={
              checkbox.checked ? checkbox.checkedValue : checkbox.unCheckedValue
            }
          />

          <label class="custom-option"></label>

          <svg viewBox="-4 -4 16 16">
            <path d="M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z" />
          </svg>
        </div>

        <label
          class="custom-label"
          {...forAttris}
          aria-hidden={(!checkbox.caption).toString()}
        >
          {checkbox.caption}
        </label>
      </div>
    ];
  }
}
