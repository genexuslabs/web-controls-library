import {
  Component,
  Element,
  Event,
  EventEmitter,
  Listen,
  Prop,
  State
} from "@stencil/core";

import { IComponent } from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "gauge.scss",
  tag: "gx-gauge"
})
export class Gauge implements IComponent {
  @Element() element: HTMLElement;

  @Event() gxGaugeDidLoad: EventEmitter;

  /**
   * Property of type Style.
   * Define if shadow will display or not. Default is disabled.
   */
  @Prop() styleShadow = false;

  /**
   * This property allows you to select the gauge type. _(Circle or Line)_.
   * Default is linear type.
   */
  @Prop() gaugeType: "line" | "circle" = "line";

  /**
   *  Allows display current value. Default is disabled.
   *
   */
  @Prop() showValue = false;

  /**
   * The Minimum Value of the gauge
   *
   */
  @Prop() minValue: number;

  /**
   * The Currecnt value indicanding in the gauge
   *
   */
  @Prop() currentValue: number = this.minValue;

  /**
   * This allows specifying the width of the circumference _(When gauge is Circle type)_ and the width of the bar _(When gauge is Line type)_ in % relative the component size.
   *
   */
  @Prop() thickness = 10;

  @State() maxValue: number;

  @State() totValues = this.minValue;

  @State() children = [];

  @State() minorSize: number;

  @Listen("gxGaugeRangeDidLoad")
  onGaugeRangeDidLoad({ detail: childRange }) {
    this.children = [...this.children, childRange];
    this.totValues += childRange.amount;
    childRange.element.addEventListener("gxGaugeRangeDidUnload", () => {
      const index = this.children.findIndex(x => x === childRange);
      this.children.splice(index, 1);
      this.totValues -= childRange.amount;
    });
    childRange.element.addEventListener("gxGaugeRangeDidUpdate", () => {
      const index = this.children.findIndex(x => x === childRange);
      this.children.splice(index, 1, childRange);
      this.totValues = 0;
      for (const childInstance of this.children) {
        this.totValues += childInstance.amount;
      }
    });
  }

  componentWillLoad() {
    this.totValues = 0;
  }

  private calcThickness() {
    return typeof this.thickness === "number" &&
      (this.thickness > 0 && this.thickness <= 100)
      ? this.thickness / 5
      : 10;
  }

  private calcPercentage() {
    return (
      (this.currentValue - this.minValue) *
      100 /
      (this.maxValue - this.minValue)
    );
  }

