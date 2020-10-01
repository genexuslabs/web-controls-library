import { h } from "@stencil/core";
import { Renderer } from "../../../common/interfaces";
import { Select } from "../../../select/select";

let autoSelectId = 0;

export class SelectRender implements Renderer {
  constructor(private component: Select) {
    if (!this.selectId && !this.component.readonly) {
      this.selectId = this.component.element.id
        ? `${this.component.element.id}__select`
        : `gx-select-auto-id-${autoSelectId++}`;
    }
  }

  protected options: any[] = [];
  protected element: HTMLElement;
  private selectId: string;

  updateOptions(options) {
    this.options = options;
  }

  getNativeInputId() {
    return !this.component.readonly ? this.selectId : null;
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

  render() {
    if (this.component.readonly) {
      return (
        <span class={this.getCssClasses()}>
          {this.getReadonlyTextContent()}
        </span>
      );
    } else {
      let datalistId: string;
      const attris = {
        "aria-disabled": this.component.disabled ? "true" : undefined,
        class: this.getCssClasses(),
        disabled: this.component.disabled,
        id: this.selectId,
        onChange: this.handleChange.bind(this),
        ref: (select: HTMLSelectElement) => {
          select.value = this.component.value;
        }
      };
      if (this.component.suggest) {
        datalistId = `${this.selectId}__datalist`;
      }

      return this.component.suggest
        ? [
            <gx-bootstrap />,
            <input
              list={datalistId}
              disabled={this.component.disabled}
              placeholder={this.component.placeholder}
              value={this.component.value}
            ></input>,

            <datalist id={datalistId}>
              {this.options.map(({ innerText, selected, value, disabled }) => (
                <option disabled={disabled} selected={selected} value={value}>
                  {innerText}
                </option>
              ))}
            </datalist>
          ]
        : [
            <gx-bootstrap />,
            <select {...attris}>
              {this.options.map(({ innerText, selected, value, disabled }) => (
                <option disabled={disabled} selected={selected} value={value}>
                  {innerText}
                </option>
              ))}
            </select>
          ];
    }
  }
}
