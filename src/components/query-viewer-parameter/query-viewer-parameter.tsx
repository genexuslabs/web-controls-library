import { Component, Prop } from "@stencil/core";

@Component({
  tag: "gx-query-viewer-parameter",
  shadow: false
})
export class QueryViewerParameter {
  /**
   * Name of the parameter
   */
  @Prop() Name: string;
  /**
   * Value of the parameter
   */
  @Prop() Value: string;
}
