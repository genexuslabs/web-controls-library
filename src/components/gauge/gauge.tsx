import {
  Component,
  Element,
  Event,
  EventEmitter,
  Host,
  Listen,
  Prop,
  State,
  h,
  Watch,
} from "@stencil/core";

import { Component as GxComponent } from "../common/interfaces";

// Class transforms
import { getClasses } from "../common/css-transforms/css-transforms";

@Component({
  shadow: false,
  styleUrl: "gauge.scss",
  tag: "gx-gauge",
})
export class Gauge implements GxComponent {
  @Element() element: HTMLGxGaugeElement;

  /**
   * A CSS class to set as the `gx-gauge` element class.
   */
  @Prop() readonly cssClass: string;

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

  @State() rangesChildren: any[] = []; // It has the following type: GaugeRange[]

  @State() labelsOverflow = false;

  @State() lineCurrentValuePosition: "Left" | "Center" | "Right" = "Center";

  @State() lineIndicatorPosition: "Left" | "Center" | "Right" = "Center";

  /*  Used to connect and disconnect the resizeObserver based on the value of the
      `type` property.
   */
  @Watch("type")
  typeHandler(newValue: "line" | "circle") {
    // We always disconnect the observer
    this.disconnectObserver();

    /*  If the type will change to "line" or `showValue == true` and the type 
        will change to "circle", we set the resizeObserver at the end of the 
        next rendering phase.
     */
    this.shouldSetGaugeObserver =
      newValue === "line" || (this.showValue && newValue === "circle");
  }

  /*  Used to connect and disconnect the resizeObserver based on the value of the
      `showValue` property.
   */
  @Watch("showValue")
  showValueHandler(newValue: boolean) {
    // We always disconnect the observer
    this.disconnectObserver();

    /*  If the `showValue` option will be turned on, we set the resizeObserver
        at the end of the next rendering phase.
     */
    this.shouldSetGaugeObserver =
      newValue && (this.type === "line" || this.type === "circle");
  }

  @Watch("thickness")
  labelsPositionHandler(newValue: number, oldValue: number) {
    // Used only in line gauge type
    if (this.type === "line") {
      /*  It means that the labels were inside the .range-container and the
          thickness will decrease, so it might be necessary to change the
          position of the labels, because they will overflow.
       */
      if (!this.labelsOverflow && newValue < oldValue) {
        this.decideLabelsPosition();

        /*  It means that the labels were outside of the .range-container and the
            thickness will increase, so it might be necessary to change the
            position of the labels, because they will not overflow anymore.
        */
      } else if (this.labelsOverflow && newValue > oldValue) {
        this.decideLabelsPosition();
      }
    }
  }

  /*  Used to set to the gauge an observer when
        - type == "line" or (`showValue` changes from `false` to `true` and
          type == "circle").
        - And the component has finished its rendering phase
   */
  private shouldSetGaugeObserver = false;

  private maxValueAux = this.minValue;

  private totalAmount = 0;

  /**
   * `true` if the `componentDidLoad()` method was called
   */
  private didLoad = false;

  private watchForItemsObserver: ResizeObserver;

  private labelsSubContainer: HTMLDivElement;

  private linearCurrentValueContainer: HTMLDivElement;

  private linearCurrentValue: HTMLDivElement;

  private linearIndicator: HTMLDivElement;

  private circleCurrentValue: HTMLSpanElement;

  private SVGcircle: SVGCircleElement;

