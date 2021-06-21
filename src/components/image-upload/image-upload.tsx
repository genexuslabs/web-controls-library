import {
  Component,
  Element,
  Event,
  EventEmitter,
  Host,
  // Listen,
  Prop,
  // State,
  h
} from "@stencil/core";

import { Component as GxComponent } from "../common/interfaces";

@Component({
  shadow: false, // Later, see what its use is for
  styleUrl: "image-upload.scss",
  tag: "gx-image-upload"
})
export class ImageUpload implements GxComponent {
  @Element() element: HTMLGxImageUploadElement;

  /**
   * This attribute lets you specify the SRC.
   */
  @Prop() readonly src = "";

  /**
   * This attribute lets you specify the alternative text.
   */
  @Prop() readonly alt = "";

  /**
   * This attribute lets you specify if the element is disabled.
   * If disabled, it will not fire any user interaction related event
   * (for example, click event).
   */
  @Prop() readonly disabled = false;

  /**
   * Needs a description
   */
  @Prop() readonly readonly = false;

  /**
   * Needs a description
   */
  @Prop() readonly modalTitle = null;

  /**
   * Needs a description
   */
  @Prop() readonly changeButtonText = "Change image...";

  /**
   * Needs a description
   */
  @Prop() readonly removeButtonText = "Remove image";

  /**
   * Needs a description
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

  private stopPropagation(event: UIEvent) {
    event.stopPropagation();
  }

  private clickImageAction(event: MouseEvent) {
    this.click.emit(event);
  }

  // If there is no image, this directly opens the File System to select an image.
  // In othercase, this allows to change or remove the image
  private triggerAction = () => {
    if (this.src === "") {
      this.element.querySelector("input").click();
    } else {
      this.element.querySelector("gx-modal").setAttribute("opened", "true");
    }
  };

  private clearImageAction = () => {
    this.element.setAttribute("src", "");
    this.element.setAttribute("alt", "");
    this.element.querySelector(".svgSearch").setAttribute("class", "");

    this.onImageChanged.emit(null);
    this.closeAction();
  };

  // When the modal closes
  private closeAction = () => {
    console.log("closing modal");

    this.element.querySelector("gx-modal").setAttribute("opened", "false");
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
    this.closeAction();
    const elem = this.element;
    const file = elem.querySelector("input").files[0];
    const alt = this.getFileNameWithoutExtension(file.name);

    this.reader.addEventListener(
      "load",
      function() {
        // Convert image file to base64 string
        elem.setAttribute("src", this.result.toString());
        elem.setAttribute("alt", alt);
      },
      false
    );
    this.reader.readAsDataURL(file);
    this.element.querySelector(".svgSearch").setAttribute("class", "disabled");

    this.onImageChanged.emit(file);
  };

  private getLookupSVG(): any {
    return (
      <svg viewBox="0 0 27 27" id="svgSearch">
        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        <path d="M0 0h24v24H0z" fill="none" />
      </svg>
    );
  }

  render() {
    console.log(`Rendering with\n   src: ${this.src}\n   alt: ${this.alt}`);

    return (
      <Host>
        <div class="click-capture" onClick={this.stopPropagation}>
          <div class="image-viewer">
            {/* <img> </img> */}
            <gx-image
              // class="image-viewer-image"
              src={this.src}
              alt={this.alt}
              disabled={this.disabled}
              onClick={this.clickImageAction}
            ></gx-image>
            <div class="button-edit-container">
              <button
                class={{
                  "image-edit": true,
                  disabled: this.readonly
                }}
                disabled={this.disabled}
                onClick={this.triggerAction}
              >
                {this.getLookupSVG()}
              </button>
            </div>
          </div>
          <gx-modal
            // onClose={
            // this.closeAction // What's the purpose of using this?
            // }
            class="action-dialog"
          >
            <div slot="header">
              {this.modalTitle === null ? document.title : this.modalTitle}
            </div>
            <div class="bodyContainer" slot="body">
              <label class="file">
                <input type="file" onChange={this.fileSelectedAction} />
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
