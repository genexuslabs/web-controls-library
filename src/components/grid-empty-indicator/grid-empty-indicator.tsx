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
      <Host class="gx-empty-indicator">
        {this.image && (
          <div class="gx-empty-item">
            <gx-image cssClass={this.imageClass} src={this.image}></gx-image>
          </div>
        )}

        {this.text && (
          <div class="gx-empty-item">
            <gx-textblock cssClass={this.textClass}>{this.text}</gx-textblock>{" "}
          </div>
        )}
      </Host>
    );
  }
}
