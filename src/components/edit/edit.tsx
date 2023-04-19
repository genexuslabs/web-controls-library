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

@Component({
  shadow: false,
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
    makeLinesClampable(this, ".gx-height-measuring", ".gx-line-measuring");
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
   * Used to define the semantic of the element when readonly=true.
   *
   * Font categories are mapped to semantic HTML elements when rendered:
   *
   * * `"headline"`: `h1`
   * * `"subheadline"`: `h2`
   * * `"body"`: `p`
   * * `"footnote"`: `footer`
   * * `"caption1"`: `span`
   * * `"caption2"`: `span`
   */
  @Prop() readonly fontCategory:
    | "headline"
    | "subheadline"
    | "body"
    | "footnote"
    | "caption1"
    | "caption2" = "body";

  /**
   * This attribute lets you specify if the element is disabled.
   * If disabled, it will not fire any user interaction related event
   * (for example, click event).
   */
  @Prop() readonly disabled = false;

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
   * Used as the innerHTML when `format` = `HTML`.
   */
  @Prop() readonly inner: string = "";

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
          "gx-edit--readonly": this.isReadonly,
          "gx-edit--single-line":
            this.type === "date" || this.type === "datetime-local",
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
        data-valign-readonly={this.isReadonly ? "" : undefined}
        // Add focus to the control through sequential keyboard navigation and visually clicking
        tabindex={shouldAddFocus ? "0" : undefined}
        onAnimationStart={this.handleAutoFill}
      >
        {this.isReadonly
          ? [
              <this.readonlyTag
                aria-disabled={this.disabled ? "true" : undefined}
                class={{
                  "gx-edit-content": true,
                  "gx-line-clamp": this.lineClamp
                }}
                style={
                  this.lineClamp && {
                    "--max-lines": this.maxLines.toString()
                  }
                }
                innerHTML={this.format === "HTML" ? this.inner : undefined}
              >
                {this.getReadonlyContent()}
              </this.readonlyTag>,

              this.lineClamp && [
                <div class={LINE_MEASURING}>{"A"}</div>,
                <div class={HEIGHT_MEASURING}></div>
              ]
            ]
          : [
              this.multiline ? (
                <textarea {...attrs} class="gx-edit-content" value={this.value}>
                  {this.value}
                </textarea>
              ) : (
                <input
                  {...attrs}
                  class={{
                    "gx-edit-content": true,
                    "gx-null-date": this.isDateType && !this.value
                  }}
                  type={this.type}
                  value={this.value}
                />
              ),

              this.showTrigger && (
                <button
                  class={{
                    "gx-edit__trigger-button": true,
                    disabled: this.disabled
                  }}
                  type="button"
                  disabled={this.disabled}
                  // Mouse pointer to indicate action
                  data-has-action={!this.disabled ? "" : undefined}
                  onClick={this.handleTriggerClick}
                >
                  <slot name="trigger-content" />
                </button>
              ),

              // Implements a non-native placeholder for date types
              this.isDateType && !this.value && (
                <p aria-hidden="true" class="gx-edit-date-placeholder">
                  {this.placeholder}
                </p>
              )
            ]}
      </Host>
    );
  }
}
