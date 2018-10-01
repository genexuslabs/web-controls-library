import { IRenderer } from "../../../common/interfaces";
import { Edit } from "../../../edit/edit";

export class EditRender implements IRenderer {
  constructor(public component: Edit) {}
  protected nativeInput: HTMLInputElement;
  private inputId: string;

  getNativeInputId() {
    return this.nativeInput.id;
  }

  private getCssClasses() {
    const edit = this.component;

    const classList = [];

    if (edit.readonly) {
      classList.push("form-control-plaintext");
    } else {
      if (edit.type === "file") {
        classList.push("form-control-file");
      } else {
        classList.push("form-control");
      }
    }

    return classList.join(" ");
  }

  private getTriggerCssClasses() {
    const classList = [];
    classList.push("btn");
    classList.push("btn-outline-secondary");
    return classList.join(" ");
  }

  getValueFromEvent(event: UIEvent): string {
    return event.target && (event.target as HTMLInputElement).value;
  }

  /**
   * Update the native input element when the value changes
   */
  valueChanged() {
    const inputEl = this.nativeInput;
    if (inputEl && inputEl.value !== this.component.value) {
      inputEl.value = this.component.value;
    }
  }

  componentDidUnload() {
    this.nativeInput = null;
  }

  render() {
    const edit = this.component;

    const valueChangingHandler = edit.handleValueChanging.bind(edit);
    if (!this.inputId) {
      this.inputId = edit.id
        ? `${edit.id}__edit`
        : `gx-edit-auto-id-${autoEditId++}`;
    }

    const attris = {
      "aria-disabled": edit.disabled ? "true" : undefined,
      autocapitalize: edit.autocapitalize,
      autocomplete: edit.autocomplete,
      autocorrect: edit.autocorrect,
      class: this.getCssClasses(),
      disabled: edit.disabled,
      id: this.inputId,
      onChange: edit.handleChange.bind(edit),
      onInput: valueChangingHandler,
      placeholder: edit.placeholder,
      readonly: edit.readonly,
      ref: input => (this.nativeInput = input as any)
    };

    if (edit.multiline) {
      return <textarea {...attris}>{edit.value}</textarea>;
    } else {
      const input = <input {...attris} type={edit.type} value={edit.value} />;

      if (edit.showTrigger && !edit.readonly) {
        return (
          <div class="input-group">
            {input}
            <div class="input-group-append">
              <button
                class={this.getTriggerCssClasses()}
                onClick={edit.handleTriggerClick.bind(edit)}
                type="button"
                disabled={edit.disabled}
                aria-label={edit.triggerText}
              >
                <slot name="trigger-content" />
              </button>
            </div>
          </div>
        );
      } else {
        return input;
      }
    }
  }
}

let autoEditId = 0;
