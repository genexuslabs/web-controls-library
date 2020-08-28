import {
  Component,
  Element,
  Event,
  EventEmitter,
  Prop,
  h,
  Host
} from "@stencil/core";
import { Component as GxComponent } from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "action-sheet.scss",
  tag: "gx-action-sheet"
})
export class ActionSheet implements GxComponent {
  constructor() {
    this.handleOnClose = this.handleOnClose.bind(this);
    this.handleOnOpen = this.handleOnOpen.bind(this);
  }

  @Element() element: HTMLGxActionSheetElement;

  /**
   * This attribute lets you specify the label for the close button. Important for accessibility.
   */
  @Prop() readonly closeButtonLabel: string;

  /**
   * This attribute lets you specify if the action sheet is opened or closed.
   */
  @Prop({ mutable: true }) opened = false;

  /**
   * Fired when the action sheet is closed
   */
  @Event() close: EventEmitter;

  /**
   * Fired when the action sheet is opened
   */
  @Event() open: EventEmitter;

  private handleItemClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.matches("gx-action-sheet-item")) {
      this.opened = false;
    }
  }

  private handleOnClose(e: CustomEvent) {
    this.opened = false;
    this.close.emit(e);
  }

  private handleOnOpen(e: CustomEvent) {
    this.opened = true;
    this.open.emit(e);
  }

  render() {
    return (
      <Host>
        <gx-modal
          showHeader={false}
          opened={this.opened}
          onClose={this.handleOnClose}
          onOpen={this.handleOnOpen}
          onClick={this.handleItemClick}
        >
          <div class="gx-action-sheet" slot="body">
            <slot />
          </div>
          <gx-action-sheet-item class="gx-action-sheet-close-item" slot="body">
            {this.closeButtonLabel}
          </gx-action-sheet-item>
        </gx-modal>
      </Host>
    );
  }
}
