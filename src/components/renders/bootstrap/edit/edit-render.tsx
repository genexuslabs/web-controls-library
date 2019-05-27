import { IRenderer } from "../../../common/interfaces";
import { Edit } from "../../../edit/edit";

export class EditRender implements IRenderer {
  constructor(public component: Edit) {}
  private inputId: string;

  getNativeInputId() {
    return this.getNativeInput().id;
  }

  private getNativeInput(): HTMLInputElement | HTMLTextAreaElement {
    return this.component.element.querySelector("[data-native-element]");
  }

  private getCssClasses() {
    const edit = this.component;

    const classList = [];

    if (edit.type === "file") {
      classList.push("form-control-file");
    } else {
      classList.push("form-control");
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
    const inputEl = this.getNativeInput();
    if (inputEl && inputEl.value !== this.component.value) {
      inputEl.value = this.component.value;
    }
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
      "data-native-element": "",
      disabled: edit.disabled,
      hidden: edit.readonly,
      id: this.inputId,
      onChange: edit.handleChange.bind(edit),
      onInput: valueChangingHandler,
      placeholder: edit.placeholder
    };

    let editableElement;
    if (edit.multiline) {
      editableElement = <textarea {...attris}>{edit.value}</textarea>;
    } else {
      const input = <input {...attris} type={edit.type} value={edit.value} />;

      if (edit.showTrigger) {
        editableElement = (
          <div class="input-group" hidden={edit.readonly}>
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
        editableElement = input;
      }
    }

    const ReadonlyTag = this.getReadonlyTagByFontCategory() as any;

    return [
      <gx-bootstrap />,
      <ReadonlyTag
        key="readonly"
        hidden={!edit.readonly}
        class={this.getReadonlyClass()}
        data-readonly=""
      >
        {edit.value}
      </ReadonlyTag>,
      editableElement
    ];
  }

  private getReadonlyTagByFontCategory() {
    const tag = fontCategoryTagMap[this.component.fontCategory];
    if (!tag) {
      return "span";
    }
    return tag;
  }

  private getReadonlyClass() {
    if (
      this.component.fontCategory === "body" ||
      !this.component.fontCategory
    ) {
      return {
        "form-control-plaintext": true
      };
    }
    return null;
  }
}

let autoEditId = 0;

const fontCategoryTagMap = {
  body: "p",
  caption1: "span",
  caption2: "span",
  footnote: "footer",
  headline: "h1",
  subheadline: "h2"
};
