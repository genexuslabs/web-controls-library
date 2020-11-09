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

  @State() maxValue: number;

  @State() totalValues = 0;

  private children = [];

  private minimumSize: number;

  @Listen("gxGaugeRangeDidLoad")
  onGaugeRangeDidLoad({ detail: childRange }) {
    this.children = [...this.children, childRange];
    this.totalValues += childRange.amount;
    childRange.element.addEventListener("gxGaugeRangeDidUnload", () => {
      const index = this.children.findIndex(x => x === childRange);
      this.children.splice(index, 1);
      this.totalValues -= childRange.amount;
    });
    childRange.element.addEventListener("gxGaugeRangeDidUpdate", () => {
      const index = this.children.findIndex(x => x === childRange);
      this.children.splice(index, 1, childRange);
      this.totalValues = 0;
      for (const childInstance of this.children) {
        this.totalValues += childInstance.amount;
      }
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
    const MARKER_SIZE_THICKNESS_RATIO = 0.74;
    const GAUGE_CENTER_SIZE_THICKNESS_RATIO = 0.7935;
    const CIRCLE_GAUGE_TEXT_SIZE_THICKNESS_RATIO = 0.75;
    const ONE_PERCENT_OF_CIRCLE_DREGREE = 3.6;
    const ONE_PERCENT_OF_MINIMUM_SIZE = this.minimumSize / 100;
    const TWO_THIRDS_OF_ONE_PERCENT_OF_MINIMUM_SIZE = this.minimumSize / 150;
    let acumulation = 0;

    function calcPositionRange(preValue, valueParam) {
      acumulation += preValue;
      return valueParam + acumulation;
    }

    function renderSvgCircle(currentChild, nextChild, component): HTMLElement {
      return (
        <circle
          r="39.59%"
          cx="50%"
          cy="50%"
          stroke={currentChild.color}
          stroke-dasharray={`${(2.488 / (component.totalValues / 100)) *
            calcPositionRange(
              nextChild ? parseInt(nextChild.getAttribute("amount"), 10) : 0,
              parseInt(currentChild.getAttribute("amount"), 10)
            )}, 248.16`}
          fill="none"
          data-amount={currentChild.amount}
          stroke-width={`${component.calcThickness()}%`}
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
      svgRanges.splice(
        0,
        0,
        renderSvgCircle(childRanges[i], childRanges[i + 1], this)
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
          {svgRanges}
        </svg>
        <div
          class="gaugeContainer"
          style={{
            "box-shadow":
              (this.minimumSize <= 300 && this.thickness <= 25) ||
              !this.styleShadow
                ? "none"
                : "",
            height: `${calcSize(this.minimumSize, this.calcThickness())}px`,
            width: `${calcSize(this.minimumSize, this.calcThickness())}px`
          }}
        />
        {this.showValue ? (
          <span
            class="marker"
            style={{
              display: this.showValue ? "" : "none",
              height: `${Math.pow(this.minimumSize, GAUGE_EXPONENT_RATIO) *
                MARKER_SIZE_THICKNESS_RATIO -
                this.calcThickness() * ONE_PERCENT_OF_MINIMUM_SIZE}px`,
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
                "box-shadow":
                  (this.minimumSize <= 300 && this.thickness <= 25) ||
                  !this.styleShadow
                    ? "none"
                    : "",
                height:
                  ONE_PERCENT_OF_MINIMUM_SIZE +
                  this.calcThickness() *
                    TWO_THIRDS_OF_ONE_PERCENT_OF_MINIMUM_SIZE +
                  "px",
                transform:
                  "translateY(-" +
                  (ONE_PERCENT_OF_MINIMUM_SIZE +
                    this.calcThickness() *
                      TWO_THIRDS_OF_ONE_PERCENT_OF_MINIMUM_SIZE) +
                  "px)"
              }}
            />
          </span>
        ) : (
          ""
        )}
        <div
          class="gauge"
          style={{
            "box-shadow":
              (this.minimumSize <= 300 && this.thickness <= 25) ||
              !this.styleShadow
                ? "none"
                : "",
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
              {`${Math.min(
                Math.max(Math.round(this.calcPercentage()), 0),
                100
              )}%`}
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
    this.maxValue = this.totalValues + this.minValue;
    this.totalValues = this.maxValue - this.minValue;
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
