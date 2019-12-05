import { h } from "@stencil/core";
import { Renderer } from "../../../common/interfaces";
import { PasswordEdit } from "../../../password-edit/password-edit";

export class PasswordEditRender implements Renderer {
  constructor(private component: PasswordEdit) {
    this.handleChange = this.handleChange.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  private innerEdit: any;

  getNativeInputId() {
    return this.innerEdit.getNativeInputId();
  }

  private getValueFromEvent(event: CustomEvent<any>): string {
    return event.target && (event.target as HTMLInputElement).value;
  }

  handleChange(event: CustomEvent<any>) {
    this.component.value = this.getValueFromEvent(event);
    this.component.change.emit(event);
  }

  handleInput(event: CustomEvent<any>) {
    this.component.value = this.getValueFromEvent(event);
    this.component.input.emit(event);
  }

  /**
   * Update the native input element when the value changes
   */
  valueChanged() {
    const innerEdit = this.innerEdit;
    if (innerEdit && innerEdit.value !== this.component.value) {
      innerEdit.value = this.component.value;
    }
  }

  componentDidUnload() {
    this.innerEdit = null;
  }

  render() {
    const passwordEdit = this.component;
    return (
      <gx-edit
        ref={input => (this.innerEdit = input as any)}
        css-class={passwordEdit.cssClass}
        disabled={passwordEdit.disabled}
        id={`gx-password-edit-${passwordEdit.element.id}`}
        placeholder={passwordEdit.placeholder}
        readonly={passwordEdit.readonly}
        show-trigger={!passwordEdit.readonly && passwordEdit.showRevealButton}
        trigger-class={passwordEdit.revealed ? "active" : ""}
        trigger-text={
          passwordEdit.revealed
            ? passwordEdit.revealButtonTextOff
            : passwordEdit.revealButtonTextOn
        }
        type={passwordEdit.revealed ? "text" : "password"}
        value={passwordEdit.value}
        onChange={this.handleChange}
        onInput={this.handleInput}
      >
        <i
          class={"icon icon-eye" + (passwordEdit.revealed ? "-slash" : "")}
          slot="trigger-content"
        />
      </gx-edit>
    );
  }
}
