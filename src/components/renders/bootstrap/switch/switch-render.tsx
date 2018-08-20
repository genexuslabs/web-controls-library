import { EventEmitter } from "@stencil/core";
type Constructor<T> = new (...args: any[]) => T;
export function SwitchRender<T extends Constructor<{}>>(Base: T) {
  return class extends Base {
    caption: string;
    checked: boolean;
    disabled = false;
    element: HTMLElement;
    id: string;
    private inputId: string;

    onChange: EventEmitter;
    private getValueFromEvent(event: UIEvent): boolean {
      return event.target && (event.target as HTMLInputElement).checked;
    }
    handleChange(event: UIEvent) {
      this.checked = this.getValueFromEvent(event);
      this.onChange.emit(event);
    }
    render() {
      if (!this.inputId) {
        this.inputId = this.id
          ? `${this.id}_checkbox`
          : `gx-checkbox-auto-id-${autoCheckBoxId++}`;
      }
      const inputAttrs = {
        "aria-checked": this.checked.toString(),
        "aria-disabled": this.disabled ? "true" : undefined,
        checked: this.checked,
        class: "switch",
        disabled: this.disabled,
        id: this.inputId,
        onChange: this.handleChange.bind(this),
        type: "checkbox"
      };
      return (
        <span class="switch switch-sm">
          <input {...inputAttrs} />
          <label htmlFor={this.inputId}>{this.caption}</label>
        </span>
      );
    }
  };
}

let autoCheckBoxId = 0;
