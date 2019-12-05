import {
  Component,
  Element,
  Event,
  EventEmitter,
  Prop,
  h,
  Host
} from "@stencil/core";
import lazySizes from "lazysizes";
import {
  ClickableComponent,
  Component as GxComponent,
  DisableableComponent,
  VisibilityComponent
} from "../common/interfaces";
import { cssVariablesWatcher } from "../common/css-variables-watcher";

const LAZY_LOAD_CLASS = "gx-lazyload";
const LAZY_LOADING_CLASS = "gx-lazyloading";
const LAZY_LOADED_CLASS = "gx-lazyloaded";

@Component({
  shadow: false,
  styleUrl: "image.scss",
  tag: "gx-image"
})
export class Image
  implements
    GxComponent,
    DisableableComponent,
    VisibilityComponent,
    ClickableComponent {
  constructor() {
    cssVariablesWatcher(this, [
      {
        cssVariableName: "--image-scale-type",
        propertyName: "scaleType"
      }
    ]);

    this.handleClick = this.handleClick.bind(this);
  }

  @Element() element: HTMLGxImageElement;

  /**
   * This attribute lets you specify the alternative text.
   */
  @Prop() readonly alt = "";

  /**
   * A CSS class to set as the inner element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * This attribute lets you specify if the element is disabled.
   * If disabled, it will not fire any user interaction related event
   * (for example, click event).
   */
  @Prop() readonly disabled = false;

  /**
   * This attribute lets you specify the height.
   */
  @Prop() readonly height: string;

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
   * True to lazy load the image, when it enters the viewport.
   */
  @Prop() readonly lazyLoad = true;

  /**
   * This attribute lets you specify the low resolution image SRC.
   */
  @Prop() readonly lowResolutionSrc = "";

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
  @Prop() readonly src = "";

  /**
   * This attribute lets you specify the width.
   */
  @Prop() readonly width: string;

  /**
   * Emitted when the element is clicked.
   */
  @Event() onClick: EventEmitter;

  private handleClick(event: UIEvent) {
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
          [this.cssClass]: this.cssClass !== "",
          "gx-image-tile": this.scaleType === "tile"
        }}
        style={
          this.scaleType === "tile"
            ? { backgroundImage: `url(${this.src})` }
            : { objectFit: this.scaleType }
        }
        onClick={this.handleClick}
        data-src={shouldLazyLoad ? this.src : undefined}
        src={!shouldLazyLoad ? this.src : undefined}
        alt={this.alt}
        width={this.width}
        height={this.height}
      />,
      <span />
    ];
    return <Host>{body}</Host>;
  }

  private shouldLazyLoad(): boolean {
    if (!this.lazyLoad) {
      return false;
    }

    const img: HTMLImageElement = this.element.querySelector("img");
    return img === null || img.classList.contains(LAZY_LOAD_CLASS);
  }
}

lazySizes.cfg.lazyClass = LAZY_LOAD_CLASS;
lazySizes.cfg.loadingClass = LAZY_LOADING_CLASS;
lazySizes.cfg.loadedClass = LAZY_LOADED_CLASS;
