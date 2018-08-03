// tslint:disable-next-line
import Bootstrap from "bootstrap.native/dist/bootstrap-native-v4";
import { EventEmitter } from "../../../../../node_modules/@stencil/core";

const BODY_SLOT_NAME = "body";
const PRIMARY_ACTION_SLOT_NAME = "primary-action";
const SECONDARY_ACTION_SLOT_NAME = "secondary-action";

type Constructor<T> = new (...args: any[]) => T;
export function ModalRender<T extends Constructor<{}>>(Base: T) {
  return class extends Base {
    element: HTMLElement;

    autoClose: boolean;
    closeButtonLabel: string;
    id: string;
    opened: boolean;

    onClose: EventEmitter;
    onOpen: EventEmitter;

    private headerId: string;
    private bootstrapModal: Bootstrap.Modal;

    componentDidLoad() {
      const modalElement = this.getModalElement();

      modalElement.addEventListener("show.bs.modal", e => {
        this.onOpen.emit(e);
        this.opened = true;
      });

      modalElement.addEventListener("hide.bs.modal", e => {
        this.onClose.emit(e);
        this.opened = false;
      });

      this.bootstrapModal = new Bootstrap.Modal(modalElement, {
        show: this.opened
      });

      if (this.autoClose) {
        const actions = Array.from(
          this.element.querySelectorAll(
            `[slot='${PRIMARY_ACTION_SLOT_NAME}'], [slot='${SECONDARY_ACTION_SLOT_NAME}']`
          )
        );
        actions.forEach(action =>
          action.addEventListener("click", () => this.close())
        );
      }
    }

    render() {
      const primaryActions = Array.from(
        this.element.querySelectorAll<HTMLGxButtonElement>(
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
        this.element.querySelectorAll<HTMLGxButtonElement>(
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
        this.headerId = this.id
          ? `${this.id}__modal`
          : `gx-modal-auto-id-${autoId++}`;
      }

      return (
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
                  <slot name="header" />
                </h5>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label={this.closeButtonLabel}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <slot name={BODY_SLOT_NAME} />
              </div>
              {hasFooterActions ? (
                <div class="modal-footer">
                  <slot name={PRIMARY_ACTION_SLOT_NAME} />
                  <slot name={SECONDARY_ACTION_SLOT_NAME} />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      );
    }

    open() {
      this.bootstrapModal.show();
    }

    close() {
      this.bootstrapModal.hide();
    }

    private getModalElement() {
      return this.element.querySelector(".modal");
    }

    private getActionCssClasses(currentCssClasses, ...newClasses): string {
      return (currentCssClasses || "")
        .split(" ")
        .concat(...newClasses)
        .join(" ");
    }
  };
}

let autoId = 0;
