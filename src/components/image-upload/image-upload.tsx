import {
  Component,
  Element,
  Event,
  EventEmitter,
  Host,
  Prop,
  h
} from "@stencil/core";

import { Component as GxComponent } from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "image-upload.scss",
  tag: "gx-image-upload"
})
export class ImageUpload implements GxComponent {
  @Element() element: HTMLGxImageUploadElement;

  /**
   * This attribute lets you specify the alternative text.
   */
  @Prop({ reflect: true }) alt = "";

  /**
   * If true, the component will be sized to match the image's intrinsic size when not constrained
   * via CSS dimension properties (for example, height or width).
   * If false, the component will never force its height to match the image's intrinsic size. The width, however,
   * will match the intrinsic width. In GeneXus terms, it will auto grow horizontally, but not vertically.
   */
  @Prop() readonly autoGrow = true;

  /**
   * This attribute lets you specify if the element is disabled.
   * If disabled, it will not fire any user interaction related event
   * (for example, click event).
   */
  @Prop() readonly disabled = false;

  /**
   * This attribute lets you specify the height.
   */
  @Prop() readonly height: string;

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
  @Prop({ reflect: true }) src = "";

  /**
   * This attribute lets you specify the width.
   */
  @Prop({ mutable: true }) width: string;

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
  @Prop() readonly changeButtonText = "Change image...";

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
   * Fired when the image is clicked
   */
  @Event() click: EventEmitter;

  /**
   * Fired when the image is changed
   */
  @Event() onImageChanged: EventEmitter<File>;

  // Used to read the images
  private reader = new FileReader();

  private input: HTMLInputElement;

  private modal: HTMLGxModalElement;

  private stopPropagation(event: UIEvent) {
    event.stopPropagation();
  }

  // Emits the image click event
  private clickImageAction = (event: MouseEvent) => {
    this.click.emit(event);
  };

  // If there is no image, this directly opens the File System to select an image.
  // In othercase, this allows to change or remove the image
  private triggerAction = () => {
    if (this.src === "") {
      this.input.click();
    } else {
      this.modal.opened = true;
    }
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

  render() {
    return (
      <Host>
        <div class="click-capture" onClick={this.stopPropagation}>
          <div class="image-viewer">
            <gx-image
              class="image-viewer-image"
              alt={this.alt}
              autoGrow={this.autoGrow}
              disabled={this.disabled}
              height={this.height}
              invisibleMode={this.invisibleMode}
              lazyLoad={this.lazyLoad}
              lowResolutionSrc={this.lowResolutionSrc}
              scaleType={this.scaleType}
              src={this.src}
              width={this.width}
              highlightable={this.highlightable}
              onClick={this.clickImageAction}
            >
              {!this.readonly && (
                <div
                  class={{
                    "button-edit-container": true,
                    bottom: this.src !== ""
                  }}
                >
                  <button
                    class="image-edit"
                    disabled={this.disabled}
                    onClick={this.triggerAction}
                  >
                    {this.src === ""
                      ? this.getSearchPlusSolidSVG()
                      : this.getPencilAltSolidSVG()}
                  </button>
                </div>
              )}
            </gx-image>
          </div>
          <gx-modal
            class="action-dialog"
            ref={el => (this.modal = el as HTMLGxModalElement)}
          >
            <div slot="header">
              {this.modalTitle === null ? document.title : this.modalTitle}
            </div>
            <div class="body-container" slot="body">
              <label class="file">
                <input
                  type="file"
                  onChange={this.fileSelectedAction}
                  ref={el => (this.input = el as HTMLInputElement)}
                />
                <span class="file-custom">{this.changeButtonText}</span>
              </label>
              <gx-button class="remove-button" onClick={this.clearImageAction}>
                {this.removeButtonText}
              </gx-button>
            </div>
            <div slot="secondary-action">
              <gx-button class="cancel-button" onClick={this.closeAction}>
                {this.cancelButtonText}
              </gx-button>
            </div>
          </gx-modal>
        </div>
      </Host>
    );
  }
}
