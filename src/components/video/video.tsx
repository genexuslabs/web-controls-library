import { Component, Element, Host, Prop, h } from "@stencil/core";

import {
  Component as GxComponent,
  DisableableComponent,
  VisibilityComponent
} from "../common/interfaces";

@Component({
  shadow: true,
  styleUrl: "./video.scss",
  tag: "gx-video"
})
export class Video
  implements GxComponent, DisableableComponent, VisibilityComponent {
  @Element() element: HTMLGxVideoElement;

  /**
   * This attribute lets you specify if the element is disabled.
   * If disabled, it will not fire any user interaction related event
   * (for example, click event).
   */
  @Prop() readonly disabled = false;

  /**
   * This attribute lets you specify how this element will behave when hidden.
   *
   * | Value        | Details                                                                     |
   * | ------------ | --------------------------------------------------------------------------- |
   * | `keep-space` | The element remains in the document flow, and it does occupy space.         |
   * | `collapse`   | The element is removed form the document flow, and it doesn't occupy space. |
   */
  @Prop() readonly invisibleMode: "collapse" | "keep-space" = "collapse";

  /**
   * This attribute is for specifies the src of the video.
   */
  @Prop() readonly src: string;

  /* Property for tomorrow
    /**
     * True to lazy load the image, when it enters the viewport.
     *
    @Prop() lazyLoad = true;
  */

  private parseYoutubeSrc(src) {
    const domainIdArray = src.split("watch?v=");
    return `${domainIdArray[0]}embed/${domainIdArray[1]}`;
  }

  private isYoutubeVideo = () => this.src.indexOf("youtube.com") !== -1;

  render() {
    return (
      <Host
        aria-disabled={this.disabled ? "true" : undefined}
        class={{ disabled: this.disabled }}
      >
        {this.isYoutubeVideo() ? (
          <iframe class="gx-video" src={this.parseYoutubeSrc(this.src)} />
        ) : (
          <video class="gx-video" controls src={this.src}></video>
        )}
      </Host>
    );
  }
}
