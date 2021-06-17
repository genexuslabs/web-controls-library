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

  private uploading: false;

  // When the modal is opened
  private triggerAction = () => {
    this.element.querySelector("gx-modal").setAttribute("opened", "true");
  };

  // When the modal closes
  private closeAction = () => {
    this.element.querySelector("gx-modal").setAttribute("opened", "false");
  };

  private getLoadingAnimation(): any {
    return (
      <svg
        class={{
          "svg-container": true,
          "svg-disabled": !this.uploading
        }}
        version="1.1"
        id="L9"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 100 100"
        enable-background="new 0 0 0 0"
      >
        <path
          fill="#fff"
          d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50"
        >
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            dur="1s"
            from="0 50 50"
            to="360 50 50"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    );
  }

  render() {
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
              <button
                class={{
                  "image-edit": true,
                  "image-disabled": this.readonly && this.uploading
                }}
                disabled={this.disabled}
                onClick={this.triggerAction}
              >
                <img src={urlEdit} />
              </button>
              {this.getLoadingAnimation()}
            </div>
          </div>
          <gx-modal
            onClose={
              this.closeAction // I think this won't be necessary
            }
            class="action-dialog"
          >
            <div slot="header">aasdasdasdasdsd{/* {{ modalTitle }} */}</div>

            <div
              slot="body"
              style={{
                display: "flex",
                "justify-content": "space-around"
              }}
            >
              <label class="select-file">
                <span>Cambiar imagen</span>{" "}
                {/*  {'Change image' | translate} */}
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
