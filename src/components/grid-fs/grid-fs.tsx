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

import { HighlightableComponent } from "../common/highlightable";
import { VisibilityComponent } from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "grid-fs.scss",
  tag: "gx-grid-fs"
})
export class GridFreeStyle
  implements
    GridBase,
    ComponentInterface,
    VisibilityComponent,
    HighlightableComponent {
  constructor() {
    this.handleGxInfinite = this.handleGxInfinite.bind(this);
  }

  viewPortInitialized = false;

  @Element() element!: HTMLGxGridFsElement;

  /**
   * This attribute defines if the control size will grow automatically,
   * to adjust to its content size.
   * If set to `false`, it won't grow automatically and it will show scrollbars
   * if the content overflows.
   */
  @Prop() readonly autoGrow = false;

  /**
   * A CSS class to set as the `gx-grid-fs` element class.
   */
  @Prop() readonly cssClass: string;

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
   * If not specified, then grid empty and loading placeholders will not work correctly.
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
   * True to highlight control when an action is fired.
   */
  @Prop() readonly highlightable = false;

  /**
   * This Handler will be called every time grid threshold is reached. Needed for infinite scrolling grids.
   */
  @Event({ bubbles: false }) gxInfiniteThresholdReached: EventEmitter<void>;

  /**
   * This method must be called after new grid data was fetched by the infinite scroller.
   */
  @Method()
  async complete() {
    (this.element.querySelector(
      ":scope > gx-grid-infinite-scroll"
    ) as HTMLGxGridInfiniteScrollElement)["complete"]();
  }

  private ensureViewPort() {
    if (this.autoGrow || this.viewPortInitialized) {
      return;
    }
    const height = this.element.parentElement.offsetHeight;

    if (height > 0) {
      this.element.style.maxHeight = height + "px";
      this.viewPortInitialized = true;
    }
  }

  componentDidLoad() {
    GridBaseHelper.init(this);
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
}
