import {
  Component,
  Element,
  Event,
  EventEmitter,
  Prop,
  h,
  Host,
  Listen
} from "@stencil/core";
import { Component as GxComponent } from "../common/interfaces";

@Component({
  shadow: true,
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

  @Listen("actionSheetItemClick")
  handleItemClick(e: UIEvent) {
    e.stopPropagation();
    this.opened = false;
    this.close.emit(e);
  }

  private closeActionSheet = (e: UIEvent) => {
    this.opened = false;
    this.close.emit(e);
  };

  private handleOnClose(e: CustomEvent) {
    this.opened = false;
    this.close.emit(e);
  }

  private handleOnOpen(e: CustomEvent) {
    this.opened = true;
    this.open.emit(e);
  }

  componentWillLoad() {
    // Since the "close-item" element is in the Shadow Root and not in the
    // Light DOM, `lastAction` will be the last child of the body.
    const lastAction = this.element.querySelector(
      ":scope > gx-action-sheet-item:last-child"
    );
    lastAction?.classList.add("last-action");
  }

  render() {
    return (
      <Host>
        <gx-modal
          showHeader={false}
          type={"popup"}
          opened={this.opened}
          onClose={this.handleOnClose}
          onOpen={this.handleOnOpen}
        >
          <div class="body" slot="body">
            <slot />
          </div>
          <gx-action-sheet-item
            class="close-item"
            slot="primary-action"
            onClick={this.closeActionSheet}
          >
            {this.closeButtonLabel}
          </gx-action-sheet-item>
        </gx-modal>
      </Host>
    );
  }
}
