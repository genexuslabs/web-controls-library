import { Component, Element, Host, Listen, Prop, h } from "@stencil/core";
import {
  HighlightableComponent,
  makeHighlightable
} from "../common/highlightable";
import {
  DisableableComponent,
  Component as GxComponent,
  VisibilityComponent
} from "../common/interfaces";

import { cssVariablesWatcher } from "../common/css-variables-watcher";

import { AccessibleNameComponent } from "../../common/interfaces";

// Class transforms
import { getClasses } from "../common/css-transforms/css-transforms";

const LAZY_LOADING_CLASS = "gx-lazy-loading-image";

@Component({
  shadow: false,
  styleUrl: "image.scss",
  tag: "gx-image"
})
export class Image
  implements
    GxComponent,
    AccessibleNameComponent,
    DisableableComponent,
    VisibilityComponent,
    HighlightableComponent
{
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
  }

  /**
   * `true` if the image has been loaded
   */
  private imageDidLoad = false;

  private innerImageContainer: HTMLDivElement = null;

  @Element() element: HTMLGxImageElement;

  /**
   * Specifies a short string, typically 1 to 3 words, that authors associate
   * with an element to provide users of assistive technologies with a label
   * for the element.
   */
  @Prop() readonly accessibleName: string;

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
  @Prop() readonly autoGrow: boolean = true;

  /**
   * A CSS class to set as the `gx-image` element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * This attribute lets you specify if the element is disabled.
   * If disabled, it will not fire any user interaction related event
   * (for example, click event).
   */
  @Prop() readonly disabled: boolean = false;

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
  @Prop() readonly lazyLoad: boolean = true;

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
   * True to show the image picker button.
   */
  @Prop() readonly showImagePickerButton: boolean = false;

  /**
   * This attribute lets you specify the `src` of the `img`.
   */
  @Prop() readonly src: string = "";

  /**
   * This attribute lets you specify the `srcset` of the `img`. The `srcset`
   * attribute defines the set of images we will allow the browser to choose
   * between, and what size each image is. Each set of image information is
   * separated from the previous one by a comma.
   */
  @Prop() readonly srcset: string = "";

  /**
   * True to highlight control when an action is fired.
   */
  @Prop() readonly highlightable: boolean = false;

  @Listen("click", { capture: true })
  handleClick(event: UIEvent) {
    if (this.disabled) {
      event.stopPropagation();
      return;
    }
  }

  private handleImageLoad(event: UIEvent) {
    if (this.imageDidLoad) {
      return;
    }
    this.imageDidLoad = true;
    // if (!this.autoGrow) {
    //   // Some image formats do not specify intrinsic dimensions. The naturalWidth property returns 0 in those cases.
    //   if (img.naturalWidth !== 0) {
    //   }
    // }

    const img = event.target as HTMLImageElement;

    img.style.setProperty("display", "block");
    img.parentElement.classList.remove(LAZY_LOADING_CLASS);
    img.style.removeProperty("opacity");
  }

  componentDidLoad() {
    makeHighlightable(this, this.innerImageContainer);
  }

  disconnectedCallback() {
    this.innerImageContainer = null;
  }

  render() {
    // Styling for gx-image control.
    const classes = getClasses(this.cssClass);

    const withoutAutoGrow = this.scaleType !== "tile" && !this.autoGrow;

    const imageSrc = this.srcset || this.src;
    const shouldAddLazyLoadingClass = !this.imageDidLoad && !!imageSrc;

    const body = !!imageSrc && (
      <img
        aria-label={this.accessibleName}
        class={{
          "inner-image": true,
          "gx-image-tile": this.scaleType === "tile"
        }}
        style={{
          backgroundImage:
            this.scaleType === "tile" ? `url(${this.src})` : null,
          opacity: !this.imageDidLoad ? "0" : null
        }}
        alt={this.alt}
        loading="lazy"
        src={this.src || undefined}
        srcset={this.srcset || undefined}
        onClick={this.handleClick}
        onLoad={this.handleImageLoad}
      />
    );

    return (
      <Host
        class={{
          [classes.vars]: true,
          disabled: this.disabled,
          "gx-img-no-auto-grow": withoutAutoGrow,
          [LAZY_LOADING_CLASS]: !withoutAutoGrow && shouldAddLazyLoadingClass
        }}
      >
        <div
          class={{
            "gx-image-container": true,
            [this.cssClass]: !!this.cssClass
          }}
          // Mouse pointer to indicate action
          data-has-action={
            this.highlightable && !this.disabled ? "" : undefined
          }
          // Necessary to avoid the focus-within state when clicking the picker-button
          data-no-action={this.showImagePickerButton && !this.highlightable}
          // Add focus to the control through sequential keyboard navigation and visually clicking
          tabindex={this.highlightable && !this.disabled ? "0" : undefined}
          ref={el => (this.innerImageContainer = el as HTMLDivElement)}
        >
          {withoutAutoGrow ? (
            <div
              class={{
                "gx-image-no-auto-grow-container": true,
                [LAZY_LOADING_CLASS]: shouldAddLazyLoadingClass
              }}
            >
              {body}
            </div>
          ) : (
            body
          )}

          {this.showImagePickerButton && <slot />}
        </div>
      </Host>
    );
  }
}
