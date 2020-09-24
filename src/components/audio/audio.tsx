import { Component, Element, Prop, h } from "@stencil/core";
import {
  DisableableComponent,
  Component as GxComponent
} from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "./audio.scss",
  tag: "gx-audio"
})
export class Audio implements GxComponent, DisableableComponent {
  @Element() element: HTMLGxAudioElement;

  /**
   * This attribute lets you specify if the element is disabled.
   */
  @Prop() readonly disabled = false;

  /**
   * This attribute is for specifies the src of the audio.
   */
  @Prop() readonly src: string;

  render() {
    return (
      <audio
        class={{ disabled: this.disabled }}
        controls
        src={this.src}
      ></audio>
    );
  }
}
