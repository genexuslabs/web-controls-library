import { EventEmitter } from "@stencil/core";

type Constructor<T> = new (...args: any[]) => T;
export function PasswordEditRender<T extends Constructor<{}>>(Base: T) {
  return class extends Base {
    element: HTMLElement;

    cssClass: string;
    disabled = false;
    id: string;
    invisibleMode: string;
    placeholder: string;
    readonly: boolean;
    revealButtonTextOn: string;
    revealButtonTextOff: string;
    showRevealButton: boolean;
    value: string;

    onChange: EventEmitter;
    onInput: EventEmitter;

    private innerEdit: any;
    protected revealed = false;

    getNativeInputId() {
      return this.innerEdit.getNativeInputId();
    }

    private getValueFromEvent(event: UIEvent): string {
      return event.target && (event.target as HTMLInputElement).value;
    }

    handleChange(event: UIEvent) {
      this.value = this.getValueFromEvent(event);
      this.onChange.emit(event);
    }

    handleInput(event: UIEvent) {
      this.value = this.getValueFromEvent(event);
      this.onInput.emit(event);
    }

    protected handleTriggerClick() {
      this.innerEdit.type = this.revealed ? "text" : "password";
    }
    /**
     * Update the native input element when the value changes
     */
    protected valueChanged() {
      const innerEdit = this.innerEdit;
      if (innerEdit && innerEdit.value !== this.value) {
        innerEdit.value = this.value;
      }
    }

    componentDidUnload() {
      this.innerEdit = null;
    }

    render() {
      return (
        <gx-edit
          ref={input => (this.innerEdit = input as any)}
          css-class={this.cssClass}
          disabled={this.disabled}
          id={this.id}
          placeholder={this.placeholder}
          readonly={this.readonly}
          show-trigger={!this.readonly && this.showRevealButton}
          trigger-class={this.revealed ? "active" : ""}
          trigger-text={
            this.revealed ? this.revealButtonTextOff : this.revealButtonTextOn
          }
          type={this.revealed ? "text" : "password"}
          value={this.value}
          onChange={this.handleChange.bind(this)}
          onInput={this.handleInput.bind(this)}
        >
          <i
            class={"fa fa-eye" + (this.revealed ? "-slash" : "")}
            slot="trigger-content"
          />
        </gx-edit>
      );
    }
  };
}
