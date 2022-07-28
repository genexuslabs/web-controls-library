import {
  Component,
  Element,
  Event,
  EventEmitter,
  Host,
  Prop,
  State,
  h
} from "@stencil/core";

import { Component as GxComponent } from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "image-picker.scss",
  tag: "gx-image-picker"
})
export class ImagePicker implements GxComponent {
  // Used to read the images
  private reader = new FileReader();

  // Refs
  private input: HTMLInputElement;
  private modal: HTMLGxModalElement;

  private dismissTimer: NodeJS.Timeout = null;
  private shouldShowImagePickerButton: boolean;

  @Element() element: HTMLGxImagePickerElement;

  /**
   * This attribute lets you specify the alternative text.
   */
  @Prop({ mutable: true, reflect: true }) alt = "";

  /**
   * If true, the component will be sized to match the image's intrinsic size when not constrained
   * via CSS dimension properties (for example, height or width).
   * If false, the component will never force its height to match the image's intrinsic size. The width, however,
   * will match the intrinsic width. In GeneXus terms, it will auto grow horizontally, but not vertically.
   */
  @Prop() readonly autoGrow = true;

  /**
   * A CSS class to set as the `gx-image-picker` element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * This attribute lets you specify if the element is disabled.
   * If disabled, it will not fire any user interaction related event
   * (for example, click event).
   */
  @Prop() readonly disabled = false;

  /**
   * This attribute lets you specify how this element will behave when hidden.
   *
   * | Value        | Details                                                                     |
   * | ------------ | --------------------------------------------------------------------------- |
   * | `keep-space` | The element remains in the document flow, and it does occupy space.         |
   * | `collapse`   | The element is removed form the document flow, and it doesn't occupy space. |
   */
  @Prop() readonly invisibleMode: "collapse" | "keep-space" = "collapse";

  /**
   * True to lazy load the image, when it enters the viewport.
   */
  @Prop() readonly lazyLoad = true;

  /**
   * This attribute lets you specify the low resolution image SRC.
   */
  @Prop() readonly lowResolutionSrc = "";

  /**
   * This attribute allows specifing how the image is sized according to its container.
   * `contain`, `cover`, `fill` and `none` map directly to the values of the CSS `object-fit` property.
   * The `tile` value repeats the image, both vertically and horizontally, creating a tile effect.
   */
  @Prop({ mutable: true }) scaleType:
    | "contain"
    | "cover"
    | "fill"
    | "none"
    | "tile";

  /**
   * This attribute lets you specify the SRC.
   */
  @Prop({ mutable: true }) src = "";

  /**
   * True to highlight control when an action is fired.
   */
  @Prop() readonly highlightable = false;

  /**
   * This attribute lets you specify if the image is readonly.
   * If readonly, it will not allow to use the edit button.
   * In fact, the edit button will not be shown.
   */
  @Prop() readonly readonly = false;

  /**
   * This attribute lets you specify the modal title.
   */
  @Prop() readonly modalTitle = null;

  /**
   * This attribute lets you specify the description of the
   * change image button in the modal.
   */
  @Prop() readonly changeButtonText = "Change image";

  /**
   * This attribute lets you specify the description of the
   * remove image button in the modal.
   */
  @Prop() readonly removeButtonText = "Remove image";

  /**
   * This attribute lets you specify the description of the
   * cancel action button in the modal.
   */
  @Prop() readonly cancelButtonText = "CANCEL";

  /**
   * This attribute lets you specify the current state of the gx-image-picker.
   *
   * | Value               | Details                                                                                      |
   * | ------------------- | -------------------------------------------------------------------------------------------- |
   * | `readyToUse`        | Allows you to choose, change or remove an image.                                             |
   * | `fileReadyToUpload` | It is set only after an image has been selected or changed, not removed.                     |
   * | `uploadingFile`     | It is set by the parent control to specifies when the image is being uploaded to the server. |
   *
   * `fileReadyToUpload` and `uploadingFile` will not allow you to change or remove the current image.
   */
  @Prop() state: "readyToUse" | "fileReadyToUpload" | "uploadingFile" =
    "readyToUse";

  /**
   * Fired when the image is clicked
   */
  @Event() click: EventEmitter;

  /**
   * Fired when the image is changed
   */
  @Event() onImageChanged: EventEmitter<File>;

  @State() renderModalElements = false;

  private stopPropagation(event: UIEvent) {
    event.stopPropagation();
  }

  // Emits the image click event
  private clickImageAction = (event: MouseEvent) => {
    this.click.emit(event);
  };

  // If there is no image, this directly opens the File System to select an image.
  // In othercase, this allows to change or remove the image
  private triggerAction = (event: MouseEvent) => {
    if (this.src === "") {
      this.input.click();
    } else {
      clearTimeout(this.dismissTimer);
      this.renderModalElements = true;
      this.modal.opened = true;
    }
    event.stopPropagation();
  };

  private clearImageAction = () => {
    this.input.value = "";
    this.src = "";
    this.alt = "";

    this.onImageChanged.emit(null);
    this.closeAction();
  };

