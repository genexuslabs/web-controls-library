import { h } from "@stencil/core";
import { IRenderer } from "../../../common/interfaces";
import { ActionSheet } from "../../../action-sheet/action-sheet";

export class ActionSheetRender implements IRenderer {
  constructor(public component: ActionSheet) {}

  private handleOnClose(e: CustomEvent) {
    this.component.opened = false;
    this.component.onClose.emit(e);
  }

  private handleOnOpen(e: CustomEvent) {
    this.component.opened = true;
    this.component.onOpen.emit(e);
  }

  render(slots: { default }) {
    const actionSheet = this.component;

    return [
      <gx-bootstrap />,
      <gx-modal
        opened={actionSheet.opened}
        closeButtonLabel={actionSheet.closeButtonLabel}
        onOnClose={this.handleOnClose.bind(this)}
        onOnOpen={this.handleOnOpen.bind(this)}
      >
        <div slot="body">
          <div class="list-group list-group-flush">{slots.default}</div>
        </div>
      </gx-modal>
    ];
  }
}
