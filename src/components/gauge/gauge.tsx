import {
  Component,
  Element,
  Event,
  EventEmitter,
  Listen,
  Prop,
  State,
  h
} from "@stencil/core";

import { Component as GxComponent } from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "gauge.scss",
  tag: "gx-gauge"
})
export class Gauge implements GxComponent {
  @Element() element: HTMLGxGaugeElement;

  /**
   * The `gxGaugeDidLoad` event is triggered when the component has been rendered completely.
   */
  @Event() gxGaugeDidLoad: EventEmitter;

  /**
   * This property allows selecting the gauge type. The allowed values are `circle` or `line` (defautl).
   */
  @Prop() type: "line" | "circle" = "line";

  /**
   *  Set `true` to display the current value. Default is `false`.
   *
   */
  @Prop() showValue = false;

  /**
   * The minimum value of the gauge
   * 0 by Default
   */
  @Prop() minValue = 0;

  /**
   * The current value of the gauge
   *
   */
  @Prop() value: number;

  /**
   * Allows specify the width of the circumference _(When gauge is circle type)_ or the width of the bar _(When gauge is Line type)_ in % relative the component size.
   *
   */
  @Prop() thickness = 10;

  /**
   * The maximum value of the gauge.
   * This prop allows specify the maximum value that the gauge will handle. If there is no value specified it will be calculated by the sum of all gx-ranges values
   */
  @Prop() maxValue: number;

  @State() rangesChildren = [];

  private rangesValuesAcumul = 0;

  private maxValueAux = this.minValue;

  private minimumSize: number;

  @Listen("gxGaugeRangeDidLoad")
  onGaugeRangeDidLoad({ detail: childRange }) {
    this.rangesChildren = [...this.rangesChildren, childRange];
    this.maxValueAux += childRange.amount;
    childRange.element.addEventListener("gxGaugeRangeDidUnload", () => {
      this.rangesChildren = this.rangesChildren.filter(
        elementToSave => elementToSave != childRange
      );
      this.maxValueAux -= childRange.amount;
    });
    childRange.element.addEventListener("gxGaugeRangeDidUpdate", () => {
      const index = this.rangesChildren.findIndex(
        elementFinding => elementFinding === childRange
      );
      this.rangesChildren.splice(index, 1, childRange);
      this.maxValueAux = 0;
      for (const childInstance of this.rangesChildren) {
        this.maxValueAux += childInstance.amount;
      }
    });
  }

  componentDidLoad() {
    // sodf
  }

  private calcThickness(): number {
    return typeof this.thickness === "number" &&
      this.thickness > 0 &&
      this.thickness <= 100
      ? this.thickness / 5
      : 10;
  }

  private calcPercentage() {
    return (
      ((this.value - this.minValue) * 100) / (this.maxValue - this.minValue)
    );
  }

