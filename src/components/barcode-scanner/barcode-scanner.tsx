import {
  Component,
  Host,
  h,
  Element,
  State,
  Prop,
  Event,
  EventEmitter,
  Watch
} from "@stencil/core";
import { Html5Qrcode } from "html5-qrcode";

const WAIT_TO_REMOVE_POPUP = 300; // 300ms
const popupHeaderId = "header";

/**
 * @part scanner-container - The container of gx-cropper.
 * @part header - The header of the popup of gx-cropper.
 * @part body - The body of the popup of gx-cropper.
 * @part footer - The footer of the popup of gx-cropper.
 * @part close-button - The button for close the popup of gx-cropper.
 *
 * @slot header - The slot where live the header title of the popup.
 * @slot primaryaction - The slot where live the primary action of popup.
 * @slot secondaryaction - The slot where live the secondary action of popup.
 * @slot readerContainer - The slot where live the code reader tool.
 */

@Component({
  tag: "gx-barcode-scanner",
  styleUrl: "barcode-scanner.scss",
  shadow: true,
  assetsDirs: ["assets"]
})
export class GxBarcodeScanner {
  private html5QrCode: Html5Qrcode = null;
  private audio: HTMLAudioElement = null;
  private scannerId: string = null;
  private dismissTimer: NodeJS.Timeout = null;
  private calculateSizeTimer: NodeJS.Timeout = null;

  @Element() el: HTMLGxBarcodeScannerElement;

  /**
   * The code extracted for scanner.
   */
  @State() code = "";

  /**
   * If the scanner is presented or not.
   */
  @State() presented: boolean;

  /**
   * This attribute lets you specify if the popup is automatically closed when an action is clicked.
   */
  @Prop() readonly autoClose: boolean;

  /**
   * Comma-separated values of the barcode types the Scanner should look for.
   */
  @Prop() readonly barcodeTypes =
    "QR Code, AZTEC, CODE_39, CODE_93, CODE_128, ITF, EAN_13, EAN_8, PDF_417, UPC_A, UPC_E, DATA_MATRIX, MAXICODE, RSS_14, RSS_EXPANDED";

  /**
   * Beeps after each read when set to True.
   */
  @Prop() readonly beepOnEachRead: boolean;

  /**
   * The source of the beep sound.
   */
  @Prop() readonly beepSrc: string;

  /**
   * This attribute lets you specify the label for the close button. Important for accessibility.
   */
  @Prop() readonly closeButtonLabel: string;

  /**
   * A CSS class to set as the `gx-banner-scanner` element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * When set to As Prompt, it shows an indicator that displays a new screen with the camera viewport. When Inline is selected, the camera viewport is displayed inside the Panel’s layout.
   */
  @Prop() readonly displayMode: "As Prompt" | "Inline" = "Inline";

  /**
   * If the showBehavior is popup, this attribute lets you specify if the popup is opened or closed.
   */
  @Prop({ mutable: true }) opened = false;

  @Watch("opened")
  openedHandler(newValue: boolean, oldValue = false) {
    if (newValue === oldValue || this.displayMode === "Inline") {
      return;
    }

    if (newValue) {
      clearTimeout(this.dismissTimer);
      this.presented = true;
      // Emit the event
      this.gxBarcodeScannerPopupOpen.emit();

      this.calculateSizeTimer = setTimeout(() => {
        this.initScanner();
      }, WAIT_TO_REMOVE_POPUP);
    } else {
      clearTimeout(this.calculateSizeTimer);
      this.dismissTimer = setTimeout(() => {
        this.presented = false;
        // Emit the event after the dismiss animation has finished
        this.gxBarcodeScannerPopupClose.emit();
        if (this.html5QrCode) {
          this.html5QrCode.stop();
        }
      }, WAIT_TO_REMOVE_POPUP);
    }
  }

  /**
   * When set to Single read, the control reads the first code and then stops scanning. When Continuous read is selected, it reads all the codes it can while the control is visible, non-stop.
   */
  @Prop() readonly operationMode: "Continuous read" | "Single read" =
    "Single read";

  /**
   * This attribute lets you specify the height of the popup.
   */
  @Prop() readonly popupHeight: string = null;

  /**
   * This attribute lets you specify the width of the popup.
   */
  @Prop() readonly popupWidth: string = null;

