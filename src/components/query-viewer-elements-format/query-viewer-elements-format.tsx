import { Component, Prop } from "@stencil/core";

@Component({
  tag: "gx-query-viewer-element-format",
  shadow: false
})
export class QueryViewerElementFormat {
  /**
   * Format on values
   */
  @Prop() picture: string;
  /**
   * How to show subtotals
   */
  @Prop() subtotals: string;
  /**
   * If true cand drag to pages
   */
  @Prop() canDragToPages: boolean;
  /**
   * Format style
   */
  @Prop() formatStyle: string;
  /**
   * Target value
   */
  @Prop() targetValue: string;
  /**
   * Max value
   */
  @Prop() maximumValue: string;
}
