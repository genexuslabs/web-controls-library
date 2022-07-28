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
import {
  bodyOverflowsY,
  onMobileDevice,
  setContrastColor
} from "../common/utils";

const WAIT_TO_REMOVE_MODAL = 300; // 300ms
const bodyId = "body";
const headerId = "header";

/**
 * Number of modals displayed. Useful to block the scroll in the html only once.
 */
let displayedModals = 0;
const DISABLE_HTML_SCROLL = "gx-disable-scroll";
const DISABLE_HTML_SCROLL_MOBILE = "gx-disable-scroll-mobile";

let DISABLE_SCROLL_CLASS = "";

@Component({
  shadow: true,
  styleUrl: "modal.scss",
  tag: "gx-modal"
})
export class Modal implements GxComponent {
  private dismissTimer: NodeJS.Timeout = null;

  // To prevent redundant RAF (request animation frame) calls
  private needForRAF = true;

  /** `true` if the modal has `type = "popup"` */
  private shouldSetResizeObserver: boolean;
  private observer: ResizeObserver = null;
  private modalContent: HTMLDivElement;

  private contentOverflowsX = false;
  private contentOverflowsY = false;

  // Refs
  private bodyDiv: HTMLDivElement = null;
  private headerDiv: HTMLDivElement = null;

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
        // Disconnect the observer before the modalContent's reference is null
        this.disconnectObserver();

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
      document.documentElement.classList.add(DISABLE_SCROLL_CLASS);
    }

    if (displayedModals == 0) {
      document.documentElement.classList.remove(DISABLE_SCROLL_CLASS);
    }
  }

  private connectObserver() {
    if (
      !this.shouldSetResizeObserver ||
      this.observer != undefined ||
      !this.opened
    ) {
      return;
    }

    this.observer = new ResizeObserver(() => {
      if (!this.needForRAF) {
        return;
      }
      this.needForRAF = false; // No need to call RAF up until next frame

      requestAnimationFrame(() => {
        this.needForRAF = true; // RAF now consumes the movement instruction so a new one can come

        const overflowX = this.element.offsetWidth != this.element.scrollWidth;
        const overflowY =
          this.element.offsetHeight != this.element.scrollHeight;

        // Check if the position of the dialog should be adjusted
        if (this.contentOverflowsX != overflowX) {
          this.contentOverflowsX = overflowX;
          this.element.style.justifyContent = overflowX ? "flex-start" : null;
        }
        if (this.contentOverflowsY != overflowY) {
          this.contentOverflowsY = overflowY;
          this.element.style.alignItems = overflowY ? "flex-start" : null;
        }
      });
    });

    // Observe size changes for the document's body and modal's content
    this.observer.observe(this.modalContent);
    this.observer.observe(document.body);
  }

  private disconnectObserver() {
    if (!this.shouldSetResizeObserver || this.observer != undefined) {
      return;
    }
    this.observer.disconnect();
    this.observer = undefined;
    this.contentOverflowsX = false;
    this.contentOverflowsY = false;
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
    this.disconnectObserver();

    // Check if should re-enable the scroll on the html
    if (this.presented) {
      displayedModals--;
      this.updateHtmlOverflow();
    }
  }

  componentWillLoad() {
    this.shouldSetResizeObserver = this.type == "popup";
    this.presented = this.opened;

    if (this.opened) {
      displayedModals++;
      this.updateHtmlOverflow();
    }

    // Set the class to disable the scrolling if not defined
    if (DISABLE_SCROLL_CLASS == "") {
      DISABLE_SCROLL_CLASS = onMobileDevice()
        ? DISABLE_HTML_SCROLL_MOBILE
        : DISABLE_HTML_SCROLL;
    }
  }

  componentDidRender() {
    // Check if should connect the ResizeObserver
    this.connectObserver();

    // No need to set contrast colors
    if (this.type == "popup" || !this.presented) {
      return;
    }

    // Contrast for header's background-color
    if (this.showHeader) {
      setContrastColor(
        this.headerDiv,
        this.element,
        "background-color",
        "--header-contrast-color"
      );
    } else {
      this.element.style.removeProperty("--header-contrast-color");
    }

    // Contrast for body's background-color
    setContrastColor(
      this.bodyDiv,
      this.element,
      "background-color",
      "--body-contrast-color"
    );

    // Contrast for accent color
    setContrastColor(
      this.element,
      this.element,
      "--gx-modal-accent-color",
      "--accent-contrast-color"
    );
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
            ref={el => (this.modalContent = el as HTMLDivElement)}
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
                <div
                  part="header"
                  class="header"
                  ref={el => (this.headerDiv = el as HTMLDivElement)}
                >
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
                  ref={el => (this.bodyDiv = el as HTMLDivElement)}
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
