import { Component, Prop } from "@stencil/core";

@Component({
  tag: "gx-query-viewer-element-format-style",
  shadow: false
})
export class QueryViewerElementFormatStyle {
  /**
   * Type of the element Conditional or Format
   */
  @Prop() type: string;
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
  @Prop() operator: string;
  /**
   * If format first value
   */
  @Prop() value1: string;
  /**
   * If format second value
   */
  @Prop() value2: string;
}
