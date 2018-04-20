import { Component, Event, EventEmitter, Prop } from "@stencil/core";
import { BaseComponent } from "../common/base-component";

@Component({
  shadow: false,
  styleUrl: "image.css",
  tag: "gx-image"
})
export class Image extends BaseComponent {
  /**
   * A CSS class to set as the inner element class.
   */
  @Prop() cssClass: string;

  /**
   * This attribute lets you specify the SRC.
   */
  @Prop() src: string = "";

  /**
   * This attribute lets you specify the low resolution image SRC.
   */
  @Prop() lowResolutionSrc: string = "";

  /**
   * This attribute lets you specify the alternative text.
   */
  @Prop() alt: string = "";

  /**
   * This attribute lets you specify the title.
   */
  @Prop() title: string;

  /**
   * This attribute lets you specify the width.
   */
  @Prop() width: string;

  /**
   * This attribute lets you specify the height.
   */
  @Prop() height: string;

  /**
   * This attribute lets you specify if the element is disabled.
   * If disabled, it will not fire any user interaction related event
   * (for example, click event).
   */
  @Prop() disabled = false;

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
        title={this.title}
        width={this.width}
        height={this.height}
      />
    );
    return body;
  }
}
