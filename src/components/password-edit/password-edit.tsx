import {
  Component,
  Element,
  Event,
  EventEmitter,
  Listen,
  Method,
  Prop,
  State,
  Watch
} from "@stencil/core";
import { PasswordEditRender } from "../renders/bootstrap/password-edit/password-edit-render";
import {
  IComponent,
  IDisableableComponent,
  IVisibilityComponent
} from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "password-edit.scss",
  tag: "gx-password-edit"
})
export class PasswordEdit
  implements IComponent, IDisableableComponent, IVisibilityComponent {
  constructor() {
    this.renderer = new PasswordEditRender(this);
  }

  private renderer: PasswordEditRender;

  @Element() element: HTMLElement;

  /**
   * A CSS class to set as the inner `input` element class.
   */
  @Prop() cssClass: string;

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
   * Text of the reveal button to offer revealing the password.
   */
  @Prop() revealButtonTextOn: string;

  /**
   * Text of the reveal button to offer hiding the password.
   */
  @Prop() revealButtonTextOff: string;

  /**
   * If true, a reveal password button is shown next to the password input.
   * Pressing the reveal button toggles the password mask, allowing the user to
   * view the password text.
   */
  @Prop() showRevealButton: boolean;

  /**
   * The initial value of the control.
   */
  @Prop({ mutable: true })
  value: string;

  @State() protected revealed = false;

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
   * Returns the id of the inner `input` element (if set).
   */
  @Method()
  getNativeInputId() {
    return this.renderer.getNativeInputId();
  }

  @Watch("value")
  protected valueChanged() {
    this.renderer.valueChanged();
  }

  @Listen("gxTriggerClick")
  protected handleTriggerClick() {
    this.revealed = !this.revealed;
    this.renderer.handleTriggerClick();
  }

  render() {
    return this.renderer.render();
  }

  componentDidUnload() {
    this.renderer.componentDidUnload();
  }
}
