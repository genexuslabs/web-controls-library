import {
  Component,
  Element,
  Event,
  EventEmitter,
  Listen,
  Host,
  Method,
  Prop,
  State,
  h
} from "@stencil/core";
import {
  Component as GxComponent,
  DisableableComponent
} from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "password-edit.scss",
  tag: "gx-password-edit"
})
export class PasswordEdit implements GxComponent, DisableableComponent {
  // Refs
  private innerEdit: HTMLGxEditElement;

  @Element() element: HTMLGxPasswordEditElement;

  /**
   * Indicates if the value is revealed or masked.
   */
  @State() revealed = false;

  /**
   * A CSS class to set as the `gx-password-edit` element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * This attribute lets you specify if the element is disabled.
   * If disabled, it will not fire any user interaction related event
   * (for example, click event).
   */
  @Prop() readonly disabled = false;

  /**
   * The text to set as the label of the gx-password-edit control.
   */
  @Prop() readonly labelCaption: string;

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
   * Text of the reveal button to offer revealing the password.
   */
  @Prop() readonly revealButtonTextOn: string;

  /**
   * Text of the reveal button to offer hiding the password.
   */
  @Prop() readonly revealButtonTextOff: string;

  /**
   * If true, a reveal password button is shown next to the password input.
   * Pressing the reveal button toggles the password mask, allowing the user to
   * view the password text.
   */
  @Prop() readonly showRevealButton: boolean;

  /**
   * The initial value of the control.
   */
  @Prop({ mutable: true }) value: string;

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
   * Returns the id of the inner `input` element (if set).
   */
  @Method()
  async getNativeInputId() {
    return this.innerEdit.getNativeInputId();
  }

  @Listen("gxTriggerClick")
  protected handleTriggerClick(event: UIEvent) {
    event.stopPropagation();
    this.revealed = !this.revealed;
  }

  private getValueFromEvent(event: CustomEvent<any>): string {
    return event.target && (event.target as HTMLInputElement).value;
  }

  private handleChange = (event: CustomEvent<any>) => {
    event.stopPropagation();

    this.value = this.getValueFromEvent(event);
    this.change.emit(event);
  };

  private handleInput = (event: CustomEvent<any>) => {
    event.stopPropagation();

    this.value = this.getValueFromEvent(event);
    this.input.emit(event);
  };

  disconnectedCallback() {
    this.innerEdit = null;
  }

  render() {
    return (
      <Host
        class={
          this.revealed
            ? "gx-password-edit--revealed"
            : "gx-password-edit--hidden"
        }
      >
        <gx-edit
          area="field"
          css-class={this.cssClass}
          disabled={this.disabled}
          placeholder={this.placeholder}
          readonly={this.readonly}
          show-trigger={!this.readonly && this.showRevealButton}
          trigger-button-label={
            this.revealed ? this.revealButtonTextOff : this.revealButtonTextOn
          }
          type={this.revealed ? "text" : "password"}
          value={this.value}
          onChange={this.handleChange}
          onInput={this.handleInput}
          ref={input => (this.innerEdit = input as any)}
        >
          {!this.readonly && this.showRevealButton && (
            <div
              slot="trigger-content"
              aria-hidden="true"
              class="gx-password-edit__icon"
            ></div>
          )}
        </gx-edit>
      </Host>
    );
  }
}
