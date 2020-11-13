import {
  Component,
  Element,
  Event,
  EventEmitter,
  Listen,
  Prop,
  // State,
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
   * The `gxGaugeDidLoad` event is triggered when component has been rendered completely.
   */
  @Event() gxGaugeDidLoad: EventEmitter;

  /**
   * Property of type Style.
   * Define if shadow will display or not. Default is disabled.
   */
  @Prop() styleShadow = false;

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
   *
   */
  @Prop() minValue: number;

  /**
   * The current value of the gauge
   *
   */
  @Prop() value: number;

  /**
   * This allows specifying the width of the circumference _(When gauge is circle type)_ and the width of the bar _(When gauge is Line type)_ in % relative the component size.
   *
   */
  @Prop() thickness = 10;

  @Prop() maxValue = 100;

  // private totalValues = 0;

  private rangesValuesAcumul = 0;

  private children = [];

  private minimumSize: number;

  @Listen("gxGaugeRangeDidLoad")
  onGaugeRangeDidLoad({ detail: childRange }) {
    this.children = [...this.children, childRange];
    childRange.element.addEventListener("gxGaugeRangeDidUnload", () => {
      const index = this.children.findIndex(x => x === childRange);
      this.children.splice(index, 1);
    });
    childRange.element.addEventListener("gxGaugeRangeDidUpdate", () => {
      const index = this.children.findIndex(x => x === childRange);
      this.children.splice(index, 1, childRange);
    });
  }

  componentDidLoad() {
    this.element.setAttribute(
      "style",
      this.element.getAttribute("style") +
        `--minimum-size: ${this.minimumSize}px`
    );
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
    const svgRanges = [];
    const GAUGE_CONTAINER_SIZE_THICKNESS_RATIO = 0.806;
    const GAUGE_EXPONENT_RATIO = 0.9985;
    const GAUGE_CENTER_SIZE_THICKNESS_RATIO = 0.7935;
    const CIRCLE_GAUGE_TEXT_SIZE_THICKNESS_RATIO = 0.75;
    const ONE_PERCENT_OF_CIRCLE_DREGREE = 3.6;
    const ONE_PERCENT_OF_MINIMUM_SIZE = this.minimumSize / 100;

    function renderSvgCircle(currentChild, position, component): HTMLElement {
      const FULL_CIRCLE_RADIO = 100 / 2;
      const FULL_CIRCLE_RADIANS = 2 * Math.PI;
      const ROTATION_FIX = -90;
      const radius = FULL_CIRCLE_RADIO - component.thickness / 2;
      const circleLength = FULL_CIRCLE_RADIANS * radius;
      const valuePercentage = (100 * currentChild.amount) / component.maxValue;
      return (
        <circle
          r={radius} //"39.59%"
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

    function calcSize(minSize: number, thickness: number): number {
      return (
        Math.pow(minSize, GAUGE_EXPONENT_RATIO) *
          GAUGE_CONTAINER_SIZE_THICKNESS_RATIO +
        (thickness * ONE_PERCENT_OF_MINIMUM_SIZE - ONE_PERCENT_OF_MINIMUM_SIZE)
      );
    }

    for (let i = childRanges.length - 1; i >= 0; i--) {
      const rangeValuePercentage =
        (100 * childRanges[i].amount) / this.maxValue;
      const positionInGauge = 360 * (this.rangesValuesAcumul / 100);
      console.log(positionInGauge, this.rangesValuesAcumul);
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
          {/* <line
            x1="50"
            y1="0"
            x2="50"
            y2="100"
            stroke="black"
            stroke-width="0.2"
          />
          <line
            x1="0"
            y1="50"
            x2="100"
            y2="50"
            stroke="black"
            stroke-width="0.2"
          />
          <line
            x1="0"
            y1="0"
            x2="100"
            y2="100"
            stroke="black"
            stroke-width="0.2"
          />
          <line
            x1="100"
            y1="0"
            x2="0"
            y2="100"
            stroke="black"
            stroke-width="0.2"
          />
          <rect r="1" fill="rgba(0, 0, 0, 0.5)" width="100%" height="100%" /> */}
          {svgRanges}
        </svg>
        <div
          class="gaugeContainer"
          style={{
            height: `${calcSize(this.minimumSize, this.calcThickness())}px`,
            width: `${calcSize(this.minimumSize, this.calcThickness())}px`
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
                  ? "rotate(359deg)"
                  : this.calcPercentage() > 0
                  ? `rotate(${ONE_PERCENT_OF_CIRCLE_DREGREE *
                      this.calcPercentage()}deg)`
                  : "rotate(0.5deg)"
            }}
          >
            <div
              class="indicator"
              style={{
                height: `${this.thickness * 1.5}px`
              }}
            />
          </span>
        ) : (
          ""
        )}
        <div
          class="gauge"
          style={{
            height: `${this.minimumSize * GAUGE_CENTER_SIZE_THICKNESS_RATIO -
              this.calcThickness() * ONE_PERCENT_OF_MINIMUM_SIZE}px`,
            width: `${this.minimumSize * GAUGE_CENTER_SIZE_THICKNESS_RATIO -
              this.calcThickness() * ONE_PERCENT_OF_MINIMUM_SIZE}px`
          }}
        >
          {this.showValue ? (
            <div
              style={{
                "font-size": `${(this.minimumSize *
                  CIRCLE_GAUGE_TEXT_SIZE_THICKNESS_RATIO -
                  (this.calcThickness() / 2) * ONE_PERCENT_OF_MINIMUM_SIZE) /
                  8}px`
              }}
            >
              {this.value}
            </div>
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
    let currentMargin = 0;

    function calcPositionRange(preValue) {
      return (currentMargin += preValue);
    }

    function addLineRanges(currentChild, nextChild, component) {
      return (
        <div
          class="range"
          style={{
            "background-color": currentChild.color,
            "box-shadow": !component.styleShadow ? "none" : "",
            "margin-left": `${calcPositionRange(
              !!nextChild
                ? (parseInt(nextChild.getAttribute("amount"), 10) * 100) /
                    component.totalValues
                : 0
            )}%`,
            width: `${(parseInt(currentChild.getAttribute("amount"), 10) *
              100) /
              component.totalValues}%`
          }}
        />
      );
    }

    function addRangeCaption(currentChild, component) {
      return (
        <span
          class="rangeName"
          style={{
            "margin-left": `${currentMargin}%`,
            width: `${(parseInt(currentChild.getAttribute("amount"), 10) *
              100) /
              component.totalValues}%`
          }}
        >
          {currentChild.name}
        </span>
      );
    }

    for (let i = childRanges.length - 1; i >= 0; i--) {
      divRanges.splice(
        0,
        0,
        addLineRanges(childRanges[i], childRanges[i + 1], this)
      );
      divRangesName.splice(0, 0, addRangeCaption(childRanges[i], this));
    }

    const DISPLAYERS_THICKNESS_RATIO = 8;
    return (
      <div
        class="gaugeContainerLine"
        style={{
          height: `${5 * this.calcThickness()}px`
        }}
      >
        <div class="rangesContainer">{divRanges}</div>
        <div class="namesContainer">{divRangesName}</div>
        <div
          class="gauge"
          style={{
            "box-shadow": !this.styleShadow ? "none" : ""
          }}
        >
          {this.showValue ? (
            <span
              class="marker"
              style={{
                "box-shadow": !this.styleShadow ? "none" : "",
                "margin-left": `${Math.min(
                  Math.max(this.calcPercentage(), 0.2),
                  99.5
                )}%`
              }}
            />
          ) : (
            ""
          )}
        </div>
        {this.showValue ? (
          <div
            class="minMaxDisplay"
            style={{
              transform: `translateY(${DISPLAYERS_THICKNESS_RATIO *
                this.calcThickness() +
                100}%)`
            }}
          >
            <span
              class="minValue"
              style={{
                "box-shadow": !this.styleShadow ? "none" : ""
              }}
            >
              {this.minValue}
              <span />
            </span>
            <span
              class="maxValue"
              style={{
                "box-shadow": !this.styleShadow ? "none" : ""
              }}
            >
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
    // this.maxValue = this.totalValues + this.minValue;
    // this.totalValues = this.maxValue - this.minValue;
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
