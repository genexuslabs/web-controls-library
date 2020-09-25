import { Component, ComponentInterface, h, Host, Prop } from "@stencil/core";

const EMPTY_IMAGE_CLASS = "empty-image";
const EMPTY_TEXT_CLASS = "empty-text";

@Component({
  shadow: false,
  styleUrl: "grid-empty-indicator.scss",
  tag: "gx-grid-empty-indicator"
})
export class GridEmptyIndicator implements ComponentInterface {
  @Prop() readonly text = "";
  @Prop() readonly textClass = "";
  @Prop() readonly image = "";
  @Prop() readonly imageClass = "";

  render() {
    return (
      <Host>
        <gx-canvas>
          {this.image ? (
            <gx-canvas-cell class={EMPTY_IMAGE_CLASS}>
              {/* 
              // @ts-ignore */}
              <gx-image src={this.image} class={this.imageClass}></gx-image>
            </gx-canvas-cell>
          ) : null}

          {this.text ? (
            <gx-canvas-cell class={EMPTY_TEXT_CLASS}>
              <gx-textblock class={this.textClass}>{this.text}</gx-textblock>
            </gx-canvas-cell>
          ) : null}
        </gx-canvas>
      </Host>
    );
  }
}
