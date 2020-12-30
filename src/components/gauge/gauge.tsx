import {
  Component,
  Element,
  Event,
  EventEmitter,
  Host,
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
    // Possible improvement here. Check the approach applied in navbar.jsx line 103
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

  private calcTotalValues(): number {
    return this.maxValue == undefined
      ? this.maxValueAux
      : this.maxValue - this.minValue;
  }

  private calcThickness(): number {
    return typeof this.thickness === "number" &&
      this.thickness > 0 &&
      this.thickness <= 100
      ? this.thickness / 5
      : 10;
  }

  private calcPercentage(): number {
    return ((this.value - this.minValue) * 100) / this.calcTotalValues();
  }

  private addCircleRanges(
    { amount, color },
    position: number,
    radius: number
  ): any {
    const FULL_CIRCLE_RADIANS = 2 * Math.PI;
    const ROTATION_FIX = -90;
    const circleLength = FULL_CIRCLE_RADIANS * radius;
    const valuePercentage = (100 * amount) / this.calcTotalValues();
    return (
      <circle
        class="circle-range"
        r={radius}
        cx="50%"
        cy="50%"
        stroke={color}
        stroke-dasharray={`${circleLength *
          (valuePercentage / 100)}, ${circleLength}`}
        fill="none"
        transform={`rotate(${position + ROTATION_FIX} 50,50)`}
        data-amount={amount}
        stroke-width={`${this.thickness}%`}
      />
    );
  }

  private addLineRanges({ amount, color }, position: number): any {
    return (
      <div
        class="range"
        style={{
          "background-color": color,
          "margin-left": `${position}%`,
          width: `${(amount * 100) / this.calcTotalValues()}%`
        }}
      />
    );
  }

  private addCircleRangesLabels({ amount, color, name }): any {
    return (
      <div class="range-label">
        <div style={{ "border-color": color }}></div>
        <span>
          {amount} - {name}
        </span>
      </div>
    );
  }

  private addLineRangesLabels({ amount, color, name }, position: number): any {
    return (
      <span
        class="rangeName"
        style={{
          "margin-left": `${position}%`,
          color: color,
          width: `${(amount * 100) / this.calcTotalValues()}%`
        }}
      >
        {name}
      </span>
    );
  }

  private renderCircle(
    childRanges: Array<HTMLGxGaugeRangeElement>
  ): HTMLElement {
    const FULL_CIRCLE_RADIO = 100 / 2;
    const svgRanges = [];
    const labelsRanges = [];
    const ONE_PERCENT_OF_CIRCLE_DREGREE = 3.6;
    const radius = FULL_CIRCLE_RADIO - this.thickness / 2;

    this.maxValueAux = 0;
    for (let i = childRanges.length - 1; i >= 0; i--) {
      this.maxValueAux += childRanges[i].amount;
    }

    let positionInGauge = 0;
    const totalAmount = this.calcTotalValues();
    for (let i = 0; i < childRanges.length; i++) {
      svgRanges.push(
        this.addCircleRanges(childRanges[i], positionInGauge, radius)
      );
      labelsRanges.push(this.addCircleRangesLabels(childRanges[i]));

      positionInGauge += (360 * childRanges[i].amount) / totalAmount;
    }

    return (
      <Host>
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
          <div class="gauge">
            {this.showValue ? (
              <div>
                <span class="current-value">{`${this.value}`}</span>
                <span>{`${this.minValue}`}</span>
                <span>{`-`}</span>
                <span>{`${
                  this.maxValue === undefined ? this.maxValueAux : this.maxValue
                }`}</span>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <div class="labelsContainerCircle">{labelsRanges}</div>
      </Host>
    );
  }

  private renderLine(childRanges) {
    const divRanges = [];
    const divRangesName = [];

    this.maxValueAux = 0;
    for (let i = childRanges.length - 1; i >= 0; i--) {
      this.maxValueAux += childRanges[i].amount;
    }

    let positionInGauge = 0;
    const totalAmount = this.calcTotalValues();
    for (let i = 0; i < childRanges.length; i++) {
      divRanges.push(this.addLineRanges(childRanges[i], positionInGauge));
      divRangesName.push(
        this.addLineRangesLabels(childRanges[i], positionInGauge)
      );

      positionInGauge += (100 * childRanges[i].amount) / totalAmount;
    }

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
        <div class="labelsContainerLine">{divRangesName}</div>
        {this.showValue ? (
          <div class="minMaxDisplay">
            <span class="minValue">
              {this.minValue}
              <span />
            </span>
            <span class="maxValue">
              {this.maxValue == undefined ? this.maxValueAux : this.maxValue}
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