  private renderCircle(childRanges) {
    const svgRanges = [];
    let acumulation = 0;
    //////////////////////////////////////////
    function calcPositionRange(preValue, value) {
      acumulation += preValue;
      return value + acumulation;
    }

    function addSVGCircle(currentChild, nextChild, component) {
      return (
        <circle
          r="39.59%"
          cx="50%"
          cy="50%"
          stroke={currentChild.color}
          stroke-dasharray={`${2.488 /
            (component.totValues / 100) *
            calcPositionRange(
              !!nextChild ? parseInt(nextChild.getAttribute("amount"), 10) : 0,
              parseInt(currentChild.getAttribute("amount"), 10)
            )}, 248.16`}
          fill="none"
          amount={currentChild.amount}
          stroke-width={`${component.calcThickness()}%`}
        />
      );
    }
    //////////////////////////////////////////
    for (let i = childRanges.length - 1; i >= 0; i--) {
      svgRanges.push(addSVGCircle(childRanges[i], childRanges[i + 1], this));
    }
    svgRanges.reverse();
    return (
      <div
        class="svgContainer"
        style={{
          height: `${this.minorSize * 1}px`,
          width: `${this.minorSize * 1}px`
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          {svgRanges}
        </svg>
        <div
          class="gaugeContainer"
          style={{
            "box-shadow":
              (this.minorSize <= 300 && this.thickness <= 25) ||
              !this.styleShadow
                ? "none"
                : "",
            height: `${this.minorSize * 0.8 +
              (this.calcThickness() * (this.minorSize / 100) -
                this.minorSize / 100)}px`,
            width: `${this.minorSize * 0.8 +
              (this.calcThickness() * (this.minorSize / 100) -
                this.minorSize / 100)}px`
          }}
        />
        {this.showValue ? (
          <span
            class="marker"
            style={{
              display: this.showValue ? "" : "none",
              height: `${this.minorSize * 0.795 -
                this.calcThickness() * (this.minorSize / 100)}px`,
              transform:
                this.calcPercentage() >= 100
                  ? "rotate(359deg)"
                  : this.calcPercentage() > 0
                    ? `rotate(${3.6 * this.calcPercentage()}deg)`
                    : "rotate(0.5deg)"
            }}
          >
            <div
              class="indicator"
              style={{
                "box-shadow":
                  (this.minorSize <= 300 && this.thickness <= 25) ||
                  !this.styleShadow
                    ? "none"
                    : "",
                height:
                  this.minorSize / 100 +
                  this.calcThickness() * (this.minorSize / 150) +
                  "px",
                transform:
                  "translateY(-" +
                  (this.minorSize / 100 +
                    this.calcThickness() * (this.minorSize / 150)) +
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
              (this.minorSize <= 300 && this.thickness <= 25) ||
              !this.styleShadow
                ? "none"
                : "",
            height: `${this.minorSize * 0.792 -
              this.calcThickness() * (this.minorSize / 100)}px`,
            width: `${this.minorSize * 0.792 -
              this.calcThickness() * (this.minorSize / 100)}px`
          }}
        >
          {this.showValue ? (
            <div
              style={{
                "font-size": `${(this.minorSize * 0.795 -
                  this.calcThickness() / 2 * (this.minorSize / 100)) /
                  8}px`
              }}
            >
              {this.calcPercentage() > 100
                ? 100
                : this.calcPercentage() < 0
                  ? 0
                  : `${Math.round(this.calcPercentage())}%`}
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
    //////////////////////////////////////////
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
                ? parseInt(nextChild.getAttribute("amount"), 10) *
                  100 /
                  component.totValues
                : 0
            )}%`,
            width: `${parseInt(currentChild.getAttribute("amount"), 10) *
              100 /
              component.totValues}%`
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
            width: `${parseInt(currentChild.getAttribute("amount"), 10) *
              100 /
              component.totValues}%`
          }}
        >
          {currentChild.name}
        </span>
      );
    }
    //////////////////////////////////////////
    for (let i = childRanges.length - 1; i >= 0; i--) {
      // create a function to return this structure (like addSVGCircle)
      divRanges.push(addLineRanges(childRanges[i], childRanges[i + 1], this));
      divRangesName.push(addRangeCaption(childRanges[i], this));
    }
    divRanges.reverse();
    divRangesName.reverse();
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
                "margin-left":
                  this.calcPercentage() >= 100
                    ? "99.45%"
                    : this.calcPercentage() > 0
                      ? `${this.calcPercentage() - 0.1}%`
                      : "0.2%"
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
              transform: `translateY(${8 * this.calcThickness() + 100}%)`
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
  ////////////////////////////////////////

  render() {
    this.minorSize =
      this.element.offsetHeight > this.element.offsetWidth
        ? this.element.offsetWidth
        : this.element.offsetHeight;
    const childRanges = Array.from(
      this.element.querySelectorAll("gx-gauge-range")
    );
    this.maxValue = this.totValues + this.minValue;
    this.totValues = this.maxValue - this.minValue;
    if (this.gaugeType === "circle") {
      return this.renderCircle(childRanges);
    } else if (this.gaugeType === "line") {
      return this.renderLine(childRanges);
    } else {
      // tslint:disable-next-line:no-console
      console.warn(
        "Error rendering component. Invalid gaugeType in ",
        this.element
      );
    }
  }
}
