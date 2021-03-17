import {
  HighlightableComponent,
  makeHighlightable
} from "../common/highlightable";

import { EventEmitter } from "@stencil/core";

export interface GridBase {
  element: HTMLElement;

  /**
   * This attribute lets you specify how this element will behave when hidden.
   *
   * | Value        | Details                                                                     |
   * | ------------ | --------------------------------------------------------------------------- |
   * | `keep-space` | The element remains in the document flow, and it does occupy space.         |
   * | `collapse`   | The element is removed form the document flow, and it doesn't occupy space. |
   */
  invisibleMode: "collapse" | "keep-space";

  /**
   * Grid loading State. It's purpose is to know rather the Grid Loading animation or the Grid Empty placeholder should be shown.
   *
   * | Value        | Details                                                                                        |
   * | ------------ | ---------------------------------------------------------------------------------------------- |
   * | `loading` | The grid is waiting the server for the grid data. Grid loading mask will be shown.                |
   * | `loaded`   | The grid data has been loaded. If the grid has no records, the empty place holder will be shown. |
   */
  loadingState: "loading" | "loaded";

  /**
   * This Handler will be called every time grid threshold is reached. Needed for infinite scrolling grids.
   */
  gxInfiniteThresholdReached: EventEmitter<void>;

  /**
   * Grid current row count. This property is used in order to be able to re-render the Grid every time the Grid data changes.
   * If not specified, then grid empty and loading placeholders will not work correctly.
   */
  recordCount: number;

  /**
   * This attribute defines if the control size will grow automatically,
   * to adjust to its content size.
   * If set to `false`, it won't grow automatically and it will show scrollbars
   * if the content overflows.
   */
  readonly autoGrow: boolean;
}

export class GridBaseHelper {
  static GRID_BASE_CLASSNAME = "gx-grid-base";

  static init(component: HighlightableComponent) {
    makeHighlightable(component);
  }

  static hostData(cmp: GridBase) {
    return {
      class: {
        "gx-grid-base": true,
        "gx-grid-empty": this.isEmptyGrid(cmp),
        "gx-grid-empty-loading":
          cmp.loadingState === "loading" && cmp.recordCount <= 0,
        "gx-grid-loading": cmp.loadingState === "loading"
      }
    };
  }

  static isEmptyGrid(cmp: GridBase): boolean {
    return cmp.recordCount === 0 && cmp.loadingState === "loaded";
  }
}
