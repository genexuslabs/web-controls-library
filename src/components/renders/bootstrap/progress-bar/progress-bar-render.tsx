import { h } from "@stencil/core";
import { Renderer } from "../../../common/interfaces";
import { ProgressBar } from "../../../progress-bar/progress-bar";

export class ProgressBarRender implements Renderer {
  constructor(private component: ProgressBar) {}

  render(slots) {
    return [
      <gx-bootstrap />,
      <div class="progress">
        <div
          class="progress-bar progress-bar-striped progress-bar-animated bg-primary"
          style={{ width: this.component.value + "%" }}
          aria-valuenow={this.component.value}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          {slots.default}
        </div>
      </div>
    ];
  }
}
