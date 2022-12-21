import {
  Component,
  Element,
  Event,
  EventEmitter,
  Prop,
  h
} from "@stencil/core";

import {
  ClickableComponent,
  Component as GxComponent,
  DisableableComponent,
  VisibilityComponent
} from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "./video.scss",
  tag: "gx-video"
})
export class Video
  implements
    GxComponent,
    ClickableComponent,
    DisableableComponent,
    VisibilityComponent {
  constructor() {
    this.handleClick = this.handleClick.bind(this);
  }

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

  /**
   * Emitted when the element is clicked.
   */
  @Event() gxClick: EventEmitter;

  private handleClick(event: UIEvent) {
    this.gxClick.emit(event);
    event.preventDefault();
  }

  private parseYoutubeSrc(src: string) {
    const domainIdArray = src.split("watch?v=");
    return `${domainIdArray[0]}embed/${domainIdArray[1]}`;
  }

  render() {
    const handleClick = !this.disabled ? this.handleClick : null;
    return (
      <div class="gxVideoContainer" onClick={handleClick}>
        <iframe src={this.parseYoutubeSrc(this.src)} />
      </div>
    );
  }
}
