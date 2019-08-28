import { Component, Element, Prop, h } from "@stencil/core";

import {
  IComponent,
  IDisableableComponent,
  IVisibilityComponent
} from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "./video.scss",
  tag: "gx-video"
})
export class Video
  implements IComponent, IDisableableComponent, IVisibilityComponent {
  @Element() element: HTMLElement;

  /**
   * This attribute lets you specify if the element is disabled.
   * If disabled, it will not fire any user interaction related event
   * (for example, click event).
   */
  @Prop() disabled = false;

  /**
   * This attribute lets you specify how this element will behave when hidden.
   *
   * | Value        | Details                                                                     |
   * | ------------ | --------------------------------------------------------------------------- |
   * | `keep-space` | The element remains in the document flow, and it does occupy space.         |
   * | `collapse`   | The element is removed form the document flow, and it doesn't occupy space. |
   */
  @Prop() invisibleMode: "collapse" | "keep-space" = "collapse";

  /**
   * This attribute is for specifies the src of the video.
   */
  @Prop() urlSrc: "String";

  private parseYoutubeSrc(src) {
    const ytUrl = {
      domain: src.split("watch?v=")[0],
      videoId: src.split("watch?v=")[1]
    };
    return `${ytUrl.domain}embed/${ytUrl.videoId}`;
  }

  render() {
    return (
      <div class="gxVideoContainer">
        <iframe src={this.parseYoutubeSrc} />
      </div>
    );
  }
}
