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
   * Property of type Style
   * Define the color of the center in _(Circle)_ gauge type.
   * Value in *hex, rgb, rgba, hsl, cmyk* format or *color name*.
   * _(Transparent by Default)_
   */
  @Prop() styleCenterColor = "transparent";

  /**
   * Property of type Style
   * Define the color of the center text in _(Circle)_ gauge type.
   * Value in *hex, rgb, rgba, hsl, cmyk* format or *color name*.
   * _(Gray by Default)_
   */
  @Prop() styleCenterTextColor = "gray";

  /**
   * Property of type Style.
   * Define if shadow will display or not. Default is disabled.
   */
  @Prop() styleShadow = false;

  /**
   * Property of type Style.
   * Define if border will display or not. Default is disabled.
   */
  @Prop() styleBorder = false;

  /**
   * Property of type Style.
   * Define the border width. Value in *px*.
   */
  @Prop() styleBorderWidth = 2;

  /**
   * Property of type Style.
   * Define the border color. Value in *hex, rgb, rgba, hsl, cmyk* format or *color name*.
   */
  @Prop() styleBorderColor = "rgb(0, 92, 129)";

  /**
   * This property allows you to select the gauge type. _(Circle or Line)_.
   * Default is linear type.
   */
  @Prop() gaugeType: "Line" | "Circle" = "Line";

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
      const inDex = this.children.findIndex(x => x === childRange);
      this.children.splice(inDex, 1);
      this.totValues -= childRange.amount;
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

  ////////////////////////////////////////

  render() {
    this.minorSize =
      this.element.offsetHeight > this.element.offsetWidth
        ? this.element.offsetWidth
        : this.element.offsetHeight;
    function calcPercentage(comp) {
      return (
        (comp.currentValue - comp.minValue) *
        100 /
        (comp.maxValue - comp.minValue)
      );
    }
    const childRanges = Array.from(
      this.element.querySelectorAll("gx-gauge-range")
    );
    this.maxValue = this.totValues + this.minValue;
    this.totValues = this.maxValue - this.minValue;
    if (this.gaugeType === "Circle") {
      const svgRanges = [];
      let acumul = 0;
      //////////////////////////////////////////
      function calcPositionRange(preValue, value) {
        acumul += preValue;
        return value + acumul;
      }
      //////////////////////////////////////////
      for (let i = childRanges.length - 1; i >= 0; i--) {
        svgRanges.push(
          <circle
            r="39.59%"
            cx="50%"
            cy="50%"
            stroke={childRanges[i].color}
            stroke-dasharray={
              "" +
              (2.488 /
                (this.totValues / 100) *
                calcPositionRange(
                  !!childRanges[i + 1]
                    ? parseInt(childRanges[i + 1].getAttribute("amount"), 10)
                    : 0,
                  parseInt(childRanges[i].getAttribute("amount"), 10)
                ) +
                ", 248.16")
            }
            fill="none"
            amount={childRanges[i].amount}
            stroke-width={"" + this.calcThickness() + "%"}
          />
        );
      }
      svgRanges.reverse();
      ////////////////////////////////////////
      // tslint:disable-next-line:no-console
      console.log(
        (this.minorSize * 0.795 -
          this.calcThickness() * (this.minorSize / 100)) /
          2
      );
      return (
        <div
          class="svgContainer"
          style={{
            height: this.minorSize * 1 + "px",
            width: this.minorSize * 1 + "px"
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            {svgRanges.map(gaugeRange => gaugeRange)}
          </svg>
          <div
            class="gaugeContainer"
            style={{
              border: this.styleBorder
                ? this.styleBorderWidth + "px solid " + this.styleBorderColor
                : "",
              "box-shadow":
                (this.minorSize <= 300 && this.thickness <= 25) ||
                !this.styleShadow
                  ? "none"
                  : "",
              height:
                this.minorSize * 0.8 +
                (this.calcThickness() * (this.minorSize / 100) -
                  this.minorSize / 100) +
                "px",
              width:
                this.minorSize * 0.8 +
                (this.calcThickness() * (this.minorSize / 100) -
                  this.minorSize / 100) +
                "px"
            }}
          />
          {this.showValue ? (
            <span
              class="marker"
              style={{
                display: this.showValue ? "" : "none",
                height:
                  this.minorSize * 0.795 -
                  this.calcThickness() * (this.minorSize / 100) +
                  "px",
                transform:
                  calcPercentage(this) >= 100
                    ? "rotate(359deg)"
                    : calcPercentage(this) > 0
                      ? "rotate(" + 3.6 * calcPercentage(this) + "deg)"
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
              "background-color": this.styleCenterColor,
              "box-shadow":
                (this.minorSize <= 300 && this.thickness <= 25) ||
                !this.styleShadow
                  ? "none"
                  : "",
              height:
                this.minorSize * 0.792 -
                this.calcThickness() * (this.minorSize / 100) +
                "px",
              width:
                this.minorSize * 0.792 -
                this.calcThickness() * (this.minorSize / 100) +
                "px"
            }}
          >
            {this.showValue ? (
              <div
                style={{
                  color: "" + this.styleCenterTextColor,
                  "font-size":
                    (this.minorSize * 0.795 -
                      this.calcThickness() / 2 * (this.minorSize / 100)) /
                      8 +
                    "px",
                  "mix-blend-mode": "difference"
                }}
              >
                {(calcPercentage(this) > 100
                  ? 100
                  : calcPercentage(this) < 0
                    ? 0
                    : Math.round(calcPercentage(this))) + "%"}
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      );
    } else if (this.gaugeType === "Line") {
      const divRanges = [];
      const divRangesName = [];
      let currentMargin = 0;
      let currentMargin2 = 0;
      //////////////////////////////////////////
      function calcPositionRange(preValue) {
        currentMargin += preValue;
        return currentMargin;
      }
      function calcPositionName(preValue) {
        currentMargin2 += preValue;
        return currentMargin2;
      }
      //////////////////////////////////////////
      for (let i = childRanges.length - 1; i >= 0; i--) {
        divRanges.push(
          <div
            class="range"
            style={{
              "background-color": childRanges[i].color,
              "box-shadow": !this.styleShadow ? "none" : "",
              "margin-left":
                calcPositionRange(
                  !!childRanges[i + 1]
                    ? parseInt(childRanges[i + 1].getAttribute("amount"), 10) *
                      100 /
                      this.totValues
                    : 0
                ) + "%",
              width:
                parseInt(childRanges[i].getAttribute("amount"), 10) *
                  100 /
                  this.totValues +
                "%"
            }}
          />
        );
        divRangesName.push(
          <span
            class="rangeName"
            style={{
              "margin-left":
                calcPositionName(
                  !!childRanges[i + 1]
                    ? parseInt(childRanges[i + 1].getAttribute("amount"), 10) *
                      100 /
                      this.totValues
                    : 0
                ) + "%",
              width:
                parseInt(childRanges[i].getAttribute("amount"), 10) *
                  100 /
                  this.totValues +
                "%"
            }}
          >
            {childRanges[i].name}
          </span>
        );
      }
      divRanges.reverse();
      divRangesName.reverse();
      return (
        <div
          class="gaugeContainerLine"
          style={{
            border: this.styleBorder
              ? this.styleBorderWidth + "px solid " + this.styleBorderColor
              : "",
            height: 5 * this.calcThickness() + "px"
          }}
        >
          <div class="rangesContainer">
            {divRanges.map(gaugeRange => gaugeRange)}
          </div>
          <div class="namesContainer">
            {divRangesName.map(gaugeRange => gaugeRange)}
          </div>
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
                    calcPercentage(this) >= 100
                      ? "99.45%"
                      : calcPercentage(this) > 0
                        ? calcPercentage(this) - 0.1 + "%"
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
                transform:
                  "translateY(" + (8 * this.calcThickness() + 100) + "%)"
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
    } else {
      // tslint:disable-next-line:no-console
      console.warn(
        "Error rendering component. Invalid gaugeType in ",
        this.element
      );
    }
  }
}