  private renderCircle(childRanges) {
    const FULL_CIRCLE_RADIO = 100 / 2;
    const svgRanges = [];
    const ONE_PERCENT_OF_CIRCLE_DREGREE = 3.6;
    const radius = FULL_CIRCLE_RADIO - this.thickness / 2;

    function renderSvgCircle(currentChild, position, component): HTMLElement {
      const FULL_CIRCLE_RADIANS = 2 * Math.PI;
      const ROTATION_FIX = -90;
      const circleLength = FULL_CIRCLE_RADIANS * radius;
      const valuePercentage = (100 * currentChild.amount) / component.maxValue;
      return (
        <circle
          r={radius}
          cx="50%"
          cy="50%"
          stroke={currentChild.color}
          stroke-dasharray={`${circleLength *
            (valuePercentage / 100)}, ${circleLength}`}
          fill="none"
          transform={`rotate(${position + ROTATION_FIX} 50,50)`}
          data-amount={currentChild.amount}
          stroke-width={`${component.thickness}%`}
        />
      );
    }

    this.maxValueAux = 0;
    for (let i = childRanges.length - 1; i >= 0; i--) {
      this.maxValueAux += childRanges[i].amount;
    }
    if (this.maxValue == undefined) {
      this.maxValue = this.maxValueAux;
    }
    this.rangesValuesAcumul = 0;
    for (let i = childRanges.length - 1; i >= 0; i--) {
      const rangeValuePercentage =
        (100 * childRanges[i].amount) / this.maxValue;
      const positionInGauge = 360 * (this.rangesValuesAcumul / 100);

      this.rangesValuesAcumul += rangeValuePercentage;
      svgRanges.splice(
        0,
        0,
        renderSvgCircle(childRanges[i], positionInGauge, this)
      );
    }

    return (
      <div
        class="svgContainer"
        style={{
          height: `${this.minimumSize}px`,
          width: `${this.minimumSize}px`
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          <circle
            r={radius}
            cx="50%"
            cy="50%"
            stroke={"rgba(0, 0, 0, 0.2)"}
            fill="none"
            stroke-width={`${this.thickness / 2}%`}
          />
          {svgRanges}
        </svg>
        <div
          class="gaugeContainer"
          style={{
            height: `${this.minimumSize}px`,
            width: `${this.minimumSize}px`
          }}
        />
        {this.showValue ? (
          <span
            class="marker"
            style={{
              display: this.showValue ? "" : "none",
              height: `${this.minimumSize}px`,
              width: `${this.thickness / 8}px`,
              transform:
                this.calcPercentage() >= 100
                  ? "rotate(359.9deg)"
                  : this.calcPercentage() > 0
                  ? `rotate(${ONE_PERCENT_OF_CIRCLE_DREGREE *
                      this.calcPercentage()}deg)`
                  : "rotate(0.5deg)"
            }}
          >
            <div
              class="indicator"
              style={{
                height: `${(this.minimumSize * this.thickness) / 100}px`
              }}
            />
          </span>
        ) : (
          ""
        )}
        <div
          class="gauge"
          style={{
            height: `${this.minimumSize}px`,
            width: `${this.minimumSize}px`
          }}
        >
          {this.showValue ? (
            <div>{`${this.value} / ${this.maxValue}`}</div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }

  private renderLine(childRanges) {
    const divRanges = [];
    const divRangesName = [];

    function addLineRanges(currentChild, position, component): HTMLElement {
      return (
        <div
          class="range"
          style={{
            "background-color": currentChild.color,
            "margin-left": `${position}%`,
            width: `${(currentChild.amount * 100) / component.maxValue}%`
          }}
        />
      );
    }

    function addRangeCaption(currentChild, position, component) {
      return (
        <span
          class="rangeName"
          style={{
            "margin-left": `${position}%`,
            color: currentChild.color,
            width: `${(currentChild.amount * 100) / component.maxValue}%`
          }}
        >
          {currentChild.name}
        </span>
      );
    }

    this.maxValueAux = 0;
    for (let i = childRanges.length - 1; i >= 0; i--) {
      this.maxValueAux += childRanges[i].amount;
    }
    if (this.maxValue == undefined) {
      this.maxValue = this.maxValueAux - this.minValue;
    }
    this.rangesValuesAcumul = 0;
    for (let i = childRanges.length - 1; i >= 0; i--) {
      const rangeValuePercentage =
        (100 * childRanges[i].amount) / this.maxValue;
      const positionInGauge = this.rangesValuesAcumul;

      this.rangesValuesAcumul += rangeValuePercentage;
      divRanges.splice(
        0,
        0,
        addLineRanges(childRanges[i], positionInGauge, this)
      );
      divRangesName.splice(
        0,
        0,
        addRangeCaption(childRanges[i], positionInGauge, this)
      );
    }
    console.log("this.calcPercentage()", this.calcPercentage());
    return (
      <div
        class="gaugeContainerLine"
        style={{
          height: `${10 * this.calcThickness()}px`
        }}
      >
        <div class="gauge">
          {this.showValue ? (
            <span
              class="marker"
              style={{
                "margin-left": `${Math.min(
                  Math.max(this.calcPercentage(), 0.2),
                  99.5
                )}%`
              }}
            >
              <span
                class="marker-value"
                style={{
                  "margin-left": `${(this.calcPercentage() / 100 - 0.5) *
                    -32}px`
                }}
              >
                {this.value}
              </span>
              <span class="pin" />
            </span>
          ) : (
            ""
          )}
        </div>
        <div
          class="rangesContainer"
          style={{ height: `${2 * this.thickness}px` }}
        >
          {divRanges}
        </div>
        <div class="namesContainer">{divRangesName}</div>
        {this.showValue ? (
          <div class="minMaxDisplay">
            <span class="minValue">
              {this.minValue}
              <span />
            </span>
            <span class="maxValue">
              {this.maxValue}
              <span />
            </span>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }

  render() {
    this.minimumSize =
      this.element.offsetHeight > this.element.offsetWidth
        ? this.element.offsetWidth
        : this.element.offsetHeight;
    const childRanges = Array.from(
      this.element.querySelectorAll("gx-gauge-range")
    );
    if (this.type === "circle") {
      return this.renderCircle(childRanges);
    } else if (this.type === "line") {
      return this.renderLine(childRanges);
    } else {
      // tslint:disable-next-line:no-console
      console.warn(
        "Error rendering component. Invalid type of gauge in ",
        this.element
      );
    }
  }
}
