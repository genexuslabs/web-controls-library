import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  Host,
  Method,
  Prop,
  h,
  Watch
} from "@stencil/core";
import { GridBase, GridBaseHelper } from "../grid-base/grid-base";

import { attachHorizontalScrollWithDragHandler } from "../common/utils";

import { VisibilityComponent } from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "grid-smart-css.scss",
  tag: "gx-grid-smart-css"
})
export class GridSmartCss
  implements GridBase, ComponentInterface, VisibilityComponent {
  constructor() {
    this.handleGxInfinite = this.handleGxInfinite.bind(this);
  }

  /** `true` if the `componentDidLoad()` method was called */
  private didLoad = false;

  private needForRAF = true; // To prevent redundant RAF (request animation frame) calls

  private resizeObserver: ResizeObserver = null;

  // Refs
  private horizontalGridContent: HTMLDivElement = null;
  private scrollableContainer: HTMLElement = null;

  @Element() element!: HTMLGxGridSmartCssElement;

  /**
   * This attribute defines if the control size will grow automatically,
   * to adjust to its content size.
   * If set to `false`, it won't grow automatically and it will show scrollbars
   * if the content overflows.
   */
  @Prop() readonly autoGrow = false;

  /**
   * A CSS class to set as the `gx-grid-smart-css` element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * Specifies the direction of the flexible items.
   */
  @Prop({ reflect: true }) readonly direction: "vertical" | "horizontal" =
    "vertical";

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
   * When set to `true`, the grid items will be loaded in inverse order, with
   * the first element at the bottom and the "Loading" message (infinite-scroll)
   * at the top.
   * Inverse Loading is currently supported when:
   *  - `direction = "vertical"`
   *  - `itemLayoutMode = "single" | "mbyq"`
   */
  @Prop() readonly inverseLoading: boolean = false;

  /**
   * Grid Item Layout Mode: Single, Multiple by quantity, multiple by size.
   */
  @Prop({ reflect: true }) readonly itemLayoutMode: "single" | "mbyq" | "mbys" =
    "single";

  /**
   * Grid loading State. It's purpose is to know rather the Grid Loading animation or the Grid Empty placeholder should be shown.
   *
   * | Value        | Details                                                                                          |
   * | ------------ | ------------------------------------------------------------------------------------------------ |
   * | `loading`    | The grid is waiting the server for the grid data. Grid loading mask will be shown.               |
   * | `loaded`     | The grid data has been loaded. If the grid has no records, the empty place holder will be shown. |
   */
  @Prop() readonly loadingState: "loading" | "loaded";

  /**
   * Grid current row count. This property is used in order to be able to re-render the Grid every time the Grid data changes.
   * If not specified, then grid empty and loading placeholders may not work correctly.
   */
  @Prop() readonly recordCount: number;

  /**
   * The threshold distance from the bottom
   * of the content to call the `infinite` output event when scrolled.
   * The threshold value can be either a percent, or
   * in pixels. For example, use the value of `10%` for the `infinite`
   * output event to get called when the user has scrolled 10%
   * from the bottom of the page. Use the value `100px` when the
   * scroll is within 100 pixels from the bottom of the page.
   */
  @Prop() readonly threshold: string = "150px";

  /**
   * Scroll snapping allows to lock the viewport to certain elements or locations after a user has finished scrolling
   */
  @Prop({ reflect: true }) readonly snapToGrid = false;

  /**
   * This Handler will be called every time grid threshold is reached. Needed for infinite scrolling grids.
   */
  @Event({ bubbles: false }) gxInfiniteThresholdReached: EventEmitter<void>;

  @Watch("direction")
  handleDirectionChange(newValue: "vertical" | "horizontal") {
    if (!this.didLoad) {
      return;
    }
    this.needForRAF = true;

    // Disconnect the previous observer since the callback will change
    this.disconnectResizeObserver();

    // Connect the observer with the new callback
    this.connectResizeObserver(newValue);
  }

  /**
   * This method must be called after new grid data was fetched by the infinite scroller.
   */
  @Method()
  async complete() {
    this.element
      .querySelector(':scope > [slot="grid-content"] gx-grid-infinite-scroll"')
      ["complete"]();
  }

  private isHorizontal(): boolean {
    return this.direction === "horizontal";
  }

  /**
   * When `direction = "horizontal"` set a resizeObserver to update a CSS
   * variable with the grid's width value. When any grid cell has a relative
   * width, its width must be relative to the grid width. For that to be
   * possible, we have to sync the grid viewport width with a CSS variable.
   *
   * The same concept applies for `direction = "vertical"` and the grid's height.
   */
  private connectResizeObserver(direction: "vertical" | "horizontal") {
    // eslint-disable-next-line @stencil/strict-boolean-conditions
    if (this.resizeObserver) {
      return;
    }

    if (direction == "vertical") {
      this.resizeObserver = new ResizeObserver(
        this.resizeObserverVerticalDirectionCallback
      );
    } else {
      const resizeObserverCallback = this.autoGrow
        ? this.resizeObserverHorizontalDirectionAutoGrowCallback
        : this.resizeObserverHorizontalDirectionCallback;

      this.resizeObserver = new ResizeObserver(resizeObserverCallback);
    }

    this.resizeObserver.observe(this.scrollableContainer);
  }

  // Callback for direction = "vertical"
  private resizeObserverVerticalDirectionCallback = () => {
    // The resizeObserver must not be set when Auto Grow = True. Otherwise,
    // since the grid's height will always change, the resize observer will
    // enter in loop
    if (!this.needForRAF || this.autoGrow) {
      return;
    }
    this.needForRAF = false; // No need to call RAF up until next frame

    // Update CSS variable in the best moment
    requestAnimationFrame(() => {
      this.needForRAF = true; // RAF now consumes the movement instruction so a new one can come

      this.element.style.setProperty(
        "--gx-grid-smart-css-viewport-size",
        `${this.scrollableContainer.clientHeight}px`
      );
    });
  };

  // Callback for direction = "horizontal" and autoGrow = false
  private resizeObserverHorizontalDirectionCallback = () => {
    if (!this.needForRAF) {
      return;
    }
    this.needForRAF = false; // No need to call RAF up until next frame

    // Update CSS variable in the best moment
    requestAnimationFrame(() => {
      const clientWidth = this.horizontalGridContent.clientWidth;

      this.needForRAF = true; // RAF now consumes the movement instruction so a new one can come

      this.element.style.setProperty(
        "--gx-grid-smart-css-viewport-size",
        `${clientWidth}px`
      );
    });
  };

  // Callback for direction = "horizontal" and autoGrow = true
  private resizeObserverHorizontalDirectionAutoGrowCallback = () => {
    if (!this.needForRAF) {
      return;
    }
    this.needForRAF = false; // No need to call RAF up until next frame

    // Update CSS variable in the best moment
    requestAnimationFrame(() => {
      const clientWidth = this.horizontalGridContent.clientWidth;

      this.needForRAF = true; // RAF now consumes the movement instruction so a new one can come

      this.element.style.setProperty(
        "--gx-grid-smart-css-viewport-size",
        `${clientWidth}px`
      );

      // Update the height of the horizontal content container, because the
      // scrollableContainer has "position: absolute"
      this.horizontalGridContent.style.height = `${this.scrollableContainer.scrollHeight}px`;
    });
  };

  private disconnectResizeObserver() {
    // eslint-disable-next-line @stencil/strict-boolean-conditions
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }

  componentDidLoad() {
    // Store the ref as it is needed in the resize observer
    this.scrollableContainer = this.element.querySelector(
      '[slot="grid-content"]'
    );

    if (this.isHorizontal()) {
      attachHorizontalScrollWithDragHandler(this.scrollableContainer);
    }
    this.connectResizeObserver(this.direction);

    this.didLoad = true;
  }

  disconnectedCallback() {
    this.scrollableContainer = null;
    this.disconnectResizeObserver();
  }

  render() {
    return (
      <Host {...GridBaseHelper.hostData(this)}>
        {this.direction == "horizontal" ? (
          <div
            class="gx-grid-horizontal-content"
            ref={el => (this.horizontalGridContent = el as HTMLDivElement)}
          >
            <slot name="grid-content" />
          </div>
        ) : (
          <slot name="grid-content" />
        )}

        <slot name="grid-empty-loading-placeholder" />

        <slot name="grid-content-empty" />
      </Host>
    );
  }

  private handleGxInfinite() {
    if (this.loadingState !== "loading") {
      this.gxInfiniteThresholdReached.emit();
    }
  }
}
