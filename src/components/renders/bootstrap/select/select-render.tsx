import { EventEmitter } from "@stencil/core";

type Constructor<T> = new (...args: any[]) => T;
export function SelectRender<T extends Constructor<{}>>(Base: T) {
  return class extends Base {
    protected options: any[] = [];
    protected element: HTMLElement;
    cssClass: string;
    disabled = false;
    id: string;
    invisibleMode: string;
    readonly: boolean;
    value: string;

    protected nativeSelect: HTMLSelectElement;
    private selectId: string;

    onChange: EventEmitter;

    getNativeInputId() {
      return this.nativeSelect.id;
    }

    private getCssClasses() {
      const classList = [];

      if (this.readonly) {
        classList.push("form-control-plaintext");
      } else {
        classList.push("custom-select");
      }

      if (this.cssClass) {
        classList.push(this.cssClass);
      }

      return classList.join(" ");
    }

    private getReadonlyTextContent() {
      const matchingOpts = this.options.filter(o => o.value === this.value);
      if (matchingOpts.length > 0) {
        return matchingOpts[0].innerText;
      }
      return "";
    }

    private getValueFromEvent(event: UIEvent): string {
      return event.target && (event.target as HTMLSelectElement).value;
    }

    private handleChange(event: UIEvent) {
      this.value = this.getValueFromEvent(event);
      this.onChange.emit(event);
    }

    /**
     * Update the native select element when the value changes
     */
    protected valueChanged() {
      const selectEl = this.nativeSelect;
      if (selectEl && selectEl.value !== this.value) {
        selectEl.value = this.value;
      }
    }

    componentDidUnload() {
      this.nativeSelect = null;
    }

    render() {
      if (!this.selectId) {
        this.selectId = this.id
          ? `${this.id}__select`
          : `gx-select-auto-id-${autoSelectId++}`;
      }

      if (this.readonly) {
        return (
          <span class={this.getCssClasses()}>
            {this.getReadonlyTextContent()}
          </span>
        );
      } else {
        const attris = {
          "aria-disabled": this.disabled ? "true" : undefined,
          class: this.getCssClasses(),
          disabled: this.disabled,
          id: this.selectId,
          onChange: this.handleChange.bind(this),
          ref: select => (this.nativeSelect = select as any)
        };

        return (
          <select {...attris} value={this.value}>
            {this.options.map(({ disabled, innerText, selected, value }) => (
              <option disabled={disabled} selected={selected} value={value}>
                {innerText}
              </option>
            ))}
          </select>
        );
      }
    }
  };
}

let autoSelectId = 0;