  /**
   * This attribute lets you specify if a header is rendered on top of the popup.
   */
  @Prop() readonly showHeader: boolean = true;

  /**
   * This attribute lets you specify if a footer is rendered at the bottom of the popup.
   */
  @Prop() readonly showFooter: boolean = true;

  /**
   * Fired when the popup is closed
   */
  @Event({
    eventName: "gxBarcodeScannerPopupClose",
    bubbles: true
  })
  gxBarcodeScannerPopupClose: EventEmitter;

  /**
   * Fired when the popup is opened
   */
  @Event({
    eventName: "gxBarcodeScannerPopupOpen",
    bubbles: true
  })
  @Event()
  gxBarcodeScannerPopupOpen: EventEmitter;

  /**
   * Fired when the menu action is activated.
   */
  @Event() codeRead: EventEmitter<string>;

  componentDidLoad() {
    const readerContainer = this.el.querySelector("[slot='readerContainer']");
    if (readerContainer) {
      this.scannerId = readerContainer.getAttribute("id");
    }
    this.audio = this.el.shadowRoot.querySelector("#audio") as HTMLAudioElement;
    if (this.displayMode === "Inline") {
      this.initScanner();
    }
  }

  private initScanner = (): void => {
    Html5Qrcode.getCameras()
      .then(devices => {
        /**
         * devices would be an array of objects of type:
         * { id: "id", label: "label" }
         */
        if (devices && devices.length) {
          const cameraId = devices[0].id;

          this.html5QrCode = new Html5Qrcode(
            /* element id */ this.scannerId,
            false
          );
          this.html5QrCode
            .start(
              cameraId,
              {
                fps: 10, // Optional, frame per seconds for qr code scanning
                qrbox: { width: 250, height: 250 } // Optional, if you want bounded box UI
              },
              decodedText => {
                // do something when code is read
                this.codeRead.emit(decodedText);
                if (this.beepOnEachRead && this.audio) {
                  this.audio.play();
                }
                if (this.operationMode === "Single read") {
                  this.opened = false;
                }
              },
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              errorMessage => {
                // parse error, ignore it.
              }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .catch(error => {
              // Start failed, handle it.
            });
        }
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch(error => {
        // handle err
      });
  };

  private closePopup = (e: UIEvent) => {
    e.stopPropagation();

    if (this.displayMode === "Inline" || !this.opened) {
      return;
    }
    this.opened = false;
  };

  private stopPropagation = (e: UIEvent) => {
    e.stopPropagation();
  };

  render() {
    const isPopup = this.displayMode === "As Prompt";
    return (
      <Host
        class={{
          [this.cssClass]: !!this.cssClass,
          popup: isPopup,
          presented: isPopup && this.presented,
          "dismiss-animation": isPopup && !this.opened
        }}
        onClick={this.closePopup}
      >
        <div class="background-shadow">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={this.showHeader ? popupHeaderId : undefined}
            tabindex="-1"
            part="scanner-container"
            onClick={this.stopPropagation}
            class={{
              "scanner-container": true,
              "gx-modal-dialog": isPopup
            }}
            style={{
              width: this.popupWidth,
              height: this.popupHeight,
              "min-width": this.popupWidth
            }}
          >
            {isPopup && (
              <button
                aria-label={this.closeButtonLabel}
                part="close-button"
                class="close-button"
                type="button"
                onClick={this.closePopup}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14">
                  <path d="M13 1L1 13" class="vector" />
                  <path d="M1 1L13 13" class="vector" />
                </svg>
              </button>
            )}
            {isPopup && this.showHeader && (
              <div
                part="header"
                class="header"
                // ref={el => (this.headerDiv = el as HTMLDivElement)}
              >
                <h5 id={popupHeaderId}>
                  <slot name="header" />
                </h5>
              </div>
            )}
            <div class="scanner-body" part="body">
              <slot name="readerContainer"></slot>
            </div>
            {isPopup && this.showFooter && (
              <div part="footer" class="footer">
                <slot name="secondaryaction" />
                <slot name="primaryaction" />
              </div>
            )}
          </div>
        </div>

        {this.beepOnEachRead && this.beepSrc && (
          <audio id="audio" controls>
            <source type="audio/wav" src={this.beepSrc} />
          </audio>
        )}
      </Host>
    );
  }
}
