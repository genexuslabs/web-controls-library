import { h } from "@stencil/core";
import { Renderer } from "../../../common/interfaces";
import { ActionSheet } from "../../../action-sheet/action-sheet";

export class ActionSheetRender implements Renderer {
  constructor(private component: ActionSheet) {
    this.handleOnClose = this.handleOnClose.bind(this);
    this.handleOnOpen = this.handleOnOpen.bind(this);
  }

  private handleOnClose(e: CustomEvent) {
    this.component.opened = false;
    this.component.close.emit(e);
  }

  private handleOnOpen(e: CustomEvent) {
    this.component.opened = true;
    this.component.open.emit(e);
  }

  render(slots: { default }) {
    const actionSheet = this.component;

    return [
      <gx-bootstrap />,
      <gx-modal
        opened={actionSheet.opened}
        closeButtonLabel={actionSheet.closeButtonLabel}
        onClose={this.handleOnClose}
        onOpen={this.handleOnOpen}
      >
        <div slot="body">
          <div class="list-group list-group-flush">{slots.default}</div>
        </div>
      </gx-modal>
    ];
  }
}
