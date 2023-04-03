import { Component, Event, EventEmitter, Prop, Watch } from "@stencil/core";

@Component({
  tag: "gx-query-viewer-parameter",
  shadow: false
})
export class QueryViewerParameter {
  // eslint-disable-next-line @stencil-community/required-jsdoc
  @Event()
  parameterValueChanged: EventEmitter<QueryViewerParameterChangedEvent>;

  /**
   * Name of the parameter
   */
  @Prop() readonly Name: string;
  /**
   * Value of the parameter
   */
  @Prop() readonly Value: string;

  @Watch("Value")
  watchValueHandler(newValue: string, oldValue: string) {
    this.parameterValueChanged.emit({
      name: this.Name,
      oldValue,
      newValue
    });
  }
}

export interface QueryViewerParameterChangedEvent {
  name: string;
  oldValue: string;
  newValue: string;
}
