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
   *  Set `true` to display the minimum and maximum value. Default is `false`.
   *
   */
  @Prop() showMinMax = false;

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

  @State() labelsOverflow = false;

  @State() lineCurrentValuePosition: "Left" | "Center" | "Right" = "Center";

  @State() lineIndicatorPosition: "Left" | "Center" | "Right" = "Center";

  private maxValueAux = this.minValue;

  private totalAmount = 0;

  private watchForItemsObserver: ResizeObserver;

  private labelsSubContainer1: HTMLDivElement;

  private labelsSubContainer2: HTMLDivElement;

  private linearCurrentValueContainer: HTMLDivElement;

  private linearCurrentValue: HTMLDivElement;

  private linearIndicator: HTMLDivElement;

  private circleCurrentValue: HTMLSpanElement;

  private SVGcircle: SVGCircleElement;

  @Listen("gxGaugeRangeDidLoad")
  onGaugeRangeDidLoad({ detail: childRange }) {
    this.rangesChildren = [...this.rangesChildren, childRange];
    this.totalAmount += childRange.amount;
    // Possible improvement here. Check the approach applied in navbar.jsx line 103
    childRange.element.addEventListener("gxGaugeRangeDidUnload", () => {
      this.rangesChildren = this.rangesChildren.filter(
        elementToSave => elementToSave != childRange
      );
      this.totalAmount -= childRange.amount;
    });
    childRange.element.addEventListener("gxGaugeRangeDidUpdate", () => {
      const index = this.rangesChildren.findIndex(
        elementFinding => elementFinding === childRange
      );
      this.rangesChildren.splice(index, 1, childRange);
      this.totalAmount = 0;
      for (const childInstance of this.rangesChildren) {
        this.totalAmount += childInstance.amount;
      }
    });
  }

  /*  If showValue == true and gauge type == circle, it creates a
      ResizeObserver to implement the font and indicator container 
      responsiveness
  */
  connectedCallback() {
    if (this.showValue && this.type === "circle") {
      this.watchForItemsObserver = new ResizeObserver(() => {
        const fontSize =
          Math.min(
            this.SVGcircle.getBoundingClientRect().height,
            this.SVGcircle.getBoundingClientRect().width
          ) / 2.5;

        // Updates the font size
        this.circleCurrentValue.style.fontSize = `${fontSize}px`;
      });

      // Observe the gauge
      this.watchForItemsObserver.observe(this.element);
    }
  }

  /*  If gauge type == line, it creates a ResizeObserver to implement 
      `current-value` and `indicator` centering responsiveness and range labels
      responsiveness
  */
  componentDidLoad() {
    if (this.type === "line") {
      this.watchForItemsObserver = new ResizeObserver(() => {
        if (this.showValue) {
          this.setValueAndIndicatorPosition();
        }

        // This only happens when the component has not yet been rendered to
        // get the `labelsSubContainer2` reference
        if (this.labelsOverflow && this.labelsSubContainer2 == undefined) {
          return;
        }

        const fontSize = !this.labelsOverflow
          ? this.labelsSubContainer1.getBoundingClientRect().height
          : this.labelsSubContainer2.getBoundingClientRect().height;

        // Depending on the current fontSize, it decides the position where
        // the labels will be placed
        if (fontSize > this.calcThickness() * 2) {
          this.labelsOverflow = true;
        } else {
          this.labelsOverflow = false;
        }
      });

      // Observe the `current-value` in the line gauge type
      this.watchForItemsObserver.observe(this.linearCurrentValueContainer);
    }
  }

  /*  After the render, it asks for 'getBoundingClientRect()' and centers the
      'current-value' in line gauge type
  */
  componentDidRender() {
    if (this.showValue && this.type === "line") {
      this.setValueAndIndicatorPosition();
    }
  }

  disconnectedCallback() {
    if (this.watchForItemsObserver !== undefined) {
      this.watchForItemsObserver.disconnect();
      this.watchForItemsObserver = undefined;
    }
  }

  // If maxValue is undefined, it defines the maxValue as the sum of the amounts plus minValue
  private updateMaxValueAux(): void {
    this.maxValueAux =
      this.maxValue === undefined
        ? this.minValue + this.totalAmount
        : this.maxValue;
  }

  private calcThickness(): number {
    return typeof this.thickness === "number" &&
      this.thickness > 0 &&
      this.thickness <= 99
      ? this.thickness
      : 10;
  }

  private calcPercentage(): number {
    return this.value <= this.minValue
      ? 0
      : ((this.value - this.minValue) * 100) /
          (this.maxValueAux - this.minValue);
  }

  /*  In the line gauge type, this functions correctly aligns the
      'current-value' to the center of the 'indicator', even if the indicator
      has low or high percentage value. Also, it makes to not overflow the
      'indicator' from his container when he has low or high values.
  */
  private setValueAndIndicatorPosition(): void {
    const percentage =
      this.calcPercentage() >= 100 ? 100 : this.calcPercentage();

    // This does not include the gauge padding
    const gaugeWidth = this.linearCurrentValueContainer.getBoundingClientRect()
      .width;

    const distanceToTheValueCenter = (gaugeWidth / 100) * percentage;

    // - - - - - - - - - - -  Current value positioning  - - - - - - - - - - -
    const spanHalfWidth =
      this.linearCurrentValue.getBoundingClientRect().width / 2;

    // The span is near the left side
    if (distanceToTheValueCenter - spanHalfWidth < 0) {
      this.lineCurrentValuePosition = "Left";

      // The span is near the right side
    } else if (distanceToTheValueCenter + spanHalfWidth > gaugeWidth) {
      this.lineCurrentValuePosition = "Right";

      // The span is in an intermediate position
    } else {
      this.lineCurrentValuePosition = "Center";
    }

    // - - - - - - - - - - - -  Indicator positioning  - - - - - - - - - - - -
    const indicatorHalfWidth =
      this.linearIndicator.getBoundingClientRect().width / 2;

    // The indicator is near the left side
    if (distanceToTheValueCenter - indicatorHalfWidth < 0) {
      this.lineIndicatorPosition = "Left";

      // The indicator is near the right side
    } else if (distanceToTheValueCenter + indicatorHalfWidth > gaugeWidth) {
      this.lineIndicatorPosition = "Right";

      // The indicator is in an intermediate position
    } else {
      this.lineIndicatorPosition = "Center";
    }
  }

  private addCircleRanges(
    { amount, color },
    position: number,
    radius: number
  ): any {
    const FULL_CIRCLE_RADIANS = 2 * Math.PI;
    const ROTATION_FIX = -90;
    const circleLength = FULL_CIRCLE_RADIANS * radius;
    const range = this.maxValueAux - this.minValue;
    const valuePercentage = amount / range;
    return (
      <circle
        class="circle-range"
        r={radius}
        cx="50%"
        cy="50%"
        stroke={color}
        stroke-dasharray={`${circleLength * valuePercentage}, ${circleLength}`}
        transform={`rotate(${position + ROTATION_FIX} 50,50)`}
        data-amount={amount}
        stroke-width={`${this.calcThickness()}%`}
      />
    );
  }

  private addLineRanges({ amount, color }, position: number): any {
    const range = this.maxValueAux - this.minValue;
    return (
      <div
        class="range"
        style={{
          "background-color": color,
          "margin-left": `${position}%`,
          width: `${(amount * 100) / range}%`
        }}
      />
    );
  }

  private addLineRangesLabels({ amount, color, name }, position: number): any {
    const range = this.maxValueAux - this.minValue;

    return (
      <span
        class="range-label"
        style={{
          "margin-left": `${position}%`,
          color: color,
          width: `${(amount * 100) / range}%`
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
    const ONE_PERCENT_OF_CIRCLE_DREGREE = 3.6;
    const radius = FULL_CIRCLE_RADIO - this.calcThickness() / 2;
    const ROTATION_FIX = 90; // Used to correct the rotation
    this.totalAmount = 0;

    for (let i = childRanges.length - 1; i >= 0; i--) {
      this.totalAmount += childRanges[i].amount;
    }
    this.updateMaxValueAux();

    const range = this.maxValueAux - this.minValue;
    let positionInGauge = 0;
    for (let i = 0; i < childRanges.length; i++) {
      svgRanges.push(
        this.addCircleRanges(childRanges[i], positionInGauge, radius)
      );

      positionInGauge += (360 * childRanges[i].amount) / range;
    }

    const rotation =
      this.calcPercentage() == 100
        ? `rotate(${359.5 + ROTATION_FIX}deg)`
        : `rotate(${this.calcPercentage() * ONE_PERCENT_OF_CIRCLE_DREGREE +
            ROTATION_FIX}deg)`;

    return (
      <Host>
        <div class="circle-gauge-container" data-readonly>
          <div class="svg-and-indicator-container">
            <svg viewBox="0 0 100 100">
              <circle
                class="background-circle"
                r={radius}
                cx="50%"
                cy="50%"
                stroke-width={`${this.calcThickness()}%`}
                ref={el => (this.SVGcircle = el as SVGCircleElement)}
              />
              {svgRanges}
            </svg>

            {this.showValue && (
              <div
                class="indicator-container"
                style={{
                  transform: rotation
                }}
              >
                <div
                  class="indicator"
                  style={{
                    width: `${this.calcThickness() + 2}%`
                  }}
                />
              </div>
            )}
          </div>
          {this.showValue && (
            <div class="current-value-container">
              <span
                class="current-value"
                ref={el => (this.circleCurrentValue = el as HTMLSpanElement)}
              >
                {this.value}
              </span>
            </div>
          )}
        </div>
      </Host>
    );
  }

  private renderLine(childRanges) {
    const divRanges = [];
    const divRangesLabel = [];
    this.totalAmount = 0;

    for (let i = childRanges.length - 1; i >= 0; i--) {
      this.totalAmount += childRanges[i].amount;
    }
    this.updateMaxValueAux();

    const range = this.maxValueAux - this.minValue;
    let positionInGauge = 0;

    for (let i = 0; i < childRanges.length; i++) {
      divRanges.push(this.addLineRanges(childRanges[i], positionInGauge));
      divRangesLabel.push(
        this.addLineRangesLabels(childRanges[i], positionInGauge)
      );

      positionInGauge += (100 * childRanges[i].amount) / range;
    }
    const percentage =
      this.calcPercentage() >= 100 ? 100 : this.calcPercentage();

    return (
      <div
        class="line-gauge-container"
        data-readonly
        style={{ "--percentage": `${percentage}%` }}
      >
        {this.showValue && (
          <div
            class="current-value-container"
            ref={el =>
              (this.linearCurrentValueContainer = el as HTMLDivElement)
            }
          >
            <span
              class={{
                "current-value": true,
                "center-align": this.lineCurrentValuePosition === "Center",
                "right-align": this.lineCurrentValuePosition === "Right"
              }}
              ref={el => (this.linearCurrentValue = el as HTMLDivElement)}
            >
              {this.value}
            </span>
          </div>
        )}
        <div
          class="ranges-labels-and-indicator-container"
          style={{
            height: `${2 * this.calcThickness() + (this.showValue ? 4 : 0)}px`
          }}
        >
          {this.showValue && (
            <div
              class={{
                indicator: true,
                "center-align": this.lineIndicatorPosition === "Center",
                "right-align": this.lineIndicatorPosition === "Right"
              }}
              ref={el => (this.linearIndicator = el as HTMLDivElement)}
            />
          )}
          <div
            class="ranges-and-labels-container"
            style={{
              "border-radius": `${this.calcThickness()}px`
            }}
          >
            {divRanges}
            {!this.labelsOverflow && (
              <div class="labels-container">
                <div
                  class="labels-subcontainer"
                  ref={el => (this.labelsSubContainer1 = el as HTMLDivElement)}
                >
                  {divRangesLabel}
                </div>
              </div>
            )}
          </div>
        </div>
        {(this.labelsOverflow || this.showMinMax) && (
          <div class="min-max-and-labels-container">
            {this.labelsOverflow && (
              <div class="labels-container">
                <div
                  class="labels-subcontainer"
                  ref={el => (this.labelsSubContainer2 = el as HTMLDivElement)}
                >
                  {divRangesLabel}
                </div>
              </div>
            )}

            {this.showMinMax && (
              <div class="min-max-values-container">
                <span class="min-value">{this.minValue}</span>
                <span class="max-value">{this.maxValueAux}</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  render() {
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
