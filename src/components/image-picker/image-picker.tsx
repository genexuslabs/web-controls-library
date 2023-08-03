import {
  Component,
  Element,
  Event,
  EventEmitter,
  Host,
  Prop,
  State,
  Watch,
  h
} from "@stencil/core";

import { Component as GxComponent } from "../common/interfaces";

import { AccessibleNameComponent } from "../../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "image-picker.scss",
  tag: "gx-image-picker"
})
export class ImagePicker implements GxComponent, AccessibleNameComponent {
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
   * Specifies a short string, typically 1 to 3 words, that authors associate
   * with an element to provide users of assistive technologies with a label
   * for the element.
   */
  @Prop() readonly accessibleName: string;

  /**
   * If true, the component will be sized to match the image's intrinsic size when not constrained
   * via CSS dimension properties (for example, height or width).
   * If false, the component will never force its height to match the image's intrinsic size. The width, however,
   * will match the intrinsic width. In GeneXus terms, it will auto grow horizontally, but not vertically.
   */
  @Prop() readonly autoGrow: boolean = true;

  /**
   * A CSS class to set as the `gx-image-picker` element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * This attribute lets you specify if the element is disabled.
   * If disabled, it will not fire any user interaction related event
   * (for example, click event).
   */
  @Prop() readonly disabled: boolean = false;

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
  @Prop() readonly lazyLoad: boolean = true;

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
   * This attribute lets you specify the `src` of the `img`.
   */
  @Prop({ mutable: true }) src = "";

  /**
   * True to highlight control when an action is fired.
   */
  @Prop() readonly highlightable: boolean = false;

  /**
   * This attribute lets you specify if the image is readonly.
   * If readonly, it will not allow to use the edit button.
   * In fact, the edit button will not be shown.
   */
  @Prop() readonly readonly: boolean = false;

  /**
   * This attribute lets you specify the modal title.
   */
  @Prop() readonly modalTitle: string = null;

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
   * This attribute lets you specify the `srcset` of the `img`. The `srcset`
   * attribute defines the set of images we will allow the browser to choose
   * between, and what size each image is. Each set of image information is
   * separated from the previous one by a comma.
   */
  @Prop({ mutable: true }) srcset = "";

  /**
   * This attribute lets you specify the current state of the gx-image-picker.
   *
   * | Value               | Details                                                                                   |
   * | ------------------- | ----------------------------------------------------------------------------------------- |
   * | `readyToUse`        | Allows you to choose, change or remove an image.                                          |
   * | `uploadingFile`     | It is set by the gx-image-picker control when the `reader` is loading the selected image. |
   *
   * `uploadingFile` will not allow you to change or remove the current image.
   */
  @Prop({ mutable: true }) state: "readyToUse" | "uploadingFile" = "readyToUse";

  /**
   * Fired when the image is clicked
   */
  @Event() click: EventEmitter;

  /**
   * Fired when the image is changed
   */
  @Event() onImageChanged: EventEmitter<File>;

  @State() renderModalElements = false;

  /**
   * When the src changes its value, the input value is no longer valid
   */
  @Watch("src")
  handleSrcChange() {
    // In some cases the Watch method is executed before the component renders,
    // so we need to check the definition of "this.input"
    if (!!this.input) {
      this.input.value = "";
    }
  }

  /**
   * When the srcset changes its value, the input value is no longer valid
   */
  @Watch("srcset")
  handleSrcsetChange() {
    if (!!this.input) {
      this.input.value = "";
    }
  }

  private stopPropagation(event: UIEvent) {
    event.stopPropagation();
  }

  // Emits the image click event
  private clickImageAction = (event: MouseEvent) => {
    this.click.emit(event);
  };

  /**
   * If there is no image, this directly opens the File System to select an image.
   * Otherwise, this allows to change or remove the image.
   */
  private triggerAction = (event: MouseEvent) => {
    if (this.emptySrc()) {
      this.input.click();
    } else {
      clearTimeout(this.dismissTimer);
      this.renderModalElements = true;
      this.modal.opened = true;
    }
    event.stopPropagation();
  };

  private emptySrc(): boolean {
    return !this.srcset && !this.src;
  }

