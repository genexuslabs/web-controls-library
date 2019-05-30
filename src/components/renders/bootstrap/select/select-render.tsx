import { h } from "@stencil/core";
import { IRenderer } from "../../../common/interfaces";
import { Select } from "../../../select/select";

export class SelectRender implements IRenderer {
  constructor(public component: Select) {}

  protected options: any[] = [];
  protected element: HTMLElement;
  protected nativeSelect: HTMLSelectElement;
  private selectId: string;

  updateOptions(options) {
    this.options = options;
  }

  getNativeInputId() {
    return this.nativeSelect.id;
  }

  private getCssClasses() {
    const classList = [];

    if (this.component.readonly) {
      classList.push("form-control-plaintext");
    } else {
      classList.push("custom-select");
    }

    if (this.component.cssClass) {
      classList.push(this.component.cssClass);
    }

    return classList.join(" ");
  }

  private getReadonlyTextContent() {
    const matchingOpts = this.options.filter(
      o => o.value === this.component.value
    );
    if (matchingOpts.length > 0) {
      return matchingOpts[0].innerText;
    }
    return "";
  }

  private getValueFromEvent(event: UIEvent): string {
    return event.target && (event.target as HTMLSelectElement).value;
  }

  private handleChange(event: UIEvent) {
    this.component.value = this.getValueFromEvent(event);
    this.component.input.emit(event);
  }

  componentDidUnload() {
    this.nativeSelect = null;
  }

  render() {
    if (!this.selectId) {
      this.selectId = this.component.id
        ? `${this.component.id}__select`
        : `gx-select-auto-id-${autoSelectId++}`;
    }

    if (this.component.readonly) {
      return (
        <span class={this.getCssClasses()}>
          {this.getReadonlyTextContent()}
        </span>
      );
    } else {
      const attris = {
        "aria-disabled": this.component.disabled ? "true" : undefined,
        class: this.getCssClasses(),
        disabled: this.component.disabled,
        id: this.selectId,
        onChange: this.handleChange.bind(this),
        ref: (select: HTMLSelectElement) => {
          select.value = this.component.value;
          this.nativeSelect = select;
        }
      };

      return [
        <gx-bootstrap />,
        <select {...attris}>
          {this.options.map(({ disabled, innerText, selected, value }) => (
            <option disabled={disabled} selected={selected} value={value}>
              {innerText}
            </option>
          ))}
        </select>
      ];
    }
  }
}

let autoSelectId = 0;
