import {
  Component,
  Element,
  Event,
  EventEmitter,
  Method,
  Prop,
  Watch
} from "@stencil/core";
import { EditRender } from "../renders/bootstrap/edit/edit-render";
import { IFormComponent } from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "edit.scss",
  tag: "gx-edit"
})
export class Edit implements IFormComponent {
  constructor() {
    this.renderer = new EditRender(this);
  }

  private renderer: EditRender;

  @Element() element: HTMLElement;

  @Prop({ reflectToAttr: true })
  area: string;

  /**
   * Specifies the auto-capitalization behavior. Same as [autocapitalize](https://developer.apple.com/library/content/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/Attributes.html#//apple_ref/doc/uid/TP40008058-autocapitalize)
   * attribute for `input` elements. Only supported by Safari and Chrome.
   */
  @Prop() autocapitalize: "none" | "sentences" | "words" | "characters";

  /**
   * This attribute indicates whether the value of the control can be
   * automatically completed by the browser. Same as [autocomplete](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-autocomplete)
   * attribute for `input` elements.
   */
  @Prop() autocomplete: "on" | "off";

  /**
   * Used to control whether autocorrection should be enabled when the user
   * is entering/editing the text value. Sames as [autocorrect](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-autocorrect)
   * attribute for `input` elements.
   */
  @Prop() autocorrect: string;

  /**
   * This attribute lets you specify how this element will behave when hidden.
   *
   * | Value        | Details                                                                     |
   * | ------------ | --------------------------------------------------------------------------- |
   * | `keep-space` | The element remains in the document flow, and it does occupy space.         |
   * | `collapse`   | The element is removed form the document flow, and it doesn't occupy space. |
   */
  @Prop() invisibleMode: "collapse" | "keep-space" = "collapse";

  /**
   * This attribute lets you specify if the element is disabled.
   * If disabled, it will not fire any user interaction related event
   * (for example, click event).
   */
  @Prop() disabled = false;

  /**
   * The identifier of the control. Must be unique.
   */
  @Prop() id: string;

  /**
   * Controls if the element accepts multiline text.
   */
  @Prop() multiline: boolean;

  /**
   * A hint to the user of what can be entered in the control. Same as [placeholder](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-placeholder)
   * attribute for `input` elements.
   */
  @Prop() placeholder: string;

  /**
   * This attribute indicates that the user cannot modify the value of the control.
   * Same as [readonly](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-readonly)
   * attribute for `input` elements.
   */
  @Prop() readonly: boolean;

  /**
   * If true, a trigger button is shown next to the edit field. The button can
   * be customized using `trigger-text` and `trigger-class` attributes,
   * or adding a child element with `slot="trigger-content"` attribute to
   * specify the content inside the trigger button.
   */
  @Prop() showTrigger: boolean;

  /**
   * The text of the trigger button. If a text is specified and an image is
   * specified (through an element with `slot="trigger-content"`), the content
   * is ignored and the text is used instead.
   */
  @Prop() triggerText: string;

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
  @Prop()
  type:
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
  @Prop({ mutable: true })
  value: string;

  /**
   * The `change` event is emitted when a change to the element's value is
   * committed by the user. Unlike the `input` event, the `change` event is not
   * necessarily fired for each change to an element's value but when the
   * control loses focus.
   */
  @Event() onChange: EventEmitter;

  /**
   * The `input` event is fired synchronously when the value is changed.
   */
  @Event() onInput: EventEmitter;

  /**
   * The `gxTriggerClick` event is fired when the trigger button is clicked.
   */
  @Event() gxTriggerClick: EventEmitter;

  /**
   * Returns the id of the inner `input` element (if set).
   */
  @Method()
  getNativeInputId() {
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

  handleChange(event: UIEvent) {
    this.value = this.renderer.getValueFromEvent(event);
    this.onChange.emit(event);
  }

  handleValueChanging(event: UIEvent) {
    this.value = this.renderer.getValueFromEvent(event);
    this.onInput.emit(event);
  }

  handleTriggerClick(event: UIEvent) {
    this.gxTriggerClick.emit(event);
  }

  render() {
    return this.renderer.render();
  }
}
