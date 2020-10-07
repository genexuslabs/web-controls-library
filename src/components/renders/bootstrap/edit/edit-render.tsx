import { h } from "@stencil/core";
import { Renderer } from "../../../common/interfaces";
import { Edit } from "../../../edit/edit";

let autoEditId = 0;

const fontCategoryTagMap = {
  body: "p",
  caption1: "span",
  caption2: "span",
  footnote: "footer",
  headline: "h1",
  subheadline: "h2"
};

export class EditRender implements Renderer {
  constructor(
    private component: Edit,
    handlers: {
      handleChange;
      handleTriggerClick;
      handleValueChanging;
    }
  ) {
    this.handleChange = handlers.handleChange;
    this.handleTriggerClick = handlers.handleTriggerClick;
    this.handleValueChanging = handlers.handleValueChanging;
  }

  private inputId: string;
  private handleChange: (event: UIEvent) => void;
  private handleTriggerClick: (event: UIEvent) => void;
  private handleValueChanging: (event: UIEvent) => void;

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

  stopPropagation(event: UIEvent) {
    event.stopPropagation();
  }

  setReadonlyContent(component, initialContent) {
    let content = initialContent;
    if (
      content &&
      (component.type === "datetime-local" || component.type === "date")
    ) {
      const dateTime = new Date(component.value);
      if (component.type === "date") {
        dateTime.setDate(dateTime.getDate() + 1);
      }
      const dayMonthYear = new Intl.DateTimeFormat("default", {
        year: "numeric",
        month: "numeric",
        day: "numeric"
      }).format(dateTime);
      if (component.type === "date") {
        content = `${dayMonthYear}`;
      } else {
        const hourMins = new Intl.DateTimeFormat("default", {
          hour: "numeric",
          minute: "numeric"
        }).format(dateTime);
        content = `${dayMonthYear} ${hourMins}`;
      }
    }
    return content;
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

  render(slots) {
    const edit = this.component;

    const valueChangingHandler = this.handleValueChanging;
    if (!this.inputId) {
      this.inputId = edit.element.id
        ? `${edit.element.id}__edit`
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
      onChange: this.handleChange,
      onInput: valueChangingHandler,
      onClick: edit.disabled ? null : this.stopPropagation,
      placeholder: edit.placeholder
    };

    let editableElement;
    if (edit.multiline) {
      editableElement = <textarea {...attris}>{edit.value}</textarea>;
    } else {
      const input = <input {...attris} type={edit.type} value={edit.value} />;

      if (edit.showTrigger) {
        const existSlotContent = edit.element.querySelector(
          "[slot='trigger-content']"
        );
        editableElement = (
          <div class="input-group" hidden={edit.readonly}>
            {input}
            <div class="input-group-append">
              <button
                class={this.getTriggerCssClasses()}
                onClick={this.handleTriggerClick}
                type="button"
                disabled={edit.disabled}
                aria-label={edit.triggerText}
              >
                {existSlotContent !== null
                  ? slots.triggerContent
                  : edit.triggerText}
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
        data-readonly=""
        class={{
          "gx-line-clamp": this.shouldClampLines()
        }}
        style={
          this.shouldClampLines() && {
            "--max-lines": edit.maxLines.toString(),
            "--max-height": `${edit.maxHeight}px`
          }
        }
      >
        {edit.lineClamp && (
          <div class="line-measuring" aria-hidden>
            {"A"}
          </div>
        )}
        {this.setReadonlyContent(edit, edit.value)}
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

  private shouldClampLines() {
    return this.component.lineClamp && this.component.maxLines > 0;
  }
}
