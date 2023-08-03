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
import { DisableableComponent } from "../common/interfaces";

import { AccessibleNameComponent } from "../../common/interfaces";

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

  render() {
    return (
      <Host
        class={{
          [this.cssClass]: !!this.cssClass,
          [DISABLED_CLASS]: this.disabled
        }}
      ></Host>
    );
  }
}
