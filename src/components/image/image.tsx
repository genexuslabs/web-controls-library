import { Component, Element, Event, EventEmitter, Prop } from "@stencil/core";
import {
  IClickableComponent,
  IComponent,
  IDisableableComponent,
  IVisibilityComponent
} from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "image.scss",
  tag: "gx-image"
})
export class Image
  implements
    IComponent,
    IDisableableComponent,
    IVisibilityComponent,
    IClickableComponent {
  @Element() element;

  /**
   * This attribute lets you specify the alternative text.
   */
  @Prop() alt = "";

  /**
   * A CSS class to set as the inner element class.
   */
  @Prop() cssClass: string;

  /**
   * This attribute lets you specify if the element is disabled.
   * If disabled, it will not fire any user interaction related event
   * (for example, click event).
   */
  @Prop() disabled = false;

  /**
   * This attribute lets you specify the height.
   */
  @Prop() height: string;

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
   * This attribute lets you specify the low resolution image SRC.
   */
  @Prop() lowResolutionSrc = "";

  /**
   * This attribute lets you specify the SRC.
   */
  @Prop() src = "";

  /**
   * This attribute lets you specify the width.
   */
  @Prop() width: string;

  /**
   * Emitted when the element is clicked.
   */
  @Event() onClick: EventEmitter;

  handleClick(event: UIEvent) {
    if (this.disabled) {
      return;
    }
    this.onClick.emit(event);
    event.preventDefault();
  }

  render() {
    const body = (
      <img
        class={this.cssClass}
        onClick={this.handleClick.bind(this)}
        src={this.src}
        alt={this.alt ? this.alt : ""}
        // title={this.title}
        width={this.width}
        height={this.height}
      />
    );
    return body;
  }
}