  // When the modal closes
  private closeAction = () => {
    this.modal.opened = false;

    this.dismissTimer = setTimeout(() => {
      this.renderModalElements = false;
    }, 300);
  };

  private getFileNameWithoutExtension(fileName: string) {
    const index = fileName.lastIndexOf(".");
    if (index === -1) {
      return fileName;
    } else {
      return fileName.substring(0, index);
    }
  }

  // When the file is selected
  private fileSelectedAction = () => {
    const elem = this.element;
    const file = this.input.files[0];

    // This allows to catch an error when the user select a filename, but then
    // cancels the operation
    if (file == null) {
      return;
    }
    this.state = "fileReadyToUpload";
    this.alt = this.getFileNameWithoutExtension(file.name);

    this.reader.addEventListener(
      "load",
      function() {
        // Convert image file to base64 string
        elem.src = this.result.toString();
      },
      false
    );
    this.reader.readAsDataURL(file);

    this.closeAction();
    this.onImageChanged.emit(file);
  };

  // SVG used to print the search image button
  private getSearchPlusSolidSVG(): any {
    return (
      <svg viewBox="3 2 20 20">
        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        <path d="M0 0h24v24H0z" fill="none" />
      </svg>
    );
  }

  // SVG used to print the change image button
  private getPencilAltSolidSVG(): any {
    return (
      <svg viewBox="0 -35 570 570">
        <path
          fill="black"
          d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z"
        ></path>
      </svg>
    );
  }

  // SVG used to display when an image is being uploaded to the server
  private getLoadingSVG(): any {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="5 5 40 40">
        <path
          fill="rgba(96, 96, 96, 0.6)"
          d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"
        >
          <animateTransform
            attributeType="xml"
            attributeName="transform"
            type="rotate"
            from="0 25 25"
            to="360 25 25"
            dur="0.6s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    );
  }

  componentWillLoad() {
    this.shouldShowImagePickerButton = !this.readonly;
  }

  render() {
    return (
      <Host onClick={this.stopPropagation}>
        <gx-image
          alt={this.alt}
          autoGrow={this.autoGrow}
          cssClass={this.cssClass}
          disabled={this.disabled}
          invisibleMode={this.invisibleMode}
          lazyLoad={this.lazyLoad}
          lowResolutionSrc={this.lowResolutionSrc}
          scaleType={this.scaleType}
          showImagePickerButton={this.shouldShowImagePickerButton}
          src={this.src}
          highlightable={this.highlightable}
          onClick={this.clickImageAction}
        >
          {this.shouldShowImagePickerButton && (
            <div
              class="image-picker-state-container"
              onClick={this.stopPropagation}
            >
              {this.state != "uploadingFile" ? (
                <button
                  class="image-picker-button"
                  disabled={this.disabled || this.state == "fileReadyToUpload"}
                  onClick={this.triggerAction}
                >
                  {this.src === ""
                    ? this.getSearchPlusSolidSVG()
                    : this.getPencilAltSolidSVG()}
                </button>
              ) : (
                this.getLoadingSVG()
              )}
            </div>
          )}
        </gx-image>
        <gx-modal
          onClose={this.closeAction}
          onClick={this.stopPropagation}
          ref={el => (this.modal = el as HTMLGxModalElement)}
        >
          <div class="body-container" slot="body">
            <label class="picker-container">
              <input
                role="button"
                aria-label={this.changeButtonText}
                class="file-picker"
                type="file"
                accept="image/*"
                onChange={this.fileSelectedAction}
                ref={el => (this.input = el as HTMLInputElement)}
              />
              <svg
                aria-hidden="true"
                class="download"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1200 1200"
              >
                <path d="M0,1037.516h1200V1200H0V1037.516z M820.785,0h-441.57v496.632H103.233  L600,959.265l496.768-462.633H820.785V0z" />
              </svg>
              <span aria-hidden="true" class="custom-file-picker">
                {this.changeButtonText}
              </span>
            </label>
            {this.renderModalElements && (
              <button
                class="remove-image-button"
                type="button"
                onClick={this.clearImageAction}
              >
                <svg
                  aria-hidden="true"
                  class="trash-can"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M 10 2 L 9 3 L 5 3 C 4.448 3 4 3.448 4 4 C 4 4.552 4.448 5 5 5 L 7 5 L 17 5 L 19 5 C 19.552 5 20 4.552 20 4 C 20 3.448 19.552 3 19 3 L 15 3 L 14 2 L 10 2 z M 5 7 L 5 20 C 5 21.105 5.895 22 7 22 L 17 22 C 18.105 22 19 21.105 19 20 L 19 7 L 5 7 z" />
                </svg>
                {this.removeButtonText}
              </button>
            )}
          </div>

          {this.renderModalElements && [
            // The header is below the body slot, because Stencil's
            // optimizations cause some issues when removing this element
            <span slot="header">
              {this.modalTitle === null ? document.title : this.modalTitle}
            </span>,
            <button
              class="cancel-button"
              type="button"
              slot="secondary-action"
              onClick={this.closeAction}
            >
              {this.cancelButtonText}
            </button>
          ]}
        </gx-modal>
      </Host>
    );
  }
}
