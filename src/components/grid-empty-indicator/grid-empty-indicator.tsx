import { Component, ComponentInterface, h, Host, Prop } from "@stencil/core";
import { JSXBase } from "@stencil/core/internal";

@Component({
  shadow: false,
  styleUrl: "grid-empty-indicator.scss",
  tag: "gx-grid-empty-indicator"
})
export class GridEmptyIndicator implements ComponentInterface {
  /**
   * This attribute defines if the control size will grow automatically,
   * to adjust to its content size.
   */
  @Prop() readonly autoGrow: boolean = false;

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

  private renderItem = (item: JSXBase.HTMLAttributes<any>) =>
    this.autoGrow ? item : <div class="gx-empty-item">{item}</div>;

  render() {
    return (
      <Host
        class={{
          "gx-empty-indicator": !this.autoGrow,
          "gx-empty-indicator--auto-grow": this.autoGrow
        }}
      >
        {(this.imageSet || this.image) &&
          this.renderItem(
            <gx-image
              cssClass={this.imageClass}
              src={this.image}
              srcset={this.imageSet}
            ></gx-image>
          )}

        {this.text &&
          this.renderItem(
            <gx-textblock cssClass={this.textClass}>{this.text}</gx-textblock>
          )}
      </Host>
    );
  }
}
