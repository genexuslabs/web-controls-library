import { Component, Element, Event, EventEmitter, Prop } from "@stencil/core";

import { Component as GxComponent } from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "gauge-range.scss",
  tag: "gx-gauge-range"
})
export class GaugeRange implements GxComponent {
  @Element() element: HTMLGxGaugeRangeElement;

  /**
   * The range length.
   *
   */
  @Prop() amount: number;

  /**
   * The name of the range.
   *
   */
  @Prop() name: string;

  /**
   * Color property defines the color of range background.
   * Color value can be any valid CSS color.
   *
   */
  @Prop() color: string;

  /**
   * The gxGaugeRangeDidLoad is triggered when the component has been added and its render completely ran.
   */
  @Event() gxGaugeRangeDidLoad: EventEmitter;

  /**
   * The gxGaugeRangeDidUnload is triggered when the component has been deleted
   */
  @Event() gxGaugeRangeDidUnload: EventEmitter;

  /**
   * The gxGaugeRangeDidUpdate is triggered when a property of the component has been changed.
   */
  @Event() gxGaugeRangeDidUpdate: EventEmitter;

  componentDidLoad() {
    this.gxGaugeRangeDidLoad.emit(this);
  }

  componentDidUnload() {
    this.gxGaugeRangeDidUnload.emit(this);
  }

  componentDidUpdate() {
    this.gxGaugeRangeDidUpdate.emit(this);
  }

  render() {
    return "";
  }
}
