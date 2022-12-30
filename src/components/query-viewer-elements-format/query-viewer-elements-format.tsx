import { Component, Event, EventEmitter, Prop } from "@stencil/core";

@Component({
  tag: "gx-query-viewer-element-format",
  shadow: false
})
export class QueryViewerElementFormat {
  @Event() elementChanged: EventEmitter;

  /**
   * Format on values
   */
  @Prop() picture: string;
  /**
   * How to show subtotals
   */
  @Prop() subtotals: "Yes" | "Hidden" | "No";
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

  componentDidUpdate() {
    this.elementChanged.emit();
  }
}
