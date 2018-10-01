import { IRenderer } from "../../../common/interfaces";
import { RadioOption } from "../../../radio-option/radio-option";

export class RadioOptionRender implements IRenderer {
  constructor(public component: RadioOption) {}

  private checkedTmr: any;
  private didLoad: boolean;
  protected nativeInput: HTMLInputElement;
  private inputId: string;

  getNativeInputId() {
    return this.nativeInput.id;
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
    this.nativeInput.focus();
    this.component.onChange.emit(event);
  }

  checkedChanged(isChecked: boolean) {
    const inputEl = this.nativeInput;
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
    this.nativeInput.disabled = isDisabled;
  }

  componentDidLoad() {
    this.didLoad = true;
  }

  componentDidUnload() {
    this.nativeInput = null;
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
      disabled: this.component.disabled,
      id: this.inputId,
      name: this.component.name,
      onChange: this.handleChange.bind(this),
      onClick: this.handleClick.bind(this),
      ref: input => (this.nativeInput = input as any),
      value: this.component.value
    };

    const forAttris = {
      for: attris.id
    };

    return (
      <div class={this.getInnerControlContainerClass()}>
        <input {...attris} type="radio" checked={this.component.checked} />
        <label class="custom-control-label" {...forAttris}>
          {this.component.caption}
        </label>
      </div>
    );
  }
}

let autoRadioId = 0;
