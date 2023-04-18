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

import { EditType } from "../../common/types";

// Class transforms
import { getClasses } from "../common/css-transforms/css-transforms";

const AUTOFILL_START_ANIMATION_NAME = "AutoFillStart";

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
    makeLinesClampable(this, ".gx-line-clamp-container", ".line-measuring");
  }

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

  componentWillLoad() {}

  componentDidLoad() {}

  render() {
    return <Host></Host>;
  }
}
