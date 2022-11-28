import {
  Component,
  Element,
  Event,
  EventEmitter,
  Host,
  Prop,
  Watch,
  h
} from "@stencil/core";
import {
  DisableableComponent,
  Component as GxComponent
} from "../common/interfaces";
import {
  HighlightableComponent,
  makeHighlightable
} from "../common/highlightable";
import { imagePositionClass } from "../common/image-position";

// Class transforms
import {
  getClasses,
  tSelectedTabCaption,
  tUnselectedTabCaption
} from "../common/css-transforms/css-transforms";

let autoTabId = 0;

/**
 * @part caption - The caption displayed at the center of the control.
 * @part indicator - The indicator bar displayed at the bottom of the control when `selected = true`.
 * @part link - The `a` tag of the control.
 *
 * @slot main-image - The slot for the main `img`.
 * @slot disabled-image - The slot for the disabled `img`.
 */
@Component({
  shadow: true,
  styleUrl: "tab-caption.scss",
  tag: "gx-tab-caption"
})
export class TabCaption
  implements GxComponent, DisableableComponent, HighlightableComponent {
  private hasDisabledImage = false;
  private hasMainImage = false;

  /**
   * `true` if the `componentDidLoad()` method was called
   */
  private didLoad = false;

  @Element() element: HTMLGxTabCaptionElement;

  /**
   * A CSS class to set as the `gx-tab-caption` element class when
   * `selected = false`.
   */
  @Prop() readonly cssClass: string;

  /**
   * This attribute lets you specify if the tab page is disabled.
   */
  @Prop() disabled = false;

  /**
   * This attribute lets you specify the relative location of the image to the text.
   *
   * | Value    | Details                                                 |
   * | -------- | ------------------------------------------------------- |
   * | `above`  | The image is located above the text.                    |
   * | `before` | The image is located before the text, in the same line. |
   * | `after`  | The image is located after the text, in the same line.  |
   * | `below`  | The image is located below the text.                    |
   * | `behind` | The image is located behind the text.                   |
   */
  @Prop() readonly imagePosition:
    | "above"
    | "before"
    | "after"
    | "below"
    | "behind" = "above";

  /**
   * This attribute lets you specify if the tab page corresponding to this caption is selected
   */
  @Prop() selected = false;

  /**
   * A CSS class to set as the `gx-tab-caption` element class when
   * `selected = true`.
   */
  @Prop() readonly selectedCssClass: string;

  /**
   * A CSS class that is used by the `gx-tab` parent container.
   */
  @Prop() readonly tabCssClass: string;

  /**
   * True to highlight control when an action is fired.
   */
  @Prop() highlightable = true;

  @Watch("selected")
  selectedHandler() {
    if (this.didLoad && this.selected) {
      this.tabSelect.emit();
    }
  }

  /**
   * Fired when the tab caption is selected.
   */
  @Event() tabSelect: EventEmitter;

  private clickHandler = (event: UIEvent) => {
    event.preventDefault();

    if (!this.disabled) {
      event.stopPropagation();
      this.selected = true;
    }
  };

  componentWillLoad() {
    if (!this.element.id) {
      this.element.id = `gx-tab-caption-auto-id-${autoTabId++}`;
    }

    this.hasMainImage =
      this.element.querySelector(":scope > [slot='main-image']") !== null;

    this.hasDisabledImage =
      this.element.querySelector(":scope > [slot='disabled-image']") !== null;
  }

  componentDidLoad() {
    makeHighlightable(this);
    this.didLoad = true;
  }

  render() {
    // Styling for gx-tab-caption control.
    const selectedTabCaptionClass = tSelectedTabCaption(this.tabCssClass);
    const unselectedTabCaptionClass = tUnselectedTabCaption(this.tabCssClass);

    const selectedTabCaptionClasses = getClasses(selectedTabCaptionClass);
    const unselectedTabCaptionClasses = getClasses(unselectedTabCaptionClass);

    const selectedClasses = getClasses(this.selectedCssClass);
    const unselectedClasses = getClasses(this.cssClass);

    return (
      <Host
        role="tab"
        aria-disabled={this.disabled ? "true" : undefined}
        aria-selected={(!!this.selected).toString()}
        class={{
          disabled: this.disabled,
          unselected: !this.selected,

          // Configured by the main container gx-tab
          [selectedTabCaptionClass]: this.selected,
          [selectedTabCaptionClasses.vars]: this.selected,

          // Configured by the gx-tab-caption control
          [this.selectedCssClass]: !!this.selectedCssClass && this.selected,
          [selectedClasses.vars]: this.selected,

          // Configured by the main container gx-tab
          [unselectedTabCaptionClass]: !this.selected,
          [unselectedTabCaptionClasses.vars]: !this.selected,

          // Configured by the gx-tab-caption control
          [this.cssClass]: !!this.cssClass && !this.selected,
          [unselectedClasses.vars]: !this.selected
        }}
        onClick={this.clickHandler}
      >
        <a
          class={`link ${[imagePositionClass(this.imagePosition)]}`}
          part="link"
          href="#"
          onClick={this.clickHandler}
        >
          {// Main image
          this.hasMainImage && (this.selected || !this.hasDisabledImage) && (
            <slot name="main-image" />
          )}

          {// Disabled image
          this.hasDisabledImage && !this.selected && (
            <slot name="disabled-image" />
          )}

          <span class="caption" part="caption">
            <slot />
          </span>
        </a>

        {this.selected && <div class="indicator" part="indicator"></div>}
      </Host>
    );
  }
}
