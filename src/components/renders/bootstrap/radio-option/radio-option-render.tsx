import { EventEmitter } from "@stencil/core";

type Constructor<T> = new (...args: any[]) => T;
export function RadioOptionRender<T extends Constructor<{}>>(Base: T) {
  return class extends Base {
    private checkedTmr: any;
    private didLoad: boolean;

    element: HTMLElement;

    caption: string;
    checked: boolean;
    cssClass: string;
    disabled = false;
    id: string;
    invisibleMode: string;
    name: string;
    value: string;

    protected nativeInput: HTMLInputElement;
    private inputId: string;

    onChange: EventEmitter;
    gxSelect: EventEmitter;

    getNativeInputId() {
      return this.nativeInput.id;
    }

    private getCssClasses() {
      const classList = [];

      classList.push("custom-control-input");

      if (this.cssClass) {
        classList.push(this.cssClass);
      }

      if (!this.caption) {
        classList.push("position-static");
      }

      return classList.join(" ");
    }

    private getInnerControlContainerClass() {
      const classList = ["custom-control", "custom-radio"];

      if (this.disabled) {
        classList.push("disabled");
      }

      return classList.join(" ");
    }

    handleClick() {
      this.checkedChanged(true);
    }

    handleChange(event: UIEvent) {
      this.checked = true;
      this.nativeInput.focus();
      this.onChange.emit(event);
    }

    protected checkedChanged(isChecked: boolean) {
      const inputEl = this.nativeInput;
      if (inputEl && inputEl.checked !== isChecked) {
        inputEl.checked = isChecked;
      }

      clearTimeout(this.checkedTmr);
      this.checkedTmr = setTimeout(() => {
        // only emit onSelect when checked is true
        if (this.didLoad && isChecked) {
          this.gxSelect.emit({
            checked: isChecked,
            value: this.value
          });
        }
      });
    }

    protected disabledChanged(isDisabled: boolean) {
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
        this.inputId = this.id
          ? `${this.id}__radio-option`
          : `gx-radio-auto-id-${autoRadioId++}`;
      }

      const attris = {
        "aria-disabled": this.disabled ? "true" : undefined,
        class: this.getCssClasses(),
        disabled: this.disabled,
        id: this.inputId,
        name: this.name,
        onChange: this.handleChange.bind(this),
        onClick: this.handleClick.bind(this),
        ref: input => (this.nativeInput = input as any),
        value: this.value
      };

      const forAttris = {
        for: attris.id
      };

      return (
        <div class={this.getInnerControlContainerClass()}>
          <input {...attris} type="radio" checked={this.checked} />
          <label class="custom-control-label" {...forAttris}>
            {this.caption}
          </label>
        </div>
      );
    }
  };
}

let autoRadioId = 0;
