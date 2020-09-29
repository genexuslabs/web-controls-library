import {
  Component,
  Element,
  Event,
  EventEmitter,
  Method,
  Prop,
  State,
  Watch,
  h,
  Host
} from "@stencil/core";
import { EditRender } from "../renders/bootstrap/edit/edit-render";
import { FormComponent } from "../common/interfaces";
import { cssVariablesWatcher } from "../common/css-variables-watcher";
import { makeLinesClampable } from "../common/line-clamp";

@Component({
  shadow: false,
  styleUrl: "edit.scss",
  tag: "gx-edit"
})
export class Edit implements FormComponent {
  constructor() {
    this.renderer = new EditRender(this, {
      handleChange: this.handleChange.bind(this),
      handleTriggerClick: this.handleTriggerClick.bind(this),
      handleValueChanging: this.handleValueChanging.bind(this)
    });

    cssVariablesWatcher(this, [
      {
        cssVariableName: "--font-category",
        propertyName: "fontCategory"
      }
    ]);

    makeLinesClampable(this, "[data-readonly]", ".line-measuring");
  }

  private renderer: EditRender;

  @Element() element: HTMLGxEditElement;

  /**
   * Allows to specify the role of the element when inside a `gx-form-field` element
   */
  @Prop({ reflectToAttr: true }) readonly area: "field";

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
  @Prop({ mutable: true }) fontCategory:
    | "headline"
    | "subheadline"
    | "body"
    | "footnote"
    | "caption1"
    | "caption2" = "body";

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
   * be customized using `trigger-text` and `trigger-class` attributes,
   * or adding a child element with `slot="trigger-content"` attribute to
   * specify the content inside the trigger button.
   */
  @Prop() readonly showTrigger: boolean;

  /**
   * The text of the trigger button. If a text is specified and an image is
   * specified (through an element with `slot="trigger-content"`), the content
   * is ignored and the text is used instead.
   */
  @Prop() readonly triggerText: string;

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
  @Prop() readonly type:
    | "date"
    | "datetime-local"
    | "email"
    | "file"
    | "number"
    | "password"
    | "search"
    | "tel"
    | "text"
    | "url" = "text";

  /**
   * The initial value of the control.
   */
  @Prop({ mutable: true }) value: string;

  @State() maxLines = 0;
  @State() maxHeight = 0;

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
    return this.renderer.getNativeInputId();
  }

  componentDidLoad() {
    this.toggleValueSetClass();
  }

  @Watch("value")
  protected valueChanged() {
    this.renderer.valueChanged();
    this.toggleValueSetClass();
  }

  private toggleValueSetClass() {
    if (this.value === "") {
      this.element.classList.remove("value-set");
    } else {
      this.element.classList.add("value-set");
    }
  }

  private handleChange(event: UIEvent) {
    this.value = this.renderer.getValueFromEvent(event);
    this.change.emit(event);
  }

  private handleValueChanging(event: UIEvent) {
    this.value = this.renderer.getValueFromEvent(event);
    this.input.emit(event);
  }

  private handleTriggerClick(event: UIEvent) {
    if (!this.disabled) {
      event.stopPropagation();
    }
    this.gxTriggerClick.emit(event);
  }

  render() {
    return (
      <Host>
        {this.renderer.render({
          triggerContent: <slot name="trigger-content" />
        })}
      </Host>
    );
  }
}
