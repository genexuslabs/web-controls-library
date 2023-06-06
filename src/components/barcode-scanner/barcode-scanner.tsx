import {
  Component,
  Host,
  h,
  Element,
  State,
  Prop,
  Event,
  EventEmitter
} from "@stencil/core";
import { Html5Qrcode } from "html5-qrcode";

/**
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

  @Element() el: HTMLGxBarcodeScannerElement;

  /**
   * The code extracted for scanner.
   */
  @State() code = "";

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
   * A CSS class to set as the `gx-banner-scanner` element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * When set to Single read, the control reads the first code and then stops scanning. When Continuous read is selected, it reads all the codes it can while the control is visible, non-stop.
   */
  @Prop() readonly operationMode: "Continuous read" | "Single read" =
    "Single read";

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
    this.initScanner();
  }

  disconnectedCallback() {
    this.html5QrCode.stop();
  }

  private initScanner = (): void => {
    Html5Qrcode.getCameras().then(devices => {
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
        this.html5QrCode.start(
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
          },
          () => {
            // parse error, ignore it.
          }
        );
      }
    });
  };

  render() {
    return (
      <Host
        class={{
          [this.cssClass]: !!this.cssClass
        }}
      >
        <slot name="readerContainer"></slot>

        {this.beepOnEachRead && this.beepSrc && (
          <audio id="audio" controls>
            <source type="audio/wav" src={this.beepSrc} />
          </audio>
        )}
      </Host>
    );
  }
}
