import {
  Component,
  Element,
  Event,
  EventEmitter,
  Prop,
  h
} from "@stencil/core";
import lazySizes from "lazysizes";
import {
  IClickableComponent,
  IComponent,
  IDisableableComponent,
  IVisibilityComponent
} from "../common/interfaces";
import { cssVariablesWatcher } from "../common/css-variables-watcher";

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
  constructor() {
    cssVariablesWatcher(this, [
      {
        cssVariableName: "--image-scale-type",
        propertyName: "scaleType"
      }
    ]);
  }

  @Element() element: HTMLGxImageElement;

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
   * True to lazy load the image, when it enters the viewport.
   */
  @Prop() lazyLoad = true;

  /**
   * This attribute lets you specify the low resolution image SRC.
   */
  @Prop() lowResolutionSrc = "";

  /**
   * This attribute allows specifing how the image is sized according to its container.
   * `contain`, `cover`, `fill` and `none` map directly to the values of the CSS `object-fit` property.
   * The `tile` value repeats the image, both vertically and horizontally, creating a tile effect.
   */
  @Prop({ mutable: true }) scaleType:
    | "contain"
    | "cover"
    | "fill"
    | "none"
    | "tile";

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
      event.stopPropagation();
      return;
    }
    this.onClick.emit(event);
    event.preventDefault();
  }

  render() {
    const shouldLazyLoad = this.shouldLazyLoad();

    const body = [
      <img
        class={{
          [LAZY_LOAD_CLASS]: shouldLazyLoad,
          [this.cssClass]: !!this.cssClass,
          "gx-image-tile": this.scaleType === "tile"
        }}
        style={
          this.scaleType === "tile"
            ? { backgroundImage: `url(${this.src})` }
            : { objectFit: this.scaleType }
        }
        onClick={this.handleClick.bind(this)}
        data-src={shouldLazyLoad ? this.src : undefined}
        src={!shouldLazyLoad ? this.src : undefined}
        alt={this.alt ? this.alt : ""}
        width={this.width}
        height={this.height}
      />,
      <span />
    ];
    return body;
  }

  private shouldLazyLoad(): boolean {
    if (!this.lazyLoad) {
      return false;
    }

    const img: HTMLImageElement = this.element.querySelector("img");
    return !img || img.classList.contains(LAZY_LOAD_CLASS);
  }
}

const LAZY_LOAD_CLASS = "gx-lazyload";
const LAZY_LOADING_CLASS = "gx-lazyloading";
const LAZY_LOADED_CLASS = "gx-lazyloaded";

lazySizes.cfg.lazyClass = LAZY_LOAD_CLASS;
lazySizes.cfg.loadingClass = LAZY_LOADING_CLASS;
lazySizes.cfg.loadedClass = LAZY_LOADED_CLASS;
