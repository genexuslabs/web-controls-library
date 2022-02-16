import { Component, ComponentInterface, h, Host, Prop } from "@stencil/core";

const EMPTY_IMAGE_CLASS = "empty-image";
const EMPTY_TEXT_CLASS = "empty-text";

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
   * Image url to be shown
   */
  @Prop() readonly image = "";

  /**
   * A CSS class to set as the inner `image` element class.
   */
  @Prop() readonly imageClass = "";

  render() {
    return (
      <Host>
        <gx-canvas>
          {this.image && (
            <gx-canvas-cell class={EMPTY_IMAGE_CLASS}>
              <gx-image src={this.image} class={this.imageClass}></gx-image>
            </gx-canvas-cell>
          )}

          {this.text && (
            <gx-canvas-cell class={EMPTY_TEXT_CLASS}>
              <gx-textblock class={this.textClass}>{this.text}</gx-textblock>
            </gx-canvas-cell>
          )}
        </gx-canvas>
      </Host>
    );
  }
}
