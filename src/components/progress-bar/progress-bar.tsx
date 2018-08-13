import { BaseComponent } from "../common/base-component";
import { ProgressBarRender } from "../renders/bootstrap/progress-bar/progress-bar-render";
import { Component, Prop } from "@stencil/core";
@Component({
  host: {
    role: "progressbar"
  },
  shadow: false,
  styleUrl: "progress-bar.scss",
  tag: "gx-progress-bar"
})
export class ProgressBar extends ProgressBarRender(BaseComponent) {
  /**
   * Sets the progress value.
   *
   */
  @Prop() value: number;
}
