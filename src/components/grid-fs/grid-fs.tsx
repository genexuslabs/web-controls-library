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

import {
  AccessibleNameByComponent,
  AccessibleNameComponent
} from "../../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "grid-fs.scss",
  tag: "gx-grid-fs"
})
export class GridFreeStyle
  implements
    GridBase,
    AccessibleNameByComponent,
    AccessibleNameComponent,
    ComponentInterface,
    HighlightableComponent
{
  constructor() {
    this.handleGxInfinite = this.handleGxInfinite.bind(this);
  }

  private viewPortInitialized = false;

  @Element() element!: HTMLGxGridFsElement;

  /**
   * Specifies the accessible name property value by providing the ID of the
   * HTMLElement that has the accessible name text.
   */
  @Prop() readonly accessibleNameBy: string;

  /**
   * Specifies a short string, typically 1 to 3 words, that authors associate
   * with an element to provide users of assistive technologies with a label
   * for the element.
   */
  @Prop() readonly accessibleName: string;

  /**
   * This attribute defines if the control size will grow automatically,
   * to adjust to its content size.
   * If set to `false`, it won't grow automatically and it will show scrollbars
   * if the content overflows.
   */
  @Prop() readonly autoGrow: boolean = false;

  /**
   * A CSS class to set as the `gx-grid-fs` element class.
   */
  @Prop() readonly cssClass: string;

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
  @Prop() readonly highlightable: boolean = false;

  /**
   * This Handler will be called every time grid threshold is reached. Needed for infinite scrolling grids.
   */
  @Event({ bubbles: false }) gxInfiniteThresholdReached: EventEmitter<void>;

  /**
   * This method must be called after new grid data was fetched by the infinite scroller.
   */
  @Method()
  async complete() {
    (
      this.element.querySelector(
        ":scope > gx-grid-infinite-scroll"
      ) as HTMLGxGridInfiniteScrollElement
    )["complete"]();
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

          <slot name="grid-content-empty" />
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
