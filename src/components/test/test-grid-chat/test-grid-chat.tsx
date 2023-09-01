import { Component, Element, Host, Prop, h } from "@stencil/core";

export type TestGridChatMessage = {
  direction: "start" | "end";
  message: string;
};

const ENTER_KEY = "Enter";

@Component({
  shadow: true,
  styleUrl: "test-grid-chat.scss",
  tag: "gx-test-grid-chat"
})
export class TestGridChat {
  @Element() element!: HTMLGxTestGridChatElement;

  /**
   * Specifies the record that the chat will display.
   */
  @Prop({ mutable: true }) record: TestGridChatMessage[] = [];

  private sendMessage = (event: KeyboardEvent) => {
    if (event.key !== ENTER_KEY) {
      return;
    }
    event.preventDefault();

    const edit = event.target as HTMLGxEditElement;

    this.record = [...this.record, { direction: "start", message: edit.value }];
    edit.value = "";
  };

  render() {
    return (
      <Host>
        <div class="scroll">
          <div class="absolute-content">
            <gx-grid-smart-css accessibleName="Chat" autoGrow={true}>
              <div slot="grid-content">
                {this.record.map(({ direction, message }) => (
                  <gx-grid-smart-cell class={`message-direction--${direction}`}>
                    {message}
                  </gx-grid-smart-cell>
                ))}

                <gx-grid-infinite-scroll
                  position="top"
                  threshold="150px"
                  recordCount={this.record.length}
                ></gx-grid-infinite-scroll>
              </div>

              <gx-loading slot="grid-empty-loading-placeholder"></gx-loading>
            </gx-grid-smart-css>
          </div>
        </div>

        <gx-form-field>
          <gx-edit
            accessibleName="Message"
            placeholder="Send a message"
            onKeyDown={this.sendMessage}
          ></gx-edit>
        </gx-form-field>
      </Host>
    );
  }
}
