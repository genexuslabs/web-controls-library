import {
  Component,
  Element,
  Event,
  EventEmitter,
  Prop,
  h
} from "@stencil/core";

import {
  IClickableComponent,
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
  implements
    IComponent,
    IClickableComponent,
    IDisableableComponent,
    IVisibilityComponent {
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
  @Prop() src: string;

  /* Property for tomorrow
    /**
     * True to lazy load the image, when it enters the viewport.
     *
    @Prop() lazyLoad = true;
  */

  /**
   * Emitted when the element is clicked.
   */
  @Event() onClick: EventEmitter;

  handleClick(event: UIEvent) {
    if (this.disabled) {
      event.stopPropagation();
      return;
    }
    this.onClick.emit(event);
    event.preventDefault();
  }

  private parseYoutubeSrc(src) {
    const domain_ID_Array = src.split("watch?v=");
    return `${domain_ID_Array[0]}embed/${domain_ID_Array[1]}`;
  }

  render() {
    return (
      <div class="gxVideoContainer">
        <iframe src={this.parseYoutubeSrc(this.src)} />
      </div>
    );
  }
}
