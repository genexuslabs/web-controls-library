import {
  Component,
  Element,
  Event,
  EventEmitter,
  Host,
  Method,
  Prop,
  State,
  Watch,
  h
} from "@stencil/core";
import {
  HighlightableComponent,
  makeHighlightable
} from "../common/highlightable";

import {
  CustomizableComponent,
  DisableableComponent
} from "../common/interfaces";
import { makeLinesClampable } from "../common/line-clamp";

import { EditType, FontCategory } from "../../common/types";
import {
  DISABLED_CLASS,
  HEIGHT_MEASURING,
  LINE_CLAMP,
  LINE_MEASURING
} from "../../common/reserved-names";

// Class transforms
import { getClasses } from "../common/css-transforms/css-transforms";

const AUTOFILL_START_ANIMATION_NAME = "AutoFillStart";
let autoEditId = 0;

const DATE_TYPES = ["datetime-local", "date", "time"];

const MAX_DATE_VALUE: { [key: string]: string } = {
  date: "9999-12-31",
  "datetime-local": "9999-12-31T23:59:59"
};

const MIN_DATE_VALUE: { [key: string]: string } = {
  date: "0001-01-01",
  "datetime-local": "0001-01-01T00:00:00"
};

/**
 * @part gx-edit__content - The main content displayed in the control. This part only applies when `format="Text"`.
 * @part gx-edit__date-placeholder - A placeholder displayed when the control is editable (`readonly="false"`), has no value set, and its type is `"datetime-local" | "date" | "time"`.
 * @part gx-edit__html-container - The container of the main content displayed in the control. This part only applies when `format="HTML"`.
 * @part gx-edit__html-content - The main content displayed in the control. This part only applies when `format="HTML"`.
 * @part gx-edit__trigger-button - The trigger button displayed on the right side of the control when `show-trigger="true"`.
 *
 * @slot - The slot for the html content when `format="HTML"`.
 * @slot trigger-content - The slot used for the content of the trigger button.
 */
