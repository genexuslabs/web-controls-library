import { BaseComponent } from "../common/base-component";
import { ProgressBarRender } from "../renders/bootstrap/progress-bar/progress-bar-render";
import { Component, Prop } from "@stencil/core";
@Component({
  tag: "gx-progress-bar",
  styleUrl: "progress-bar.scss",
  host: {
    role: "progressbar"
  },
  shadow: false
})
export class ProgressBar extends ProgressBarRender(BaseComponent) {
  /**
   * Sets the progress value.
   *
   */
  @Prop() value: number;
}
