import {
  Component,
  Element,
  Event,
  EventEmitter,
  Method,
  Prop,
  Watch,
  Host,
  h
} from "@stencil/core";
import { DISABLED_CLASS } from "../../common/reserved-names";
import { DisableableComponent } from "../common/interfaces";

import { AccessibleNameComponent } from "../../common/interfaces";

let autoCheckBoxId = 0;

@Component({
  shadow: false,
  styleUrl: "checkbox.scss",
  tag: "gx-checkbox"
})
export class CheckBox implements AccessibleNameComponent, DisableableComponent {
  private checkboxId: string;

  @Element() element: HTMLGxCheckboxElement;

  /**
   * Specifies a short string, typically 1 to 3 words, that authors associate
   * with an element to provide users of assistive technologies with a label
   * for the element.
   */
  @Prop() readonly accessibleName: string;

  /**
   * Specifies the label of the checkbox.
   */
  @Prop() readonly caption: string;

  /**
   * Indicates that the control is selected by default.
   */
  @Prop({ mutable: true }) checked: boolean;

  /**
   * The value when the checkbox is 'on'
   */
  @Prop() readonly checkedValue: string;

  /**
   * A CSS class to set as the `gx-checkbox` element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * This attribute lets you specify if the element is disabled.
   * If disabled, it will not fire any user interaction related event
   * (for example, click event).
   */
  @Prop() readonly disabled: boolean = false;

  /**
   * True to highlight control when an action is fired.
   */
  @Prop() readonly highlightable: boolean = false;

  /**
   * This attribute indicates that the user cannot modify the value of the control.
   * Same as [readonly](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-readonly)
   * attribute for `input` elements.
   */
  @Prop() readonly readonly: boolean = false;

  /**
   * The value when the checkbox is 'off'
   */
  @Prop() readonly unCheckedValue: string;

  /**
   * The value of the control.
   */
  @Prop({ mutable: true }) value: string;

  /**
   * Emitted when the element is clicked or the space key is pressed and
   * released.
   */
  @Event() click: EventEmitter;

  /**
   * The `input` event is emitted when a change to the element's value is
   * committed by the user.
   */
  @Event() input: EventEmitter;

  /**
   * Returns the id of the inner `input` element (if set).
   */
  @Method()
  async getNativeInputId() {
    return this.checkboxId;
  }

  @Watch("value")
  protected valueChanged() {
    this.checked = this.value === this.checkedValue;
  }

  componentWillLoad() {
    // ID for gx-checkbox's label
    this.checkboxId = `gx-checkbox-auto-id-${autoCheckBoxId++}`;

    this.checked = this.value === this.checkedValue;
  }

  private getValue = (checked: boolean) =>
    checked ? this.checkedValue : this.unCheckedValue;

  /**
   * Checks if it is necessary to prevent the click from bubbling
   */
  private handleClick = (event: UIEvent) => {
    if (this.readonly || this.disabled) {
      return;
    }

    event.stopPropagation();
  };

  private handleChange = (event: UIEvent) => {
    event.stopPropagation();

    const inputRef = event.target as HTMLInputElement;
    const checked = inputRef.checked;
    const value = this.getValue(checked);

    this.checked = checked;
    this.value = value;
    inputRef.value = value; // Update input's value before emitting the event

    this.input.emit(event);

    if (this.highlightable) {
      this.click.emit();
    }
  };

  render() {
    const shouldAddFocusWhenReadonly =
      this.highlightable && this.readonly && !this.disabled;

    return (
      <Host
        class={{
          [this.cssClass]: !!this.cssClass,
          [DISABLED_CLASS]: this.disabled,
          "gx-checkbox--actionable":
            (!this.readonly && !this.disabled) ||
            (this.readonly && this.highlightable)
        }}
        // Mouse pointer to indicate action
        data-has-action={shouldAddFocusWhenReadonly ? "" : undefined}
        // Add focus to the control through sequential keyboard navigation and visually clicking
        tabindex={shouldAddFocusWhenReadonly ? "0" : undefined}
        // Alignment
        data-align
        data-valign-readonly={this.readonly ? "" : undefined}
        data-valign={!this.readonly ? "" : undefined}
      >
        <div
          class={{
            "gx-checkbox__container": true,
            "gx-checkbox__container--checked": this.checked
          }}
        >
          <input
            aria-label={
              this.accessibleName?.trim() !== "" &&
              this.accessibleName !== this.caption
                ? this.accessibleName
                : null
            }
            id={this.checkboxId}
            class="gx-checkbox__input"
            type="checkbox"
            checked={this.checked}
            disabled={this.disabled || this.readonly}
            value={this.value}
            onClick={this.handleClick}
            onInput={this.handleChange}
          />
          <div
            class={{
              "gx-checkbox__option": true,
              "gx-checkbox__option--checked": this.checked
            }}
            aria-hidden="true"
          ></div>
        </div>

        {this.caption && (
          <label
            class="gx-checkbox__label"
            htmlFor={this.checkboxId}
            onClick={this.handleClick}
          >
            {this.caption}
          </label>
        )}
      </Host>
    );
  }
}
