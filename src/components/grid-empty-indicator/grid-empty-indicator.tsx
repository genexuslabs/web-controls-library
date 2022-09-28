import { Component, ComponentInterface, h, Host, Prop } from "@stencil/core";

@Component({
  shadow: false,
  styleUrl: "grid-empty-indicator.scss",
  tag: "gx-grid-empty-indicator"
})
export class GridEmptyIndicator implements ComponentInterface {
  /**
   * Text to be displayed
   */
  @Prop() readonly text = "";

  /**
   * A CSS class to set as the inner `text` element class.
   */
  @Prop() readonly textClass = "";

  /**
   * This attribute lets you specify the `src` of the image to be shown.
   */
  @Prop() readonly image = "";

  /**
   * This attribute lets you specify the `srcset` of the image to be shown.
   */
  @Prop() readonly imageSet = "";

  /**
   * A CSS class to set as the inner `image` element class.
   */
  @Prop() readonly imageClass = "";

  render() {
    return (
      <Host class="gx-empty-indicator">
        {(this.imageSet || this.image) && (
          <div class="gx-empty-item">
            <gx-image
              cssClass={this.imageClass}
              src={this.image}
              srcset={this.imageSet}
            ></gx-image>
          </div>
        )}

        {this.text && (
          <div class="gx-empty-item">
            <gx-textblock cssClass={this.textClass}>{this.text}</gx-textblock>
          </div>
        )}
      </Host>
    );
  }
}
