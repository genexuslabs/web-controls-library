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

  getValueFromEvent(event: UIEvent): string {
    return event.target && (event.target as HTMLInputElement).value;
  }

  stopPropagation(event: UIEvent) {
    event.stopPropagation();
  }

  getReadonlyContent(component, initialContent) {
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

    const dateTypes = ["datetime-local", "date", "time"];

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
      "data-native-element": "",
      disabled: edit.disabled,
      id: this.inputId,

      // We limit the year to 4 digits
      max:
        edit.type === "datetime-local"
          ? "9999-12-31T23:59:59"
          : edit.type === "date"
          ? "9999-12-31"
          : undefined,

      // We extend the minimum value of the date
      min:
        edit.type === "datetime-local"
          ? "0001-01-01T00:00:00"
          : edit.type === "date"
          ? "0001-01-01"
          : undefined,

      onChange: this.handleChange,
      onClick: edit.disabled ? null : this.stopPropagation,
      onInput: valueChangingHandler,
      placeholder: edit.placeholder,
      step: dateTypes.includes(edit.type) ? "1" : undefined
    };

    // This will be displayed at the end
    let editableElement;

    // If the format is the default format
    if (edit.format === "Text") {
      // If it has multiline, it sets a textarea
      if (edit.multiline) {
        editableElement = (
          <div class="gx-edit-container" hidden={edit.readonly}>
            <textarea
              class={{
                [slots.cssClass]: !slots.shouldStyleHostElement,
                [slots.editVars]: !slots.shouldStyleHostElement,
                [slots.editHighlighted]: !slots.shouldStyleHostElement
              }}
              {...attris}
              data-part="field"
            >
              {edit.value}
            </textarea>
          </div>
        );

        // Otherwise, it sets an input
      } else {
        const input = (
          <input
            {...attris}
            type={edit.type}
            value={edit.value}
            data-part="field"
          />
        );
        const existSlotContent = edit.element.querySelector(
          "[slot='trigger-content']"
        );

        // If showTrigger == true, it also sets a trigger button
        editableElement = (
          <div
            class={{
              "gx-edit-container": true,

              /*  Used when the gx-edit has
                    type="datetime-local" | "date" | "time"
                  and its value is null
              */
              "null-date":
                dateTypes.includes(edit.type) &&
                (edit.value == undefined || edit.value == "")
            }}
            hidden={edit.readonly}
          >
            {input}

            {// Implements a non-native placeholder for date types
            dateTypes.includes(edit.type) &&
              (edit.value == undefined || edit.value == "") && (
                <div class="date-placeholder-container">
                  <span>{edit.placeholder}</span>
                </div>
              )}

            {edit.showTrigger && (
              <div class="trigger-button-container">
                <button
                  class="trigger-button"
                  onClick={this.handleTriggerClick}
                  type="button"
                  disabled={edit.disabled}
                >
                  {existSlotContent !== null && slots.triggerContent}
                </button>
              </div>
            )}
          </div>
        );
      }
      // If format = HTML
    } else {
      editableElement = (
        <div class="gx-edit-container">
          <div class="html-container">
            <div data-native-element innerHTML={edit.inner}></div>
          </div>
        </div>
      );
    }

    // It can be h1, h2, p, footer and span value
    const ReadonlyTag = this.getReadonlyTagByFontCategory() as any;

    return [
      edit.readonly && edit.format == "Text" && (
        <div data-readonly="">
          <div class="readonly-content-container">
            <ReadonlyTag
              key="readonly"
              class={{
                "readonly-content": true,
                "gx-line-clamp": this.component.lineClamp,
                relative: !this.component.lineClamp
              }}
              style={
                this.component.lineClamp && {
                  "--max-lines": edit.maxLines.toString()
                }
              }
            >
              {edit.lineClamp && (
                <div class="line-measuring" aria-hidden>
                  {"A"}
                </div>
              )}
              {this.getReadonlyContent(edit, edit.value)}
            </ReadonlyTag>
          </div>
        </div>
      ),
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
}
