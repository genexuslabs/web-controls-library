import {
  Component,
  Element,
  Event,
  EventEmitter,
  Prop,
  Watch,
  h,
  Host,
  State
} from "@stencil/core";
import { Component as GxComponent } from "../common/interfaces";
import { bodyOverflowsY } from "../common/utils";

const WAIT_TO_REMOVE_MODAL = 300; // 300ms
const bodyId = "body";
const headerId = "header";

/**
 * Number of modals displayed. Useful to block the scroll in the html only once.
 */
let displayedModals = 0;
const DISABLE_HTML_SCROLL = "gx-disable-scroll";

@Component({
  shadow: true,
  styleUrl: "modal.scss",
  tag: "gx-modal"
})
export class Modal implements GxComponent {
  private dismissTimer: NodeJS.Timeout = null;

  @Element() element: HTMLGxModalElement;

  /**
   * This attribute lets you specify if the modal dialog is automatically closed when an action is clicked.
   */
  @Prop() readonly autoClose: boolean;

  /**
   * This attribute lets you specify the label for the close button. Important for accessibility.
   */
  @Prop() readonly closeButtonLabel: string;

  /**
   * This attribute lets you specify the height of the control.
   */
  @Prop() readonly height: string = null;

  /**
   * This attribute lets you specify if the modal dialog is opened or closed.
   */
  @Prop({ mutable: true }) opened = false;

  /**
   * This attribute lets you specify if a body is rendered in the middle of the modal dialog.
   */
  @Prop() readonly showBody: boolean = true;

  /**
   * This attribute lets you specify if a footer is rendered at the bottom of the modal dialog.
   */
  @Prop() readonly showFooter: boolean = true;

  /**
   * This attribute lets you specify if a header is rendered on top of the modal dialog.
   */
  @Prop() readonly showHeader: boolean = true;

  /**
   * If `type != "popup"`, the modal dialog will render with more advanced
   * styling, including `box-shadow`, `border-radius` and `padding`.
   */
  @Prop({ reflect: true }) readonly type: "alert" | "dialog" | "popup" =
    "dialog";

  /**
   * This attribute lets you specify the width of the control.
   */
  @Prop() readonly width: string = null;

  /**
   * Fired when the modal dialog is closed
   */
  @Event() close: EventEmitter;

  /**
   * Fired when the modal dialog is opened
   */
  @Event() open: EventEmitter;

  @State() presented: boolean;

  @Watch("opened")
  openedHandler(newValue: boolean, oldValue = false) {
    if (newValue === oldValue) {
      return;
    }

    if (newValue) {
      clearTimeout(this.dismissTimer);
      this.presented = true;
      displayedModals++;
      this.updateHtmlOverflow();

      // Emit the event
      this.open.emit();
    } else {
      this.dismissTimer = setTimeout(() => {
        this.presented = false;

        // Check if should re-enable the scroll on the html
        displayedModals--;
        this.updateHtmlOverflow();

        // Emit the event after the dismiss animation has finished
        this.close.emit();
      }, WAIT_TO_REMOVE_MODAL);
    }
  }

  private updateHtmlOverflow() {
    // If the modal is displayed, but another modal component disabled the
    // scroll on the html (displayedModals > 1), we don't have to disable it
    if (displayedModals == 1 && bodyOverflowsY()) {
      document.documentElement.classList.add(DISABLE_HTML_SCROLL);
    }

    if (displayedModals == 0) {
      document.documentElement.classList.remove(DISABLE_HTML_SCROLL);
    }
  }

  private closeModal = (e: UIEvent) => {
    e.stopPropagation();

    if (!this.opened) {
      return;
    }
    this.opened = false;
  };

  private stopPropagation = (e: UIEvent) => {
    e.stopPropagation();
  };

  disconnectedCallback() {
    clearTimeout(this.dismissTimer);

    // Check if should re-enable the scroll on the html
    if (this.presented) {
      displayedModals--;
      this.updateHtmlOverflow();
    }
  }

  componentWillLoad() {
    this.presented = this.opened;

    if (this.opened) {
      displayedModals++;
      this.updateHtmlOverflow();
    }
  }

  componentDidLoad() {
    // The modal might be opened when it is first rendered, due to in some
    // cases it was open when the UI was refreshed.
    if (this.opened) {
      this.updateHtmlOverflow();
      this.open.emit();
    }
  }

  render() {
    const customDialog = this.type != "popup";

    return (
      <Host
        class={{ presented: this.presented, "dismiss-animation": !this.opened }}
        onClick={this.closeModal}
      >
        {this.presented && (
          <div
            role={this.type === "alert" ? "alertdialog" : "dialog"}
            aria-modal="true"
            aria-labelledby={this.showHeader ? headerId : undefined}
            aria-describedby={this.type === "alert" ? bodyId : undefined}
            tabindex="-1"
            part="dialog"
            class={{
              "gx-modal-dialog": true,
              "custom-dialog": customDialog
            }}
            style={{
              width: this.width,
              height: this.height,
              "min-width": this.width
            }}
            onClick={this.stopPropagation}
          >
            <div role="document" tabindex="0" class="gx-modal-content">
              {customDialog && (
                <button
                  aria-label={this.closeButtonLabel}
                  part="close-button"
                  class="close-button"
                  type="button"
                  onClick={this.closeModal}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14">
                    <path d="M13 1L1 13" class="vector" />
                    <path d="M1 1L13 13" class="vector" />
                  </svg>
                </button>
              )}
              {this.showHeader && (
                <div part="header" class="header">
                  <h5 id={headerId}>
                    <slot name="header" />
                  </h5>
                </div>
              )}
              {this.showBody && (
                <div
                  id={this.type === "alert" ? bodyId : undefined}
                  part="body"
                  class={{ body: true, "custom-body": customDialog }}
                >
                  <slot name="body" />
                </div>
              )}
              {this.showFooter && (
                <div part="footer" class="footer">
                  <slot name="secondary-action" />
                  <slot name="primary-action" />
                </div>
              )}
            </div>
          </div>
        )}
      </Host>
    );
  }
}
