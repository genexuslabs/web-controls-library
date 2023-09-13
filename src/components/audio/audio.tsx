import { Component, Element, Prop, h } from "@stencil/core";
import {
  DisableableComponent,
  Component as GxComponent
} from "../common/interfaces";

import { AccessibleNameComponent } from "../../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "./audio.scss",
  tag: "gx-audio"
})
export class Audio
  implements GxComponent, AccessibleNameComponent, DisableableComponent
{
  @Element() element: HTMLGxAudioElement;

  /**
   * Specifies a short string, typically 1 to 3 words, that authors associate
   * with an element to provide users of assistive technologies with a label
   * for the element.
   */
  @Prop() readonly accessibleName: string;

  /**
   * This attribute lets you specify if the element is disabled.
   */
  @Prop() readonly disabled: boolean = false;

  /**
   * This attribute is for specifies the src of the audio.
   */
  @Prop() readonly src: string;

  render() {
    return (
      <audio
        // Always set aria-label, because "controls" attribute is presented
        aria-label={this.accessibleName}
        class={{ disabled: this.disabled }}
        controls
        src={this.src}
      ></audio>
    );
  }
}