  @Listen("gxGaugeRangeDidLoad")
  // @ts-expect-error It has type { detail: GaugeRange }, but to prevent any issue the error message is avoided
  onGaugeRangeDidLoad({ detail: childRange }) {
    this.rangesChildren = [...this.rangesChildren, childRange];
    this.totalAmount += childRange.amount;
    // Possible improvement here. Check the approach applied in navbar.jsx line 103
    childRange.element.addEventListener("gxGaugeRangeDidUnload", () => {
      this.rangesChildren = this.rangesChildren.filter(
        (elementToSave) => elementToSave != childRange
      );
      this.totalAmount -= childRange.amount;
    });
    childRange.element.addEventListener("gxGaugeRangeDidUpdate", () => {
      const index = this.rangesChildren.findIndex(
        (elementFinding) => elementFinding === childRange
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
      this.setCircleGaugeObserver();
    }
  }

  /*  If gauge type == line, it creates a ResizeObserver to implement 
      `current-value` and `indicator` centering responsiveness and range labels
      responsiveness
  */
  componentDidLoad() {
    if (this.type === "line") {
      this.setLineGaugeObserver();
    }

    this.didLoad = true;
  }

  /*  After the render, it asks for 'getBoundingClientRect()' and centers the
      'current-value' in line gauge type
  */
  componentDidRender() {
    if (this.showValue && this.type === "line") {
      this.setValueAndIndicatorPosition();
    }

    if (this.shouldSetGaugeObserver) {
      if (this.type == "line") {
        this.setLineGaugeObserver();
      } else {
        this.setCircleGaugeObserver();
      }

      this.shouldSetGaugeObserver = false;
    }
  }

  disconnectedCallback() {
    this.disconnectObserver();
  }

  /*  Preconditions:
        this.showValue === True
        this.type === "circle"
   */
  private setCircleGaugeObserver() {
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

  /*  Preconditions:
        this.type === "line"
        The component has finished its rendering phase
   */
  private setLineGaugeObserver() {
    this.watchForItemsObserver = new ResizeObserver(() => {
      if (this.showValue) {
        this.setValueAndIndicatorPosition();
      }

      this.decideLabelsPosition();
    });

    // Observe the `labels-subcontainer` in the line gauge type
    this.watchForItemsObserver.observe(this.labelsSubContainer);
  }

  private disconnectObserver() {
    // eslint-disable-next-line @stencil/strict-boolean-conditions
    if (this.watchForItemsObserver) {
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
    const gaugeWidth =
      this.linearCurrentValueContainer.getBoundingClientRect().width;

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

  private decideLabelsPosition() {
    // This only happens when the component has not yet been rendered to
    // get the `labelsSubContainer` reference
    if (
      !this.didLoad ||
      (this.labelsOverflow && this.labelsSubContainer == undefined)
    ) {
      return;
    }

    const fontSize = this.labelsSubContainer.getBoundingClientRect().height;

    // Depending on the current fontSize, it decides the position where
    // the labels will be placed
    if (fontSize > this.calcThickness() * 2) {
      this.labelsOverflow = true;
    } else {
      this.labelsOverflow = false;
    }
  }

  private addCircleRanges(
    { amount, color }: { amount: number; color: string },
    position: number,
    radius: number,
    childNumber: string // Identifies the number of child to animate it at the start
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
        style={{
          "--child-number": childNumber,
          "--stroke-dasharray-initial": `0, ${circleLength}`,
          "--stroke-dasharray": `${
            circleLength * valuePercentage
          }, ${circleLength}`,
        }}
      />
    );
  }

  private addLineRanges(
    { amount, color }: { amount: number; color: string },
    position: number,
    childNumber: string // Identifies the number of child to animate it at the start
  ): any {
    const range = this.maxValueAux - this.minValue;
    return (
      <div
        class="range"
        style={{
          "background-color": color,
          "margin-left": `${position}%`,
          "--child-number": childNumber,
          "--range-width": `${(amount * 100) / range}%`,
        }}
      />
    );
  }

  private addLineRangesLabels(
    { amount, color, name }: { amount: number; color: string; name: string },
    position: number,
    childNumber: string // Identifies the number of child to animate it at the start
  ): any {
    const range = this.maxValueAux - this.minValue;

    return (
      <span
        class="range-label"
        style={{
          "margin-left": `${position}%`,
          color: color,
          "--child-number": childNumber,
          "--range-width": `${(amount * 100) / range}%`,
        }}
      >
        {name}
      </span>
    );
  }

  private renderCircle(childRanges: HTMLGxGaugeRangeElement[]): HTMLElement {
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
        this.addCircleRanges(
          childRanges[i],
          positionInGauge,
          radius,
          i.toString()
        )
      );

      positionInGauge += (360 * childRanges[i].amount) / range;
    }

    const rotation =
      this.calcPercentage() == 100
        ? `rotate(${359.5 + ROTATION_FIX}deg)`
        : `rotate(${
            this.calcPercentage() * ONE_PERCENT_OF_CIRCLE_DREGREE + ROTATION_FIX
          }deg)`;

    // Styling for gx-gauge control.
    const classes = getClasses(this.cssClass);

    return (
      <Host
        class={{ [this.cssClass]: !!this.cssClass, [classes.vars]: true }}
        data-readonly
      >
        <div class="circle-gauge-container">
          <div class="svg-and-indicator-container">
            <svg viewBox="0 0 100 100">
              <circle
                class="background-circle"
                r={radius}
                cx="50%"
                cy="50%"
                stroke-width={`${this.calcThickness()}%`}
                ref={(el) => (this.SVGcircle = el as SVGCircleElement)}
              />
              {svgRanges}
            </svg>

            {this.showValue && (
              <div
                class="indicator-container"
                style={{
                  transform: rotation,
                }}
              >
                <div
                  class="indicator"
                  style={{
                    width: `${this.calcThickness() + 2}%`,
                  }}
                />
              </div>
            )}
          </div>
          {this.showValue && (
            <div class="current-value-container">
              <span
                class="current-value"
                ref={(el) => (this.circleCurrentValue = el as HTMLSpanElement)}
              >
                {this.value}
              </span>
            </div>
          )}
        </div>
      </Host>
    );
  }

  private renderLine(childRanges: HTMLGxGaugeRangeElement[]) {
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
      divRanges.push(
        this.addLineRanges(childRanges[i], positionInGauge, i.toString())
      );
      divRangesLabel.push(
        this.addLineRangesLabels(childRanges[i], positionInGauge, i.toString())
      );

      positionInGauge += (100 * childRanges[i].amount) / range;
    }
    const percentage =
      this.calcPercentage() >= 100 ? 100 : this.calcPercentage();

    // Styling for gx-gauge control.
    const classes = getClasses(this.cssClass);

    return (
      <Host
        class={{ [this.cssClass]: !!this.cssClass, [classes.vars]: true }}
        data-readonly
      >
        <div
          class="line-gauge-container"
          style={{ "--percentage": `${percentage}%` }}
        >
          {this.showValue && (
            <div
              class="current-value-container"
              ref={(el) =>
                (this.linearCurrentValueContainer = el as HTMLDivElement)
              }
            >
              <span
                class={{
                  "current-value": true,
                  "center-align": this.lineCurrentValuePosition === "Center",
                  "right-align": this.lineCurrentValuePosition === "Right",
                }}
                ref={(el) => (this.linearCurrentValue = el as HTMLDivElement)}
              >
                {this.value}
              </span>
            </div>
          )}
          <div
            class="ranges-labels-and-indicator-container"
            style={{
              height: `${
                2 * this.calcThickness() + (this.showValue ? 4 : 0)
              }px`,
            }}
          >
            {this.showValue && (
              <div
                class={{
                  indicator: true,
                  "center-align": this.lineIndicatorPosition === "Center",
                  "right-align": this.lineIndicatorPosition === "Right",
                }}
                ref={(el) => (this.linearIndicator = el as HTMLDivElement)}
              />
            )}
            <div
              class="ranges-and-labels-container"
              style={{
                "border-radius": `${this.calcThickness()}px`,
              }}
            >
              {divRanges}
              <div class="labels-container">
                <div
                  class="labels-subcontainer"
                  ref={(el) => (this.labelsSubContainer = el as HTMLDivElement)}
                >
                  {!this.labelsOverflow && divRangesLabel}
                </div>
              </div>
            </div>
          </div>
          {(this.labelsOverflow || this.showMinMax) && (
            <div class="min-max-and-labels-container">
              {this.labelsOverflow && (
                <div class="labels-container">
                  <div class="labels-subcontainer">{divRangesLabel}</div>
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
      </Host>
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
