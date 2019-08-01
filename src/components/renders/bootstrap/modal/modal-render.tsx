import { h } from "@stencil/core";
// tslint:disable-next-line
import Bootstrap from "bootstrap.native/dist/bootstrap-native-v4";
import { IRenderer } from "../../../common/interfaces";
import { Modal } from "../../../modal/modal";

const PRIMARY_ACTION_SLOT_NAME = "primary-action";
const SECONDARY_ACTION_SLOT_NAME = "secondary-action";

export class ModalRender implements IRenderer {
  constructor(public component: Modal) {}

  private headerId: string;
  private bootstrapModal: Bootstrap.Modal;

  componentDidLoad() {
    const modalElement = this.getModalElement();

    modalElement.addEventListener("show.bs.modal", e => {
      this.component.onOpen.emit(e);
      this.component.opened = true;
    });

    modalElement.addEventListener("hide.bs.modal", e => {
      this.component.onClose.emit(e);
      this.component.opened = false;
    });

    this.bootstrapModal = new Bootstrap.Modal(modalElement, {
      show: this.component.opened
    });

    if (this.component.autoClose) {
      const actions = Array.from(
        this.component.element.querySelectorAll(
          `[slot='${PRIMARY_ACTION_SLOT_NAME}'], [slot='${SECONDARY_ACTION_SLOT_NAME}']`
        )
      );
      actions.forEach(action =>
        action.addEventListener("click", () => this.close())
      );
    }
  }

  render(slots: { header; body; primaryAction; secondaryAction }) {
    const primaryActions = Array.from(
      this.component.element.querySelectorAll<HTMLGxButtonElement>(
        `[slot='${PRIMARY_ACTION_SLOT_NAME}']`
      )
    );
    primaryActions.forEach(
      action =>
        (action.cssClass = this.getActionCssClasses(
          action.cssClass,
          "btn-primary"
        ))
    );

    const secondaryActions = Array.from(
      this.component.element.querySelectorAll<HTMLGxButtonElement>(
        `[slot='${SECONDARY_ACTION_SLOT_NAME}']`
      )
    );
    secondaryActions.forEach(
      action =>
        (action.cssClass = this.getActionCssClasses(
          action.cssClass,
          "btn-secondary"
        ))
    );

    const hasFooterActions = primaryActions.length || secondaryActions.length;

    if (!this.headerId) {
      this.headerId = this.component.id
        ? `${this.component.id}__modal`
        : `gx-modal-auto-id-${autoId++}`;
    }

    return [
      <gx-bootstrap />,
      <div
        class="modal fade"
        tabindex="-1"
        role="dialog"
        aria-labelledby={this.headerId}
        aria-hidden="true"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id={this.headerId}>
                {slots.header}
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label={this.component.closeButtonLabel}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">{slots.body}</div>
            {hasFooterActions ? (
              <div class="modal-footer">
                {slots.primaryAction}
                {slots.secondaryAction}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    ];
  }

  open() {
    this.bootstrapModal.show();
  }

  close() {
    this.bootstrapModal.hide();
  }

  private getModalElement() {
    return this.component.element.querySelector(".modal");
  }

  private getActionCssClasses(currentCssClasses, ...newClasses): string {
    return (currentCssClasses || "")
      .split(" ")
      .concat(...newClasses)
      .join(" ");
  }
}

let autoId = 0;
