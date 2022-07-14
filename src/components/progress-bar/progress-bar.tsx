import { Component, Element, Host, Prop, h } from "@stencil/core";
import { Component as GxComponent } from "../common/interfaces";
@Component({
  shadow: false,
  styleUrl: "progress-bar.scss",
  tag: "gx-progress-bar"
})
export class ProgressBar implements GxComponent {
  @Element() element: HTMLGxProgressBarElement;

  /**
   * Sets the progress value.
   *
   */
  @Prop() readonly value: number;

  render() {
    return <Host></Host>;
  }
}
