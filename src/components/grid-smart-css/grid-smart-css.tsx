import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  Host,
  Method,
  Prop,
  h
} from "@stencil/core";
import { GridBase, GridBaseHelper } from "../grid-base/grid-base";

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

  private CSS_NAME_MOUSE_DRAG_ACTIVE = "gx-smart-cell-drag-active";

  @Element() element!: HTMLGxGridSmartCssElement;

  /**
   * This attribute defines if the control size will grow automatically,
   * to adjust to its content size.
   * If set to `false`, it won't grow automatically and it will show scrollbars
   * if the content overflows.
   */
  @Prop() readonly autoGrow = false;

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
   * Grid loading State. It's purpose is to know rather the Grid Loading animation or the Grid Empty placeholder should be shown.
   *
   * | Value        | Details                                                                                        |
   * | ------------ | ---------------------------------------------------------------------------------------------- |
   * | `loading` | The grid is waiting the server for the grid data. Grid loading mask will be shown.                |
   * | `loaded`   | The grid data has been loaded. If the grid has no records, the empty place holder will be shown. |
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
    Specifies the direction of the flexible items.
   */
  @Prop({ reflect: true }) readonly direction: "vertical" | "horizontal" =
    "vertical";

  /**
    Grid Item Layout Mode: Single, Multiple by quantity, multiple by size.
   */
  @Prop({ reflect: true }) readonly itemLayoutMode: "single" | "mbyq" | "mbys" =
    "single";

  /**
    Scroll snapping allows to lock the viewport to certain elements or locations after a user has finished scrolling
   */
  @Prop({ reflect: true }) readonly snapToGrid = false;

  /**
   * This Handler will be called every time grid threshold is reached. Needed for infinite scrolling grids.
   */
  @Event({ bubbles: false }) gxInfiniteThresholdReached: EventEmitter<void>;

  /*
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

  private ensureViewPort() {
    const directionSize = this.isHorizontal()
      ? this.element.parentElement.offsetWidth
      : this.element.parentElement.offsetHeight;

    if (directionSize > 0) {
      const elementStyle = this.element.style;
      elementStyle.setProperty(
        "--gx-grid-css-viewport-size",
        directionSize + "px"
      );
    }
  }

  componentDidRender() {
    this.attachMouseScrollHandler();
  }

  render() {
    this.ensureViewPort();
    return (
      <Host {...GridBaseHelper.hostData(this)}>
        {[
          <slot name="grid-content" />,
          <slot name="grid-empty-loading-placeholder" />,
          <div class="grid-empty-placeholder">
            <slot name="grid-content-empty" />
          </div>
        ]}
      </Host>
    );
  }

  private handleGxInfinite() {
    if (this.loadingState !== "loading") {
      this.gxInfiniteThresholdReached.emit();
    }
  }

  private getScrollableContainer(): HTMLElement {
    return this.element.querySelector('[slot="grid-content"]');
  }

  private attachMouseScrollHandler() {
    if (
      !this.isHorizontal() ||
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }
    const slider: HTMLElement = this.getScrollableContainer();

    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener("mousedown", e => {
      isDown = true;
      slider.classList.add(this.CSS_NAME_MOUSE_DRAG_ACTIVE);
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener("mouseleave", () => {
      isDown = false;
      slider.classList.remove("active");
    });
    slider.addEventListener("mouseup", () => {
      isDown = false;
      slider.classList.remove(this.CSS_NAME_MOUSE_DRAG_ACTIVE);
    });
    slider.addEventListener("mousemove", e => {
      if (!isDown) {
        return;
      }
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const SCROLL_SPEED = 1;
      const walk = (x - startX) * SCROLL_SPEED;
      slider.scrollLeft = scrollLeft - walk;
    });
  }
}
