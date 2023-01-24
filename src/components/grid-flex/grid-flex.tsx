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

// Default values of flex properties
const DEFAULT_ALIGN_CONTENT = "stretch";
const DEFAULT_ALIGN_ITEMS = "stretch";
const DEFAULT_FLEX_DIRECTION = "row";
const DEFAULT_FLEX_WRAP = "nowrap";
const DEFAULT_JUSTIFY_CONTENT = "flex-start";

@Component({
  shadow: true,
  styleUrl: "grid-flex.scss",
  tag: "gx-grid-flex"
})
export class GridFlex
  implements GridBase, ComponentInterface, VisibilityComponent {
  @Element() element!: HTMLGxGridFlexElement;

  /**
   * This aligns a flex container’s lines within when there is extra space in
   * the cross-axis, similar to how justify-content aligns individual items
   * within the main-axis.
   *
   * | Value           | Details                                                                                  |
   * | --------------- | ---------------------------------------------------------------------------------------- |
   * | `center`        | Lines are packed toward the center of the flex container.                                |
   * | `flex-end`      | Lines are packed toward the start of the flex container.                                 |
   * | `flex-start`    | Lines are packed toward the end of the flex container.                                   |
   * | `space-around`  | Lines are evenly distributed in the flex container, with half-size spaces on either end. |
   * | `space-between` | Lines are evenly distributed in the flex container.                                      |
   * | `stretch`       | Lines stretch to take up the remaining space.                                            |
   */
  @Prop() readonly alignContent:
    | "center"
    | "flex-end"
    | "flex-start"
    | "space-around"
    | "space-between"
    | "stretch" = DEFAULT_ALIGN_CONTENT;

  /**
   * This attribute lets you define the default behavior for how flex items are
   * laid out along the cross axis on the current line.
   * Think of it as the justify-content version for the cross-axis
   * (perpendicular to the main-axis).
   *
   * | Value           | Details                                                                                                                                                            |
   * | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   * | `baseline`      | Controls are aligned such as their baselines align. This is useful to have several texts from different controls aligned taking into account different font sizes. |
   * | `center`        | Controls are positioned at the center of the container.                                                                                                            |
   * | `flex-end`      | Controls are positioned at the end of the container.                                                                                                               |
   * | `flex-start`    | Controls are positioned at the beginning of the container.                                                                                                         |
   * | `stretch`       | Controls are stretched to fit the container. In other words, children match the size of their container in the cross axis.                                         |
   */
  @Prop() readonly alignItems:
    | "baseline"
    | "center"
    | "flex-end"
    | "flex-start"
    | "stretch" = DEFAULT_ALIGN_ITEMS;

  /**
   * This attribute defines if the control size will grow automatically,
   * to adjust to its content size.
   * If set to `false`, it won't grow automatically and it will show scrollbars
   * if the content overflows.
   */
  @Prop() readonly autoGrow = false;

  /**
   * A CSS class to set as the `gx-grid-flex` element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * Determines the direction of the main-axis (and the cross-axis, perpendicular to the
   * main-axis). The direction children items are placed inside the Flexbox layout.
   *
   * | Value            | Details                                                                                |
   * | ---------------- | -------------------------------------------------------------------------------------- |
   * | `column`         | Controls are displayed vertically, as a column (from top to bottom).                   |
   * | `column-reverse` | Controls are displayed vertically, as a column, in reverse order (from bottom to top). |
   * | `row`            | Controls are displayed horizontally, as a row (from left to right).                    |
   * | `row-reverse`    | Controls are displayed horizontally, as a row, in reverse order (from right to left).  |
   */
  @Prop() readonly flexDirection:
    | "column"
    | "column-reverse"
    | "row"
    | "row-reverse" = DEFAULT_FLEX_DIRECTION;

  /**
   * Determine whether the flex container is single-line or multi-line, and the
   * direction of the cross axis.
   * This attribute specifies what happens when children overflow the size of
   * the container along the main-axis of the layout container.
   * By default, flex items will all try to fit onto one line. You can change
   * that and allow the items to wrap as needed with this attribute.
   *
   * | Value          | Details                                                       |
   * | -------------- | ------------------------------------------------------------- |
   * | `nowrap`       | All flex items will be on one line                            |
   * | `wrap`         | Flex items will wrap onto multiple lines, from top to bottom. |
   * | `wrap-reverse` | Flex items will wrap onto multiple lines from bottom to top.  |
   */
  @Prop() readonly flexWrap:
    | "nowrap"
    | "wrap"
    | "wrap-reverse" = DEFAULT_FLEX_WRAP;

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
   * This attribute lets you define the alignment along the main axis. It helps
   * distribute extra free space leftover when either all the flex items on a
   * line are inflexible, or are flexible but have reached their maximum size.
   * It also exerts some control over the alignment of items when they overflow
   * the line.
   *
   * | Value           | Details                                                                  |
   * | --------------- | ------------------------------------------------------------------------ |
   * | `center`        | Controls are positioned at the center of the container.                  |
   * | `flex-end`      | Controls are positioned at the end of the container.                     |
   * | `flex-start`    | Controls are positioned at the beginning of the container.               |
   * | `space-around`  | Controls are positioned with space before, between, and after the lines. |
   * | `space-between` | Controls are positioned with space between the lines.                    |
   * | `space-evenly`  | Controls are positioned with space evenly around them.                   |
   */
  @Prop() readonly justifyContent:
    | "center"
    | "flex-end"
    | "flex-start"
    | "space-around"
    | "space-between"
    | "space-evenly" = DEFAULT_JUSTIFY_CONTENT;

  /**
   * Grid loading State. It's purpose is to know rather the Grid Loading animation or the Grid Empty placeholder should be shown.
   *
   * | Value      | Details                                                                                          |
   * | ---------- | ------------------------------------------------------------------------------------------------ |
   * | `loading`  | The grid is waiting the server for the grid data. Grid loading mask will be shown.               |
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
   * This Handler will be called every time grid threshold is reached. Needed for infinite scrolling grids.
   */
  @Event({ bubbles: false }) gxInfiniteThresholdReached: EventEmitter<void>;

  /**
   * This method must be called after new grid data was fetched by the infinite scroller.
   */
  @Method()
  async complete() {
    this.element
      .querySelector(':scope > [slot="grid-content"] gx-grid-infinite-scroll"')
      ["complete"]();
  }

  private getValueIfNotDefault = (
    value: string,
    defaultValue: string
  ): string | undefined => (value != defaultValue ? value : undefined);

  render() {
    const emptyGrid = GridBaseHelper.isEmptyGrid(this);
    const notEmptyGrid = GridBaseHelper.isNotEmptyGrid(this);
    const initialLoad = GridBaseHelper.isInitialLoad(this);

    const hostData = GridBaseHelper.hostData(this);

    return (
      <Host
        {...hostData}
        style={{
          "--gx-grid-flex-align-content":
            this.flexWrap === "nowrap"
              ? undefined
              : this.getValueIfNotDefault(
                  this.alignContent,
                  DEFAULT_ALIGN_CONTENT
                ),

          "--gx-grid-flex-align-items": this.getValueIfNotDefault(
            this.alignItems,
            DEFAULT_ALIGN_ITEMS
          ),

          "--gx-grid-flex-flex-direction": this.getValueIfNotDefault(
            this.flexDirection,
            DEFAULT_FLEX_DIRECTION
          ),

          "--gx-grid-flex-flex-wrap": this.getValueIfNotDefault(
            this.flexWrap,
            DEFAULT_FLEX_WRAP
          ),

          "--gx-grid-flex-justify-content": this.getValueIfNotDefault(
            this.justifyContent,
            DEFAULT_JUSTIFY_CONTENT
          )
        }}
      >
        {notEmptyGrid &&
          (this.autoGrow ? (
            <slot name="grid-content" />
          ) : (
            <div class="grid-absolute-content-container">
              <slot name="grid-content" />
            </div>
          ))}

        {initialLoad && <slot name="grid-empty-loading-placeholder" />}

        {emptyGrid && <slot name="grid-content-empty" />}
      </Host>
    );
  }

  // private handleGxInfinite() {
  //   if (this.loadingState !== "loading") {
  //     this.gxInfiniteThresholdReached.emit();
  //   }
  // }
}
