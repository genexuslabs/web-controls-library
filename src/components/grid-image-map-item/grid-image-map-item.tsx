import {
  Component,
  Element,
  Prop,
  h,
  Host,
  Event,
  EventEmitter,
  State
} from "@stencil/core";

import { Component as GxComponent } from "../common/interfaces";
import {
  HighlightableComponent,
  makeHighlightable
} from "../common/highlightable";

// Class transforms
import { getClasses } from "../common/css-transforms/css-transforms";

@Component({
  tag: "gx-grid-image-map-item",
  styleUrl: "grid-image-map-item.scss",
  shadow: false
})
export class GridImageMapItem implements GxComponent, HighlightableComponent {
  constructor() {
    this.handleClick = this.handleClick.bind(this);
  }

  @Element() element: HTMLGxGridImageMapItemElement;

  @State() display = true;

  /**
   * A CSS class to set as the `gx-grid-image-map-item` element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * This attributes lets you specify the item's height.
   * This attribute maps directly to the `height` CSS property.
   */
  @Prop() readonly height: string = "100px";

  /**
   * True to highlight control when an action is fired.
   */
  @Prop() readonly highlightable: boolean = false;

  /**
   * Defines the left position of the control which is relative to the position
   * of its `gx-grid-image-map` container.
   * This attribute maps directly to the `left` CSS property.
   */
  @Prop() readonly left: string = "0";

  /**
   * This attributes lets you specify the item's rotation.
   * This attribute maps directly to the `rotation` CSS property.
   */
  @Prop() readonly rotation: string = null;

  /**
   * Defines the top position of the control which is relative to the position
   * of its `gx-grid-image-map` container.
   * This attribute maps directly to the `top` CSS property.
   */
  @Prop() readonly top: string = "0";

  /**
   * This attributes lets you specify the item's width.
   * This attribute maps directly to the `width` CSS property.
   */
  @Prop() readonly width: string = "100px";

  /**
   * Emitted when the element is clicked.
   */
  @Event() gxClick: EventEmitter;

  private handleClick(event: UIEvent) {
    this.gxClick.emit(event);
  }

  componentDidLoad() {
    makeHighlightable(this);
  }

  /**
   * @todo TODO: Try to reproduce this case and check if there is necessary.
   */
  componentWillLoad() {
    //Do not show item if item size is bigger than screen size
    if (
      window.screen.width >= Number(this.width) ||
      window.screen.height >= Number(this.height)
    ) {
      this.display = true;
    } else {
      this.display = false;
    }
  }

  render() {
    const classes = getClasses(this.cssClass);
    this.element.addEventListener("click", this.handleClick);

    return (
      <Host
        class={{
          "no-display": this.display === false,
          [this.cssClass]: !!this.cssClass,
          [classes.vars]: true
        }}
        style={{
          top: `calc(${this.top}px * (var(--image-map-height) / var(--image-map-image-height)))`,
          left: `calc(${this.left}px * (var(--image-map-width) / var(--image-map-image-width)))`,
          width: `calc(${this.width}px * (var(--image-map-width) / var(--image-map-image-width)))`,
          minHeight: `calc(${this.height}px * (var(--image-map-height) / var(--image-map-image-height)))`,
          transform:
            this.rotation != null && this.rotation !== "0"
              ? `rotate(${this.rotation}deg)`
              : null
        }}
      >
        <slot />
      </Host>
    );
  }
}
