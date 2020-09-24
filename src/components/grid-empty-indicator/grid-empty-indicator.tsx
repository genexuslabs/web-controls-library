import { Component, ComponentInterface, h, Host, Prop } from "@stencil/core";

const EMPTY_IMAGE_CLASS = "empty-image";
const EMPTY_TEXT_CLASS = "empty-text";

@Component({
  shadow: false,
  styleUrl: "grid-empty-indicator.scss",
  tag: "gx-grid-empty-indicator"
})
export class GridEmptyIndicator implements ComponentInterface {
  @Prop() readonly emptyGridText: string;
  @Prop() readonly emptyGridTextClass: string;
  @Prop() readonly emptyGridBackgroundImage: string;
  @Prop() readonly emptyGridBackgroundClass: string;

  render() {
    return (
      <Host>
        <gx-canvas>
          {this.emptyGridText ? (
            <gx-canvas-cell class={EMPTY_IMAGE_CLASS}>
              {/* 
              // @ts-ignore */}
              <gx-image
                src={this.emptyGridBackgroundImage}
                class={this.emptyGridBackgroundClass}
              ></gx-image>
            </gx-canvas-cell>
          ) : null}

          {this.emptyGridBackgroundImage ? (
            <gx-canvas-cell class={EMPTY_TEXT_CLASS}>
              <gx-textblock class={this.emptyGridTextClass}>
                {this.emptyGridText}
              </gx-textblock>
            </gx-canvas-cell>
          ) : null}
        </gx-canvas>
      </Host>
    );
  }
}
