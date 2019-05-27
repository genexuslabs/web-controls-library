import { IRenderer } from "../../../common/interfaces";
import { RadioOption } from "../../../radio-option/radio-option";

export class RadioOptionRender implements IRenderer {
  constructor(public component: RadioOption) {}

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

    classList.push("custom-control-input");

    if (this.component.cssClass) {
      classList.push(this.component.cssClass);
    }

    if (!this.component.caption) {
      classList.push("position-static");
    }

    return classList.join(" ");
  }

  private getInnerControlContainerClass() {
    const classList = ["custom-control", "custom-radio"];

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
    if (!this.inputId) {
      this.inputId = this.component.id
        ? `${this.component.id}__radio-option`
        : `gx-radio-auto-id-${autoRadioId++}`;
    }

    const attris = {
      "aria-disabled": this.component.disabled ? "true" : undefined,
      class: this.getCssClasses(),
      "data-native-element": "",
      disabled: this.component.disabled,
      id: this.inputId,
      name: this.component.name,
      onChange: this.handleChange.bind(this),
      onClick: this.handleClick.bind(this),
      value: this.component.value
    };

    const forAttris = {
      for: attris.id
    };

    return [
      <gx-bootstrap />,
      <div class={this.getInnerControlContainerClass()}>
        <input {...attris} type="radio" checked={this.component.checked} />
        <label class="custom-control-label" {...forAttris}>
          {this.component.caption}
        </label>
      </div>
    ];
  }
}

let autoRadioId = 0;
