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
import {
  hideMainImageWhenDisabledClass,
  imagePositionClass,
  imagePositionRender
} from "../common/image-position";

// Class transforms
import {
  getClasses,
  tSelectedTabCaption,
  tTabsPositionCaption,
  tUnselectedTabCaption
} from "../common/css-transforms/css-transforms";

let autoTabId = 0;

@Component({
  shadow: false,
  styleUrl: "tab-caption.scss",
  tag: "gx-tab-caption"
})
export class TabCaption
  implements GxComponent, DisableableComponent, HighlightableComponent {
  constructor() {
    this.clickHandler = this.clickHandler.bind(this);
  }

  private hasDisabledImage = false;

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
    if (this.selected) {
      this.tabSelect.emit(event);
    }
  }

  /**
   * Fired when the tab caption is selected
   */
  @Event() tabSelect: EventEmitter;

  componentWillLoad() {
    if (!this.element.id) {
      this.element.id = `gx-tab-caption-auto-id-${autoTabId++}`;
    }
    this.hasDisabledImage =
      this.element.querySelector("[slot='disabled-image']") !== null;
  }

  componentDidLoad() {
    makeHighlightable(this);
  }

  render() {
    // Styling for gx-tab-caption control.
    const selectedTabCaptionClass = tSelectedTabCaption(this.tabCssClass);
    const unselectedTabCaptionClass = tUnselectedTabCaption(this.tabCssClass);

    const selectedTabCaptionClasses = getClasses(selectedTabCaptionClass);
    const unselectedTabCaptionClasses = getClasses(unselectedTabCaptionClass);

    const selectedClasses = getClasses(this.selectedCssClass);
    const unselectedClasses = getClasses(this.cssClass);

    const tabsPositionCaptionClass = !!this.tabCssClass
      ? this.tabCssClass
          .split(" ")
          .map(tTabsPositionCaption)
          .join(" ")
      : "";

    return (
      <Host
        aria-selected={(!!this.selected).toString()}
        role="tab"
        class={{
          "gx-tab-caption": true,
          "gx-tab-caption--active": this.selected,
          "gx-tab-caption--disabled": this.disabled,
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
          [unselectedClasses.vars]: !this.selected,

          [imagePositionClass(this.imagePosition)]: true,
          [hideMainImageWhenDisabledClass]:
            !this.selected && this.hasDisabledImage
        }}
      >
        <div class="image-and-link-container">
          <a
            class={{
              "gx-nav-link": true,
              "gx-nav-link--active": this.selected,
              [tabsPositionCaptionClass]: true
            }}
            href="#"
            onClick={this.clickHandler}
          >
            {imagePositionRender({
              default: <slot />,
              disabledImage: <slot name="disabled-image" />,
              mainImage: <slot name="main-image" />
            })}
          </a>
        </div>
      </Host>
    );
  }

  private clickHandler(event: UIEvent) {
    event.preventDefault();
    if (!this.disabled) {
      this.selected = true;
    }
  }
}
