import { CheckBoxRender } from "../renders/bootstrap/checkbox/checkbox-render";
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
import { FormComponent } from "../common/interfaces";

// Class transforms
import { getClasses } from "../common/css-transforms/css-transforms";

@Component({
  shadow: false,
  styleUrl: "checkbox.scss",
  tag: "gx-checkbox"
})
export class CheckBox implements FormComponent {
  constructor() {
    this.renderer = new CheckBoxRender(this, {
      handleChange: this.handleChange.bind(this)
    });
  }

  private renderer: CheckBoxRender;

  @Element() element: HTMLGxCheckboxElement;

  /**
   * This attribute lets you specify how this element will behave when hidden.
   *
   * | Value        | Details                                                                     |
   * | ------------ | --------------------------------------------------------------------------- |
   * | `keep-space` | The element remains in the document flow, and it does occupy space.         |
   * | `collapse`   | The element is removed form the document flow, and it doesn't occupy space. |
   */
  @Prop() readonly invisibleMode: "collapse" | "keep-space" = "collapse";

  /**
   * A CSS class to set as the `gx-checkbox` element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * This attribute lets you specify if the element is disabled.
   * If disabled, it will not fire any user interaction related event
   * (for example, click event).
   */
  @Prop() readonly disabled = false;

  /**
   * This attribute indicates that the user cannot modify the value of the control.
   * Same as [readonly](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-readonly)
   * attribute for `input` elements.
   */
  @Prop() readonly readonly = false;

  /**
   * Specifies the label of the checkbox.
   */
  @Prop() readonly caption: string;

  /**
   * Indicates that the control is selected by default.
   */
  @Prop({ mutable: true }) checked: boolean;

  /**
   * The value of the control.
   */
  @Prop({ mutable: true }) value: string;

  /**
   * The value when the checkbox is 'on'
   */
  @Prop() readonly checkedValue: string;

  /**
   * The value when the checkbox is 'off'
   */
  @Prop() readonly unCheckedValue: string;

  /**
   * The `input` event is emitted when a change to the element's value is committed by the user.
   */
  @Event() input: EventEmitter;

  /**
   * Returns the id of the inner `input` element (if set).
   */
  @Method()
  async getNativeInputId() {
    return this.renderer.getNativeInputId();
  }

  @Watch("checked")
  protected checkedChanged() {
    this.renderer.checkedChanged();
  }

  componentWillLoad() {
    this.checked = this.value === this.checkedValue;
  }

  @Watch("value")
  protected valueChanged() {
    this.checked = this.value === this.checkedValue;
  }

  private handleChange(event: UIEvent) {
    event.stopPropagation();
    this.checked = this.renderer.getValueFromEvent(event);
    this.updateValue();
    this.input.emit(event);
  }

  private updateValue() {
    this.value = this.checked ? this.checkedValue : this.unCheckedValue;
  }

  render() {
    // Styling for gx-checkbox control.
    const classes = getClasses(this.cssClass);

    return (
      <Host
        class={{
          [this.cssClass]: !!this.cssClass,
          [classes.vars]: true,
          [classes.highlighted]: true
        }}
      >
        {this.renderer.render()}
      </Host>
    );
  }
}
