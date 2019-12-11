import { Component, Element, Prop, h, Host } from "@stencil/core";
import { ProgressBarRender } from "../renders/bootstrap/progress-bar/progress-bar-render";
import { Component as GxComponent } from "../common/interfaces";
@Component({
  shadow: false,
  styleUrl: "progress-bar.scss",
  tag: "gx-progress-bar"
})
export class ProgressBar implements GxComponent {
  constructor() {
    this.renderer = new ProgressBarRender(this);
  }

  @Element() element: HTMLGxProgressBarElement;

  private renderer: ProgressBarRender;
  /**
   * Sets the progress value.
   *
   */
  @Prop() readonly value: number;

  render() {
    return (
      <Host role="progressbar">
        {this.renderer.render({ default: <slot /> })}
      </Host>
    );
  }
}
