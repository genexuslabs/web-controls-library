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
        {this.image && (
          <div class="empty-indicator-item">
            <gx-image src={this.image} class={this.imageClass}></gx-image>
          </div>
        )}

        {this.text && (
          <div class="empty-indicator-item">
            <gx-textblock class={this.textClass}>{this.text}</gx-textblock>
          </div>
        )}
      </Host>
    );
  }
}
