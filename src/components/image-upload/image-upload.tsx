import {
  Component,
  Element,
  // Event,
  // EventEmitter,
  Host,
  // Listen,
  Prop,
  // State,
  h,
  getAssetPath
} from "@stencil/core";

import { Component as GxComponent } from "../common/interfaces";

@Component({
  shadow: false, // Ver para que es esto
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
   * .
   */
  @Prop() readonly readonly = false;

  //  @Listen("click", { capture: true })
  //  handleClick(event: UIEvent) {
  //    if (this.disabled) {
  //      event.stopPropagation();
  //      return;
  //    }
  //  }

  private show: false;

  render() {
    const urlLoading = getAssetPath("./assets/burger.svg");
    const urlEdit = getAssetPath("./assets/show-more.svg");
    // const urlPromt   = getAssetPath("./assets/arrow-left.svg");

    return (
      <Host>
        <div class="click-capture">
          {/*  (click)="$event.stopPropagation()" */}
          <div class="image-viewer">
            <gx-image
              class="image-viewer-image"
              src={this.src}
              alt={this.alt}
              disabled={this.disabled}
              // (click)="clickImageAction($event)"
            ></gx-image>
            <div class="button-edit-container">
              {this.show}
              <button
                class="image-edit image-disabled"
                // *ngIf="!readonly && !uploading"
                disabled={this.disabled}
                // (click)="triggerAction()">
              >
                <img src={urlEdit} />
              </button>
              <img
                class="image-uploading"
                src={urlLoading}
                // *ngIf="uploading"
              />
            </div>
          </div>
          <gx-modal
            opened={this.show}
            // (onClose)="closeAction()"
            class="action-dialog"
          >
            <div slot="header">{/* {{ modalTitle }} */}</div>

            <div
              slot="body"
              style={{
                display: "flex",
                "justify-content": "space-around"
              }}
            >
              <label class="select-file">
                {/* <span>{{'Change image' | translate}}</span> */}
                <input
                  // #fileInput
                  type="file"
                  // (change)="fileSelectedAction(); closeAction()"
                />
              </label>
              <gx-button
                // (click)="clearImageAction(); closeAction()"
                class="Button"
              >
                {/* {{'Remove image' | translate}} */}
              </gx-button>
            </div>
            <div slot="secondary-action">
              <gx-button
                // (click)="closeAction()"
                class="Button"
              >
                {/* {{'GXM_cancel' | translate}} */}
              </gx-button>
            </div>
          </gx-modal>
        </div>
      </Host>
    );
  }
}
