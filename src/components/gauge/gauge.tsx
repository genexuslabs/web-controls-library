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

  private maxValueAux = this.minValue;

  private totalAmount = 0;

  private watchForItemsObserver: ResizeObserver;

  private linearCurrentValue: HTMLDivElement;

  private linearIndicator: HTMLDivElement;

  private circularCurrentValue: HTMLSpanElement;

  private circularMarker: HTMLDivElement;

  private circularMarkerIndicator: HTMLDivElement;

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

  /*  If showValue == true, it creates a ResizeObserver to implement the font
      and marker container responsiveness (circle gauge type) or 
      'current-value' centering responsiveness (line gauge type)
  */
  connectedCallback() {
    if (this.showValue) {
      if (this.type === "circle") {
        this.watchForItemsObserver = new ResizeObserver(entries => {
          const elem = entries[0].contentRect;
          const minimumSize = Math.min(elem.width, elem.height);

          // Updates the font size
          this.circularCurrentValue.style.fontSize = `${minimumSize / 2.5}px`;

          // Updates the maxWidth of the marker value container
          this.circularMarker.style.maxWidth = `${minimumSize}px`;
        });
      } else {
        this.watchForItemsObserver = new ResizeObserver(() => {
          this.setValueAndIndicatorPosition();
        });
      }

      // Observe the gauge
      this.watchForItemsObserver.observe(this.element);
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
      this.thickness <= 100
      ? this.thickness / 5
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

    const gaugeWidth = this.element.getBoundingClientRect().width;

    const distanceToTheValueCenter = (gaugeWidth / 100) * percentage;

    // - - - - - - - - - - -  Current value positioning  - - - - - - - - - - -
    const spanHalfWidth =
      this.linearCurrentValue.getBoundingClientRect().width / 2;

    let spanOffsetX;

    // The span is near the left side
    if (distanceToTheValueCenter - spanHalfWidth < 0) {
      spanOffsetX = distanceToTheValueCenter;

      // The span is near the right side
    } else if (distanceToTheValueCenter + spanHalfWidth > gaugeWidth) {
      spanOffsetX = 2 * spanHalfWidth - (gaugeWidth - distanceToTheValueCenter);

      // The span is in an intermediate position
    } else {
      spanOffsetX = spanHalfWidth;
    }

    this.linearCurrentValue.style.transform = `translateX(${-spanOffsetX}px)`;

    // - - - - - - - - - - - -  Indicator positioning  - - - - - - - - - - - -
    const indicatorHalfWidth =
      this.linearIndicator.getBoundingClientRect().width / 2;

    let indicatorOffsetX;

    // The indicator is near the left side
    if (distanceToTheValueCenter - indicatorHalfWidth < 0) {
      indicatorOffsetX = distanceToTheValueCenter;

      // The indicator is near the right side
    } else if (distanceToTheValueCenter + indicatorHalfWidth > gaugeWidth) {
      indicatorOffsetX =
        2 * indicatorHalfWidth - (gaugeWidth - distanceToTheValueCenter);

      // The indicator is in an intermediate position
    } else {
      indicatorOffsetX = indicatorHalfWidth;
    }

    this.linearIndicator.style.transform = `translate(${-indicatorOffsetX}px, 22px)`;
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
        fill="none"
        transform={`rotate(${position + ROTATION_FIX} 50,50)`}
        data-amount={amount}
        stroke-width={`${this.thickness}%`}
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
    const radius = FULL_CIRCLE_RADIO - this.thickness / 2;
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
        <div class="svgContainer">
          <svg viewBox="0 0 100 100">
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
          {this.showValue && (
            <div class="gauge">
              <span
                class="current-value"
                ref={el => (this.circularCurrentValue = el as HTMLSpanElement)}
              >
                {this.value}
              </span>
            </div>
          )}
        </div>
        {this.showValue && (
          <div
            class="circularMarker"
            style={{
              transform: rotation
            }}
            ref={el => (this.circularMarker = el as HTMLDivElement)}
          >
            <div
              class="circularIndicator"
              style={{
                width: `${this.thickness + 2}%`
              }}
              ref={el => (this.circularMarkerIndicator = el as HTMLDivElement)}
            />
          </div>
        )}
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
      <div class="line-gauge-container">
        {this.showValue && (
          <div class="current-value-container">
            <span
              class="current-value"
              style={{
                "margin-left": `${percentage}%`
              }}
              ref={el => (this.linearCurrentValue = el as HTMLDivElement)}
            >
              {this.value}
            </span>

            <div
              class="indicator"
              style={{
                height: `${this.thickness * 2 + 4}px`,
                "margin-left": `${percentage}%`
              }}
              ref={el => (this.linearIndicator = el as HTMLDivElement)}
            />
          </div>
        )}
        <div
          class="ranges-and-labels-container"
          style={{
            height: `${2 * this.thickness}px`,
            "border-radius": `${this.thickness}px`
          }}
        >
          {divRanges}
          <div class="labels-container">{divRangesLabel}</div>
        </div>
        {this.showMinMax && (
          <div class="min-max-values-container">
            <span class="min-value">{this.minValue}</span>
            <span class="max-value">{this.maxValueAux}</span>
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
