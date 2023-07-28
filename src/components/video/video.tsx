import { Component, Element, Host, Prop, h } from "@stencil/core";

import {
  DisableableComponent,
  Component as GxComponent
} from "../common/interfaces";

import { AccessibleNameComponent } from "../../common/interfaces";

@Component({
  shadow: true,
  styleUrl: "./video.scss",
  tag: "gx-video"
})
export class Video
  implements GxComponent, AccessibleNameComponent, DisableableComponent
{
  @Element() element: HTMLGxVideoElement;

  /**
   * Specifies a short string, typically 1 to 3 words, that authors associate
   * with an element to provide users of assistive technologies with a label
   * for the element.
   */
  @Prop() readonly accessibleName: string;

  /**
   * This attribute lets you specify if the element is disabled.
   * If disabled, it will not fire any user interaction related event
   * (for example, click event).
   */
  @Prop() readonly disabled: boolean = false;

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

  private parseYoutubeSrc(src: string) {
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
          <iframe
            aria-label={this.accessibleName}
            class="gx-video"
            src={this.parseYoutubeSrc(this.src)}
          />
        ) : (
          <video
            // Always set aria-label, because "controls" attribute is presented
            aria-label={this.accessibleName}
            class="gx-video"
            controls
            src={this.src}
          ></video>
        )}
      </Host>
    );
  }
}