  private clearImageAction = () => {
    this.input.value = "";
    this.src = "";
    this.srcset = "";
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
    const file = this.input.files[0];

    // This allows to catch an error when the user select a filename, but then
    // cancels the operation
    if (file == null) {
      return;
    }
    // Start converting the image file to base64
    this.state = "uploadingFile";

    this.alt = this.getFileNameWithoutExtension(file.name);
    this.reader.readAsDataURL(file);

    this.closeAction();
    this.onImageChanged.emit(file);
  };

  // SVG used to print the search image button
  private getSearchPlusSolidSVG(): any {
    return (
      <svg
        class="image-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M5.70821345,5.73660301 C7.38668916,4.04663089 9.91888939,3.53618808 12.1210095,4.4439068 C14.3231297,5.35162552 15.7601123,7.49817411 15.7601674,9.88004029 C15.7629418,11.0873594 15.3888889,12.2654513 14.6901674,13.2500403 L14.6901674,13.2500403 L19.0401674,17.5900403 C19.3007187,17.8187734 19.3317557,18.2133861 19.1101674,18.4800403 L19.1101674,18.4800403 L18.2401674,19.3500403 C17.9874191,19.5977832 17.5829157,19.5977832 17.3301674,19.3500403 L17.3301674,19.3500403 L12.9201674,14.9400403 C12.014476,15.4837576 10.9765056,15.7674695 9.92016742,15.7600403 C7.53835636,15.7762435 5.38204913,14.3539464 4.4593202,12.1580735 C3.53659126,9.96220058 4.02973773,7.42657513 5.70821345,5.73660301 Z M9.88023584,5.50014279 C7.46515257,5.50563046 5.51016742,7.4649508 5.51016742,9.88004029 C5.51016742,11.0469051 5.97571888,12.1655459 6.8036281,12.987823 C7.63153732,13.8101002 8.75333,14.2680325 9.92016742,14.2600403 C12.3352003,14.2434986 14.2811309,12.2752416 14.2701684,9.86017719 C14.2591129,7.4451128 12.2953191,5.49467812 9.88023584,5.50014279 Z" />
      </svg>
    );
  }

  // SVG used to print the change image button
  private getPencilAltSolidSVG(): any {
    return (
      <svg
        class="image-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M5.58,14.38 L9.58,18.38 L4.77,19.23 L5.58,14.38 Z M13.31,6.66 L17.3,10.65 L10.64,17.32 L6.64,13.32 L13.31,6.66 Z M15.95,4.64302445 C16.3442299,4.64302445 16.722168,4.80030987 17,5.08 L17,5.08 L18.84,6.94 C19.3860552,7.51810735 19.3860552,8.42189265 18.84,9 L18.84,9 L18.39,9.6 L14.39,5.6 L14.9,5.08 C15.177832,4.80030987 15.5557701,4.64302445 15.95,4.64302445 Z" />
      </svg>
    );
  }

  componentWillLoad() {
    this.shouldShowImagePickerButton = !this.readonly;
  }

  componentDidLoad() {
    const elem = this.element;

    this.reader.addEventListener(
      "load",
      function () {
        // Convert image file to base64 string
        elem.src = this.result.toString();

        // Remove srcset to start using the image loaded in the src
        elem.srcset = "";

        // Conversion of image file to base64 has ended
        elem.state = "readyToUse";
      },
      false
    );
  }

  render() {
    return (
      <Host onClick={this.stopPropagation}>
        <gx-image
          accessibleName={this.accessibleName}
          alt={this.alt}
          autoGrow={this.autoGrow}
          cssClass={this.cssClass}
          disabled={this.disabled}
          invisibleMode={this.invisibleMode}
          lazyLoad={this.lazyLoad}
          scaleType={this.scaleType}
          showImagePickerButton={this.shouldShowImagePickerButton}
          src={this.src}
          srcset={this.srcset}
          highlightable={this.highlightable}
          onClick={this.clickImageAction}
        >
          {this.shouldShowImagePickerButton && (
            <div
              class="image-picker-state-container"
              onClick={this.stopPropagation}
            >
              {this.state !== "uploadingFile" ? (
                <button
                  class="image-picker-button"
                  disabled={this.disabled}
                  onClick={this.triggerAction}
                >
                  {this.emptySrc()
                    ? this.getSearchPlusSolidSVG()
                    : this.getPencilAltSolidSVG()}
                </button>
              ) : (
                <div class="loading-image"></div>
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
