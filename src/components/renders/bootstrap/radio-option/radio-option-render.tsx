import { h } from "@stencil/core";
import { Renderer } from "../../../common/interfaces";
import { RadioOption } from "../../../radio-option/radio-option";

let autoRadioId = 0;

export class RadioOptionRender implements Renderer {
  constructor(private component: RadioOption) {}

  private checkedTmr: any;
  private didLoad: boolean;
  private inputId: string;

  getNativeInputId() {
    return this.getNativeInput().id;
  }

  private getNativeInput(): HTMLInputElement {
    return this.component.element.querySelector("[data-native-element]");
  }

  private getCssClasses() {
    const classList = [];

    classList.push("control-input");

    if (this.component.cssClass) {
      classList.push(this.component.cssClass);
    }

    if (!this.component.caption) {
      classList.push("position-static");
    }

    return classList.join(" ");
  }

  private getInnerControlContainerClass() {
    const classList = ["container"];

    if (this.component.disabled) {
      classList.push("disabled");
    }

    return classList.join(" ");
  }

  handleClick() {
    this.checkedChanged(true);
  }

  handleChange(event: UIEvent) {
    this.component.checked = true;
    const nativeInput = this.getNativeInput();
    nativeInput.focus();
    this.component.change.emit(event);
  }

  checkedChanged(isChecked: boolean) {
    const nativeInput = this.getNativeInput();
    const inputEl = nativeInput;
    if (inputEl && inputEl.checked !== isChecked) {
      inputEl.checked = isChecked;
    }

    clearTimeout(this.checkedTmr);
    this.checkedTmr = setTimeout(() => {
      // only emit onSelect when checked is true
      if (this.didLoad && isChecked) {
        this.component.gxSelect.emit({
          checked: isChecked,
          value: this.component.value
        });
      }
    });
  }

  disabledChanged(isDisabled: boolean) {
    const nativeInput = this.getNativeInput();
    nativeInput.disabled = isDisabled;
  }

  componentDidLoad() {
    this.didLoad = true;
  }

  render() {
    const radioOption = this.component;
    if (!this.inputId) {
      this.inputId = radioOption.element.id
        ? `${radioOption.element.id}__radio-option`
        : `gx-radio-auto-id-${autoRadioId++}`;
    }

    const attris = {
      "aria-disabled": radioOption.disabled ? "true" : undefined,
      class: this.getCssClasses(),
      "data-native-element": "",
      disabled: radioOption.disabled,
      id: this.inputId,
      name: radioOption.name,
      onChange: this.handleChange.bind(this),
      onClick: this.handleClick.bind(this),
      value: radioOption.value
    };

    const forAttris = {
      for: attris.id
    };

    return [
      <gx-bootstrap />,
      <div class={this.getInnerControlContainerClass()}>
        <div class="option-container">
          <input {...attris} type="radio" checked={radioOption.checked} />

          <label class="custom-option"></label>

          <svg viewBox="-8 -8 16 16">
            <circle r="3"></circle>
          </svg>
        </div>

        <label class="custom-label" {...forAttris}>
          {radioOption.caption}
        </label>
      </div>
    ];
  }
}