@Component({
  shadow: true,
  styleUrl: "edit.scss",
  tag: "gx-edit"
})
export class Edit
  implements
    CustomizableComponent,
    DisableableComponent,
    HighlightableComponent
{
  constructor() {
    makeLinesClampable(
      this,
      "." + HEIGHT_MEASURING,
      "." + LINE_MEASURING,
      true
    );
  }

  private disabledClass: "gx-disabled-custom" | "gx-disabled" =
    "gx-disabled-custom";

  private readonlyTag = "p";

  // Variables calculated in componentWillLoad
  private isDateType = false;
  private isReadonly = false;
  private shouldAddCursorText = false;
  private shouldAddHighlightedClasses = false;
  private shouldAddResize = false;

  /**
   * ID for the inner input
   */
  private inputId: string;

  // Refs
  private inputRef: HTMLElement = null;

  /**
   * Determine the amount of lines to be displayed in the edit when
   * `readonly="true"` and `line-clamp="true"`
   */
  @State() maxLines = 0;

  @Element() element: HTMLGxEditElement;

  /**
   * Determine if the gx-edit's value was auto-completed
   */
  @State() autoFilled = false;

  /**
   * Allows to specify the role of the element when inside a `gx-form-field` element
   */
  @Prop({ reflect: true }) readonly area: "field";

  /**
   * Specifies the auto-capitalization behavior. Same as [autocapitalize](https://developer.apple.com/library/content/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/Attributes.html#//apple_ref/doc/uid/TP40008058-autocapitalize)
   * attribute for `input` elements. Only supported by Safari and Chrome.
   */
  @Prop() readonly autocapitalize: string;

  /**
   * This attribute indicates whether the value of the control can be
   * automatically completed by the browser. Same as [autocomplete](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-autocomplete)
   * attribute for `input` elements.
   */
  @Prop() readonly autocomplete: "on" | "off";

  /**
   * Used to control whether autocorrection should be enabled when the user
   * is entering/editing the text value. Sames as [autocorrect](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-autocorrect)
   * attribute for `input` elements.
   */
  @Prop() readonly autocorrect: string;

  /**
   * A CSS class to set as the `gx-edit` element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * This attribute lets you specify if the element is disabled.
   * If disabled, it will not fire any user interaction related event
   * (for example, click event).
   */
  @Prop() readonly disabled = false;

  /**
   * Used to define the semantic of the element when `readonly="true"`.
   */
  @Prop() readonly fontCategory: FontCategory = "p";

  /**
   * The text to set as the label of the gx-edit control.
   */
  @Prop() readonly labelCaption: string;

  /**
   * True to cut text when it overflows, showing an ellipsis (only applies when readonly)
   */
  @Prop() readonly lineClamp = false;

  /**
   * Controls if the element accepts multiline text.
   */
  @Prop() readonly multiline: boolean;

  /**
   * A hint to the user of what can be entered in the control. Same as [placeholder](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-placeholder)
   * attribute for `input` elements.
   */
  @Prop() readonly placeholder: string;

  /**
   * This attribute indicates that the user cannot modify the value of the control.
   * Same as [readonly](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-readonly)
   * attribute for `input` elements.
   */
  @Prop() readonly readonly: boolean;

  /**
   * If true, a trigger button is shown next to the edit field. The button can
   * be customized adding a child element with `slot="trigger-content"`
   * attribute to specify the content inside the trigger button.
   */
  @Prop() readonly showTrigger: boolean;

  /**
   * The type of control to render. A subset of the types supported by the `input` element is supported:
   *
   * * `"date"`
   * * `"datetime-local"`
   * * `"email"`
   * * `"file"`
   * * `"number"`
   * * `"password"`
   * * `"search"`
   * * `"tel"`
   * * `"text"`
   * * `"url"`
   */
  @Prop() readonly type: EditType = "text";

  /**
   * The initial value of the control.
   */
  @Prop({ mutable: true }) value: string;

  /**
   * True to highlight control when an action is fired.
   */
  @Prop() readonly highlightable: boolean = false;

  /**
   * It specifies the format that will have the edit control.
   *
   * If `format` = `HTML`, the edit control works as an HTML div and the
   * innerHTML will be the same as the `inner` property specifies. Also, it
   * does not allow any input/editable UI since it works as an HTML div.
   *
   * If `format` = `Text`, the edit control works as a normal input control and
   * it is affected by most of the defined properties.
   */
  @Prop() readonly format: "Text" | "HTML" = "Text";

  /**
   * The `change` event is emitted when a change to the element's value is
   * committed by the user. Unlike the `input` event, the `change` event is not
   * necessarily fired for each change to an element's value but when the
   * control loses focus.
   */
  @Event() change: EventEmitter;

  /**
   * The `input` event is fired synchronously when the value is changed.
   */
  @Event() input: EventEmitter;

  /**
   * The `gxTriggerClick` event is fired when the trigger button is clicked.
   */
  @Event() gxTriggerClick: EventEmitter;

  /**
   * Returns the id of the inner `input` element (if set).
   */
  @Method()
  async getNativeInputId() {
    return this.inputId;
  }

  @Watch("fontCategory")
  protected handleFontCategoryChange(newValue: FontCategory) {
    this.readonlyTag = this.getReadonlyTagByFontCategory(newValue);
  }

  // @Watch("value")
  // protected valueChanged() {
  //   this.renderer.valueChanged();
  // }

  private getValueFromEvent = (event: UIEvent): string =>
    event.target && (event.target as HTMLInputElement).value;

  private handleAutoFill = (event: AnimationEvent) => {
    this.autoFilled = event.animationName === AUTOFILL_START_ANIMATION_NAME;
  };

  private handleChange = (event: UIEvent) => {
    this.value = this.getValueFromEvent(event);
    this.change.emit(event);
  };

  private handleValueChanging = (event: UIEvent) => {
    this.value = this.getValueFromEvent(event);
    this.input.emit(event);
  };

  /**
   * Since the inner input must to support vertical alignment, it can't have
   * height: 100%, so clicks performed in the container must focus the inner
   * input.
   */
  private focusInnerInputOnClick = (event: UIEvent) => {
    if (!this.highlightable) {
      event.stopPropagation();
    }

    this.inputRef.focus();
  };

  private handleTriggerClick = (event: UIEvent) => {
    if (!this.disabled) {
      event.stopPropagation();
    }
    this.gxTriggerClick.emit(event);
  };

  private getReadonlyTagByFontCategory = (fontCategory: FontCategory) =>
    this.format === "HTML" ? "div" : fontCategory;

  private getReadonlyContent() {
    let content = this.value;

    if (content && (this.type === "datetime-local" || this.type === "date")) {
      const dateTime = new Date(this.value);

      if (this.type === "date") {
        dateTime.setDate(dateTime.getDate() + 1);
      }
      const dayMonthYear = new Intl.DateTimeFormat("default", {
        year: "numeric",
        month: "numeric",
        day: "numeric"
      }).format(dateTime);

      content = dayMonthYear;

      if (this.type === "datetime-local") {
        const hourMins = new Intl.DateTimeFormat("default", {
          hour: "numeric",
          minute: "numeric"
        }).format(dateTime);

        content += ` ${hourMins}`;
      }
    }
    return content;
  }

  componentWillLoad() {
    this.isReadonly = this.readonly || this.format === "HTML";
    this.isDateType = DATE_TYPES.includes(this.type);

    if (this.isReadonly) {
      // When the edit is readonly, the disabled style must not have opacity
      this.disabledClass = DISABLED_CLASS;

      // In case of true, makeHighligtable() function highlights the gx-edit control
      this.shouldAddHighlightedClasses = this.highlightable;
    } else {
      this.shouldAddCursorText = !this.isDateType;
      this.shouldAddResize = this.multiline;
    }

    if (!this.inputId) {
      this.inputId = this.element.id
        ? `${this.element.id}__edit`
        : `gx-edit-auto-id-${autoEditId++}`;
    }

    // Set font category
    this.handleFontCategoryChange(this.fontCategory);
  }

  componentDidLoad() {
    if (this.shouldAddHighlightedClasses) {
      makeHighlightable(this);
    }
  }

  render() {
    // Styling for gx-edit control
    const classes = getClasses(this.cssClass);

    const shouldAddFocus = this.shouldAddHighlightedClasses && !this.disabled;

    const attrs = {
      autocapitalize: this.autocapitalize,
      autocomplete: this.autocomplete,
      autocorrect: this.autocorrect,
      "aria-label": this.labelCaption || undefined,
      disabled: this.disabled,
      id: this.inputId,

      // Limit the year to 4 digits
      max: MAX_DATE_VALUE[this.type],

      // Extend the minimum value of the date
      min: MIN_DATE_VALUE[this.type],

      onChange: this.handleChange,
      onInput: this.handleValueChanging,
      placeholder: this.placeholder,
      step: DATE_TYPES.includes(this.type) ? "1" : undefined
    };

    return (
      <Host
        class={{
          "gx-edit--auto-fill": this.autoFilled,
          "gx-edit--cursor-text": this.shouldAddCursorText && !this.disabled,
          "gx-edit--editable-date": this.isDateType && !this.isReadonly,
          "gx-edit--multiline": this.shouldAddResize,
          "gx-edit--readonly": this.isReadonly,
          "gx-edit__trigger-button-space": this.showTrigger,

          [this.disabledClass]: this.disabled,
          [this.cssClass]: !!this.cssClass,
          [classes.vars]: true
        }}
        // Mouse pointer to indicate action
        data-has-action={shouldAddFocus ? "" : undefined}
        // Alignment
        data-text-align=""
        data-valign={!this.isReadonly && !this.multiline ? "" : undefined}
        data-valign-readonly={
          this.isReadonly && this.format === "Text" ? "" : undefined
        }
        // Add focus to the control through sequential keyboard navigation and visually clicking
        tabindex={shouldAddFocus ? "0" : undefined}
        onClick={
          !this.isReadonly && !this.disabled
            ? this.focusInnerInputOnClick
            : null
        }
        onAnimationStart={this.handleAutoFill}
      >
        {this.isReadonly
          ? [
              <this.readonlyTag
                aria-disabled={this.disabled ? "true" : undefined}
                aria-label={this.labelCaption || undefined}
                class={{
                  content: this.format === "Text",
                  "html-container": this.format === "HTML",
                  "readonly-date": this.isDateType,
                  [LINE_CLAMP]: this.lineClamp
                }}
                part={
                  this.format === "Text"
                    ? "gx-edit__content"
                    : "gx-edit__html-container gx-valign"
                }
                style={
                  this.lineClamp && {
                    "--max-lines": this.maxLines.toString()
                  }
                }
              >
                {this.format === "Text" ? (
                  this.getReadonlyContent()
                ) : (
                  <div class="html-content" part="gx-edit__html-content">
                    <slot />
                  </div>
                )}
              </this.readonlyTag>,

              this.lineClamp && [
                <div class={LINE_MEASURING}>{"A"}</div>,
                <div class={HEIGHT_MEASURING}></div>
              ]
            ]
          : [
              this.multiline ? (
                [
                  <textarea
                    {...attrs}
                    class="content"
                    part="gx-edit__content"
                    value={this.value}
                    ref={el => (this.inputRef = el as HTMLElement)}
                  ></textarea>,

                  // The space at the end of the value is necessary to correctly display the enters
                  <p class="hidden-multiline">{this.value} </p>
                ]
              ) : (
                <input
                  {...attrs}
                  class={{
                    content: true,
                    "null-date": this.isDateType && !this.value
                  }}
                  part="gx-edit__content"
                  type={this.type}
                  value={this.value}
                  ref={el => (this.inputRef = el as HTMLElement)}
                />
              ),

              this.showTrigger && (
                <button
                  class={{
                    "trigger-button": true,
                    disabled: this.disabled
                  }}
                  part="gx-edit__trigger-button"
                  type="button"
                  disabled={this.disabled}
                  onClick={this.handleTriggerClick}
                >
                  <slot name="trigger-content" />
                </button>
              ),

              // Implements a non-native placeholder for date types
              this.isDateType && !this.value && (
                <p
                  aria-hidden="true"
                  class="date-placeholder"
                  part="gx-edit__date-placeholder"
                >
                  {this.placeholder}
                </p>
              )
            ]}
      </Host>
    );
  }
}
