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

const lazyLoadedImages = new Set<string>();

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
      },
      {
        cssVariableName: "--height",
        propertyName: "height"
      },
      {
        cssVariableName: "--width",
        propertyName: "width"
      }
    ]);

    this.handleClick = this.handleClick.bind(this);
    this.handleImageLoad = this.handleImageLoad.bind(this);

    this.handleLazyLoaded = this.handleLazyLoaded.bind(this);
    document.addEventListener("lazyloaded", this.handleLazyLoaded);
  }

  @Element() element: HTMLGxImageElement;

  /**
   * This attribute lets you specify the alternative text.
   */
  @Prop() readonly alt = "";

  /**
   * If true, the component will be sized to match the image's intrinsic size when not constrained
   * via CSS dimension properties (for example, height or width).
   * If false, the component will never force its height to match the image's intrinsic size. The width, however,
   * will match the intrinsic width. In GeneXus terms, it will auto grow horizontally, but not vertically.
   */
  @Prop() readonly autoGrow = true;

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
  @Prop({ mutable: true }) width: string;

  /**
   * Emitted when the element is clicked.
   */
  @Event() gxClick: EventEmitter;

  private handleClick(event: UIEvent) {
    if (this.disabled) {
      event.stopPropagation();
      return;
    }
    this.gxClick.emit(event);
    event.preventDefault();
  }

  private handleImageLoad(event: UIEvent) {
    if (!this.autoGrow) {
      const img = event.target as HTMLImageElement;
      // Some image formats do not specify intrinsic dimensions. The naturalWidth property returns 0 in those cases.
      if (img.naturalWidth !== 0) {
        this.width = `${img.naturalWidth}px`;
      }
    }
  }

  disconnectedCallback() {
    document.removeEventListener("lazyloaded", this.handleLazyLoaded);
  }

  render() {
    const shouldLazyLoad = this.shouldLazyLoad();

    const body = this.src
      ? [
          <img
            class={{
              [LAZY_LOAD_CLASS]: shouldLazyLoad,
              "gx-image-tile": this.scaleType === "tile"
            }}
            style={
              this.scaleType === "tile"
                ? { backgroundImage: `url(${this.src})` }
                : { objectFit: this.scaleType }
            }
            onClick={this.handleClick}
            onLoad={this.handleImageLoad}
            data-src={shouldLazyLoad ? this.src : undefined}
            src={!shouldLazyLoad ? this.src : undefined}
            alt={this.alt}
          />,
          <span />
        ]
      : [];

    const isHeightSpecified = !!this.height;
    const isWidthSpecified = !!this.width;
    return (
      <Host
        class={{
          "gx-img-lazyloading": shouldLazyLoad,
          "gx-img-no-auto-grow": !this.autoGrow
        }}
        style={{
          alignSelf: isHeightSpecified ? "unset" : null,
          justifySelf: isWidthSpecified ? "unset" : null,
          height: isHeightSpecified
            ? `calc(${this.height} + var(--margin-top, 0px) + var(--margin-bottom, 0px))`
            : null,
          width: isWidthSpecified
            ? `calc(${this.width} + var(--margin-left, 0px) + var(--margin-right, 0px))`
            : null
        }}
      >
        {body}
      </Host>
    );
  }

  private shouldLazyLoad(): boolean {
    if (!this.lazyLoad) {
      return false;
    }

    if (lazyLoadedImages.has(this.src)) {
      return false;
    }

    const img: HTMLImageElement = this.element.querySelector("img");
    return img === null || img.classList.contains(LAZY_LOAD_CLASS);
  }

  private handleLazyLoaded(event: CustomEvent) {
    const img: HTMLImageElement = this.element.querySelector("img");
    if (event.target === img) {
      this.element.classList.remove("gx-img-lazyloading");
      lazyLoadedImages.add(this.src);
    }
  }
}

lazySizes.cfg.lazyClass = LAZY_LOAD_CLASS;
lazySizes.cfg.loadingClass = LAZY_LOADING_CLASS;
lazySizes.cfg.loadedClass = LAZY_LOADED_CLASS;
