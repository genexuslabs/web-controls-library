import { Component, Event, EventEmitter, Prop } from "@stencil/core";

@Component({
  tag: "gx-query-viewer-format-style",
  shadow: false
})
export class QueryViewerFormatStyle {
  @Event() elementChanged: EventEmitter;

  /**
   * Type of the element Conditional or Format
   */
  @Prop() type: "Values" | "Conditional";
  /**
   * If Conditional Value to format
   */
  @Prop() value: string;
  /**
   * If Conditional true for applying to row or column
   */
  @Prop() applyToRowOrColumn: boolean;
  /**
   * Style or Css class
   */
  @Prop() styleOrClass: string;
  /**
   * If Format the operator of the element
   */
  @Prop() operator: "EQ" | "LT" | "GT" | "LE" | "GE" | "NE" | "IN";
  /**
   * If format first value
   */
  @Prop() value1: string;
  /**
   * If format second value
   */
  @Prop() value2: string;

  componentDidUpdate() {
    this.elementChanged.emit();
  }
}
