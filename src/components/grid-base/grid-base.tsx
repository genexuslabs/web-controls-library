import {
  HighlightableComponent,
  makeHighlightable
} from "../common/highlightable";

import { EventEmitter } from "@stencil/core";

// Class transforms
import { getClasses } from "../common/css-transforms/css-transforms";

export interface GridBase {
  element: HTMLElement;

  /**
   * A CSS class to set as the `gx-grid` element class.
   */
  cssClass: string;

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
   * When set to `true`, the grid items will be loaded in inverse order, with
   * the first element at the bottom and the "Loading" message (infinite-scroll)
   * at the top.
   */
  inverseLoading?: boolean;

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
    // Styling for gx-grid control.
    const classes = getClasses(cmp.cssClass);

    return {
      role: "grid",
      class: {
        "gx-grid-base": true,
        [cmp.cssClass]: !!cmp.cssClass,
        [classes.vars]: true,
        "gx-grid-inverse-loading": !!cmp.inverseLoading,
        "gx-grid-empty": this.isEmptyGrid(cmp),
        "gx-grid-initial-load": this.isInitialLoad(cmp),
        "gx-grid-loading": cmp.loadingState === "loading"
      }
    };
  }

  static isEmptyGrid = (cmp: GridBase): boolean =>
    cmp.loadingState === "loaded" && cmp.recordCount === 0;

  static isNotEmptyGrid = (cmp: GridBase): boolean => cmp.recordCount > 0;

  static isInitialLoad = (cmp: GridBase): boolean =>
    cmp.loadingState === "loading" && cmp.recordCount <= 0;
}
