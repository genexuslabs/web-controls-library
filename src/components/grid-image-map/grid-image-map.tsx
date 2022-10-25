import {
  Component,
  Host,
  h,
  Prop,
  Element,
  Event,
  EventEmitter,
  Listen,
  State
} from "@stencil/core";
import "custom-pinch-zoom-element";

import { Component as GxComponent } from "../common/interfaces";
import { GridBase, GridBaseHelper } from "../grid-base/grid-base";
import {
  HighlightableComponent,
  makeHighlightable
} from "../common/highlightable";
import {
  LongPressComponent,
  makeLongPressable
} from "../common/events/long-press";
import { getFileNameWithoutExtension } from "../common/utils";

// Class transforms
import { getClasses } from "../common/css-transforms/css-transforms";

@Component({
  tag: "gx-grid-image-map",
  styleUrl: "grid-image-map.scss",
  shadow: false
})
export class GridImageMap
  implements GxComponent, GridBase, HighlightableComponent, LongPressComponent {
  constructor() {
    this.handleImageLoad = this.handleImageLoad.bind(this);
  }

  private imageDidLoad = false;

  private resizeObserver: ResizeObserver = null;

  /**
   * `true` if the tooltipText should be rendered when the mouse is over the
   * image map.
   */
  private shouldShowTooltip = false;

  @Element() element: HTMLGxGridImageMapElement;

  /**
   * `true` if the mouse is over the image map and the user did not perform
   * any wheel event.
   */
  @State() mouseIsOverImageMap = false;

  /**
   * This attribute defines if the control size will grow automatically,
   * to adjust to its content size.
   * If set to `false`, it won't grow automatically and it will show scrollbars
   * if the content overflows.
   * This property is not currently supported in the gx-image-map control.
   */
  @Prop() readonly autoGrow = false;

  /**
   * A CSS class to set as the `gx-grid-image-map` element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * True to highlight control when an action is fired.
   */
  @Prop() readonly highlightable: boolean = false;

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
   * Grid loading State. It's purpose is to know rather the Grid Loading
   * animation or the Grid Empty placeholder should be shown.
   *
   * | Value        | Details                                                                                          |
   * | ------------ | ------------------------------------------------------------------------------------------------ |
   * | `loading`    | The grid is waiting the server for the grid data. Grid loading mask will be shown.               |
   * | `loaded`     | The grid data has been loaded. If the grid has no records, the empty place holder will be shown. |
   */
  @Prop() readonly loadingState: "loading" | "loaded";

  /**
   * True if the control should implement and emit longPress event.
   */
  @Prop() readonly longPressable: boolean = false;

  /**
   * Grid current row count. This property is used in order to be able to
   * re-render the Grid every time the Grid data changes.
   * If not specified, then grid empty and loading placeholders may not work
   * correctly.
   */
  @Prop() readonly recordCount: number;

  /**
   * This attribute lets you specify the src of the background image.
   */
  @Prop() src: string;

  /**
   * This attribute lets you specify the srcset of the background image.
   */
  @Prop() srcset: string;

  /**
   * This property lets you specify a user tip that will be displayed as
   * a message on the image map when the mouse is over it.
   * This hint is used to indicate the image map can be zoomed.
   *
   * When the user zooms into the image map for the first time, this hint will
   * no longer be displayed.
   */
  @Prop() tooltipText: string = null;

  /**
   * This Handler will be called every time grid threshold is reached. Needed for infinite scrolling grids.
   */
  @Event({ bubbles: false }) gxInfiniteThresholdReached: EventEmitter<void>;

  /**
   * Emitted when the element is zoomed in or out.
   */
  @Event() gxZoom: EventEmitter;

  /**
   * Emitted when the element is long pressed.
   */
  @Event() longPress: EventEmitter<any>;

  @Listen("wheel", { capture: true })
  handleWheel(ev) {
    this.gxZoom.emit(ev);

    if (this.shouldShowTooltip) {
      // When the first wheel event is performed, the tooltip will no longer be
      // displayed
      this.shouldShowTooltip = false;

      this.mouseIsOverImageMap = false;
    }
  }

  @Listen("mouseover")
  handleMouseover() {
    if (this.shouldShowTooltip) {
      this.mouseIsOverImageMap = true;
    }
  }

  @Listen("mouseout")
  handleMouseout() {
    if (this.shouldShowTooltip) {
      this.mouseIsOverImageMap = false;
    }
  }

  /**
   * Store the natural sizes of the image in custom vars.
   * @param event The image load event
   */
  private handleImageLoad(event: UIEvent) {
    const img = event.target as HTMLImageElement;

    if (img.naturalWidth != 0) {
      this.element.style.setProperty(
        "--image-map-image-width",
        img.naturalWidth.toString()
      );
      this.element.style.setProperty(
        "--image-map-image-height",
        img.naturalHeight.toString()
      );
    }

    // Show the background img
    img.style.setProperty("display", "block");
    img.style.removeProperty("opacity");
    this.imageDidLoad = true;
  }

  private onResize(entries) {
    const component = entries[0].target;
    component.style.setProperty(
      "--image-map-width",
      component.offsetWidth.toString()
    );
    component.style.setProperty(
      "--image-map-height",
      component.offsetHeight.toString()
    );
  }

  componentWillLoad() {
    this.shouldShowTooltip = this.tooltipText != null;
  }

  componentDidLoad() {
    this.resizeObserver = new ResizeObserver(this.onResize);
    this.resizeObserver.observe(this.element);

    makeHighlightable(this);
    makeLongPressable(this);
  }

  disconnectedCallback() {
    // eslint-disable-next-line @stencil/strict-boolean-conditions
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }

  render() {
    // The src property always contains a path to the image file
    const alt = this.src ? getFileNameWithoutExtension(this.src) : "";

    const body = this.src
      ? [
          <pinch-zoom class="pinch-zoom" min-scale={1}>
            <div class="gx-image-map-container">
              <img
                class="inner-img"
                style={{
                  opacity: !this.imageDidLoad ? "0" : null
                }}
                onLoad={this.handleImageLoad}
                src={this.src}
                srcset={this.srcset}
                alt={alt}
              />
              {this.shouldShowTooltip && this.mouseIsOverImageMap && (
                <span class="tooltip-text">{this.tooltipText}</span>
              )}
              <slot name="grid-content" />
            </div>
            <slot name="grid-empty-loading-placeholder" />
            <slot name="grid-content-empty" />
          </pinch-zoom>
        ]
      : [
          <slot name="grid-empty-loading-placeholder" />,
          <slot name="grid-content-empty" />
        ];

    const hostData = GridBaseHelper.hostData(this);
    const classes = getClasses(this.cssClass);

    // Add extra styles if the cssClass is set
    if (!!this.cssClass) {
      hostData.class = {
        ...hostData.class,
        ...{ [this.cssClass]: true, [classes.vars]: true }
      };
    }

    return <Host {...hostData}>{body}</Host>;
  }
}
