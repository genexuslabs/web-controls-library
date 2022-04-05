import { Component, Element, Host, Listen, Prop, h } from "@stencil/core";
import {
  DisableableComponent,
  Component as GxComponent,
  VisibilityComponent
} from "../common/interfaces";
import {
  HighlightableComponent,
  makeHighlightable
} from "../common/highlightable";

import { cssVariablesWatcher } from "../common/css-variables-watcher";
import lazySizes from "lazysizes";

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
    HighlightableComponent {
  constructor() {
    cssVariablesWatcher(
      this,
      [
        {
          cssVariableName: "--image-scale-type",
          propertyName: "scaleType",
          defaultPropertyValue: "contain"
        }
      ],
      0
    );

    this.handleClick = this.handleClick.bind(this);
    this.handleImageLoad = this.handleImageLoad.bind(this);

    this.handleLazyLoaded = this.handleLazyLoaded.bind(this);
    document.addEventListener("lazyloaded", this.handleLazyLoaded);
  }

  @Element() element: HTMLGxImageElement;

  /**
   * This attribute lets you specify the alternative text.
   */
  @Prop() readonly alt: string = "";

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
  @Prop() readonly src: string = "";

  /**
   * True to highlight control when an action is fired.
   */
  @Prop() readonly highlightable = false;

  @Listen("click", { capture: true })
  handleClick(event: UIEvent) {
    if (this.disabled) {
      event.stopPropagation();
      return;
    }
  }

  /**
   * `true` if the `componentDidLoad()` method was called
   */
  private didLoad = false;

  private innerImage: HTMLImageElement = null;

  private handleImageLoad(event: UIEvent) {
    if (!this.autoGrow) {
      const img = event.target as HTMLImageElement;
      // Some image formats do not specify intrinsic dimensions. The naturalWidth property returns 0 in those cases.
      if (img.naturalWidth !== 0) {
      }
    }
  }

  componentDidLoad() {
    if (this.src) {
      makeHighlightable(this, this.innerImage);
    }

    this.didLoad = true;
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
              "inner-image": true,
              "gx-image-tile": this.scaleType === "tile"
            }}
            style={{
              backgroundImage:
                this.scaleType === "tile" ? `url(${this.src})` : null
            }}
            onClick={this.handleClick}
            onLoad={this.handleImageLoad}
            data-src={shouldLazyLoad ? this.src : undefined}
            // Mouse pointer to indicate action
            data-has-action={this.highlightable ? "" : undefined}
            src={!shouldLazyLoad ? this.src : undefined}
            alt={this.alt}
            ref={el => (this.innerImage = el as HTMLImageElement)}
          />,
          <span />
        ]
      : [];

    return (
      <Host
        class={{
          disabled: this.disabled,
          "gx-img-lazyloading": shouldLazyLoad,
          "gx-img-no-auto-grow": this.scaleType !== "tile" && !this.autoGrow
        }}
        style={{
          opacity: !this.didLoad ? "0" : null
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
