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
   * Fired when the image is clicked
   */
  @Event() click: EventEmitter;

  /**
   * Fired when the image is changed
   */
  @Event() onImageChanged: EventEmitter<string>;

  private stopPropagation(event: UIEvent) {
    event.stopPropagation();
  }

  private clickImageAction(event: MouseEvent) {
    this.click.emit(event);
  }

  // When the modal is opened
  private triggerAction = () => {
    // Add some logic here to match Angular implementation

    this.element.querySelector("gx-modal").setAttribute("opened", "true");
  };

  private clearImageAction = () => {
    this.element.setAttribute("src", "");
    this.element.querySelector("input").value = "";
    // this.element.setAttribute("alt", "");

    this.onImageChanged.emit("");
    this.closeAction();
  };

  // When the modal closes
  private closeAction = () => {
    console.log("closing modal");

    this.element.querySelector("gx-modal").setAttribute("opened", "false");
  };

  // When the file is selected
  private fileSelectedAction = () => {
    this.closeAction();
    const file = this.element.querySelector("input").files[0];
    const reader = new FileReader();

    const svg = this.element.querySelector("svg");
    const button = this.element.querySelector("button");

    svg.setAttribute("class", "svg-container");
    button.setAttribute("class", "image-edit image-disabled");

    const elem = this.element;
    reader.addEventListener(
      "load",
      function() {
        // convert image file to base64 string
        elem.setAttribute("src", this.result.toString());
      },
      false
    );

    // if (file) {
    reader.readAsDataURL(file);
    // }

    svg.setAttribute("class", "svg-container svg-disabled");
    button.setAttribute("class", "image-edit");
  };

  private getLoadingAnimation(): any {
    return (
      <svg
        class={{
          "svg-container": true,
          "svg-disabled": true
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
    console.log(`Rendering with\n   src: ${this.src}\n   alt: ${this.alt}`);

    return (
      <Host>
        <div class="click-capture" onClick={this.stopPropagation}>
          <div class="image-viewer">
            {/* <img> </img> */}
            <gx-image
              // width="32px"
              // height="32px"
              // class="image-viewer-image"
              src={this.src}
              // alt={this.alt}
              // disabled={this.disabled}
              // onClick={this.clickImageAction}
            ></gx-image>
            <div class="button-edit-container">
              <button
                class={{
                  "image-edit": true,
                  "image-disabled": this.readonly
                }}
                disabled={this.disabled}
                onClick={this.triggerAction}
              >
                {/* <img src={urlEdit} /> */}
              </button>
              {this.getLoadingAnimation()}
            </div>
          </div>
          <gx-modal
            // onClose={
            // this.closeAction // What's the purpose of using this?
            // }
            class="action-dialog"
          >
            <div slot="header">{document.title}</div>

            <div
              slot="body"
              style={{
                display: "flex",
                "justify-content": "space-around"
              }}
            >
              <label class="select-file">
                <span>Change image</span>
                {/*  {'Change image' | translate} */}
                <input type="file" onChange={this.fileSelectedAction} />
              </label>
              <gx-button onClick={this.clearImageAction} class="Button">
                Remove image {/* {{'Remove image' | translate}} */}
              </gx-button>
            </div>
            <div slot="secondary-action">
              <gx-button class="Button" onClick={this.closeAction}>
                GXM_cancel {/* {{'GXM_cancel' | translate}} */}
              </gx-button>
            </div>
          </gx-modal>
        </div>
      </Host>
    );
  }
}
