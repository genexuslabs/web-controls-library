import { Component, Event, EventEmitter, Prop } from "@stencil/core";

@Component({
  tag: "gx-query-viewer-element-format",
  shadow: false
})
export class QueryViewerElementFormat {
  // eslint-disable-next-line @stencil-community/required-jsdoc
  @Event() elementChanged: EventEmitter;

  /**
   * Format on values
   */
  @Prop() readonly picture: string;
  /**
   * How to show subtotals
   */
  @Prop() readonly subtotals: "Yes" | "Hidden" | "No";
  /**
   * If true cand drag to pages
   */
  @Prop() readonly canDragToPages: boolean;
  /**
   * Format style
   */
  @Prop() readonly formatStyle: string;
  /**
   * Target value
   */
  @Prop() readonly targetValue: string;
  /**
   * Max value
   */
  @Prop() readonly maximumValue: string;

  componentDidUpdate() {
    this.elementChanged.emit();
  }
}
