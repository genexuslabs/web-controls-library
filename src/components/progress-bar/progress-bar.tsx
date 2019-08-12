import { Component, Element, Prop, h } from "@stencil/core";
import { ProgressBarRender } from "../renders/bootstrap/progress-bar/progress-bar-render";
import { IComponent } from "../common/interfaces";
@Component({
  shadow: false,
  styleUrl: "progress-bar.scss",
  tag: "gx-progress-bar"
})
export class ProgressBar implements IComponent {
  constructor() {
    this.renderer = new ProgressBarRender(this);
  }

  @Element() element;

  private renderer: ProgressBarRender;
  /**
   * Sets the progress value.
   *
   */
  @Prop() value: number;

  hostData() {
    return {
      role: "progressbar"
    };
  }
  render() {
    return this.renderer.render({ default: <slot /> });
  }
}
