import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  Prop,
  h
} from "@stencil/core";
import { GridBaseHelper, IGridBase } from "../grid-base/grid-base";
import { IVisibilityComponent } from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "../grid-base/grid-base.scss",
  tag: "gx-grid-fs"
})
export class GridFreeStyle
  implements IGridBase, ComponentInterface, IVisibilityComponent {
  @Element() el!: HTMLElement;

  /**
   * This attribute lets you specify how this element will behave when hidden.
   *
   * | Value        | Details                                                                     |
   * | ------------ | --------------------------------------------------------------------------- |
   * | `keep-space` | The element remains in the document flow, and it does occupy space.         |
   * | `collapse`   | The element is removed form the document flow, and it doesn't occupy space. |
   */
  @Prop() invisibleMode: "collapse" | "keep-space" = "collapse";

  /**
   * Grid loading State. It's purpose is to know rather the Grid Loading animation or the Grid Empty placeholder should be shown.
   *
   * | Value        | Details                                                                                        |
   * | ------------ | ---------------------------------------------------------------------------------------------- |
   * | `loading` | The grid is waiting the server for the grid data. Grid loading mask will be shown.                |
   * | `loaded`   | The grid data has been loaded. If the grid has no records, the empty place holder will be shown. |
   */

  @Prop() loadingState: "loading" | "loaded";

  /**
   * Grid current row count. This property is used in order to be able to re-render the Grid every time the Grid data changes.
   * If not specified, then grid empty and loading placeholders will not work correctly.
   */
  @Prop() recordCount: number;

  /**
   * The threshold distance from the bottom
   * of the content to call the `infinite` output event when scrolled.
   * The threshold value can be either a percent, or
   * in pixels. For example, use the value of `10%` for the `infinite`
   * output event to get called when the user has scrolled 10%
   * from the bottom of the page. Use the value `100px` when the
   * scroll is within 100 pixels from the bottom of the page.
   */
  @Prop() threshold = "100px";

  /**
   * This Handler will be called every time grid threshold is reached. Needed for infinite scrolling grids.
   */
  @Event() gxInfiniteThresholdReached: EventEmitter<void>;

  render() {
    return [
      <slot name="grid-content" />,

      <gx-grid-infinite-scroll
        threshold={this.threshold}
        infiniteScrollContainer="gx-table-cell"
        itemCount={this.recordCount}
        onGxInfinite={() =>
          this.loadingState !== "loading" &&
          this.gxInfiniteThresholdReached.emit()
        }
      >
        <gx-grid-infinite-scroll-content>
          <slot name="grid-loading-content" />
        </gx-grid-infinite-scroll-content>
      </gx-grid-infinite-scroll>,
      <div class="grid-empty-placeholder">
        <slot name="grid-content-empty" />
      </div>,
      <slot />
    ];
  }

  hostData() {
    return GridBaseHelper.hostData(this);
  }
}
