import {
  Component,
  Element,
  Event,
  EventEmitter,
  Host,
  Method,
  Prop,
  h
} from "@stencil/core";
import { FormComponent } from "../common/interfaces";

// Class transforms
import { getClasses } from "../common/css-transforms/css-transforms";

let autoRatingId = 0;

@Component({
  shadow: true,
  styleUrl: "rating.scss",
  tag: "gx-rating"
})
export class Rating implements FormComponent {
  constructor() {
    this.handleClick = this.handleClick.bind(this);

    if (!this.inputId) {
      this.element.id
        ? (this.inputId = `${this.element.id}_rating`)
        : (this.inputId = `gx-rating-auto-id-${autoRatingId++}`);
    }
  }

  private inputId: string;

  @Element() element: HTMLGxRatingElement;

  /**
   * A CSS class to set as the `gx-rating` element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * This attribute allows you specify if the element is disabled.
   * If disabled, it will not trigger any user interaction related event
   * (for example, click event).
   */
  @Prop() disabled = false;

  /**
   * This attribute lets you specify how this element will behave when hidden.
   *
   * | Value        | Details                                                                     |
   * | ------------ | --------------------------------------------------------------------------- |
   * | `keep-space` | The element remains in the document flow, and it does occupy space.         |
   * | `collapse`   | The element is removed form the document flow, and it doesn't occupy space. |
   */
  @Prop() invisibleMode: "collapse" | "keep-space" = "collapse";

  /**
   * This property determine the number of stars displayed.
   */
  @Prop() maxValue = 5;

  /**
   * The current value displayed by the component.
   */
  @Prop({ mutable: true }) value = 0;

  /**
   * The 'input' event is emitted when a change to the element's value is committed by the user.
   */
  @Event() input: EventEmitter;

  private handleClick(event: UIEvent) {
    event.stopPropagation();
    const element = event.target as HTMLElement;

    this.value = Number(element.id) + 1;
    this.input.emit(this);
  }

  /**
   * Returns the id of the inner `input` element (if set).
   */
  @Method()
  async getNativeInputId() {
    return this.inputId;
  }

  render() {
    // Max value should not be negative
    const calculatedMaxValue = Math.max(this.maxValue, 0);

    const calculatedValue = Math.min(
      Math.max(this.value, 0), // At least 0
      calculatedMaxValue // At most this.maxValue
    );

    // Styling for gx-rating control.
    const classes = getClasses(this.cssClass, -1);

    return (
      <Host
        class={{
          [this.cssClass]: !!this.cssClass,
          [classes.vars]: true,
          disabled: this.disabled
        }}
        data-score={this.value !== 0 ? this.value : undefined}
      >
        <input
          id={this.inputId}
          type="range"
          disabled={this.disabled}
          min="0"
          max={calculatedMaxValue}
          step="1"
          value={calculatedValue}
          hidden
        />
        {this.maxValue > 0 && (
          <div class="stars-container">
            {[...Array(this.maxValue).keys()].map(i => (
              <svg
                id={i.toString()}
                key={i}
                class="rating-star-container"
                viewBox="0 0 100 100"
                onClick={this.handleClick}
              >
                <polygon
                  class={{
                    "rating-star": true,
                    "selected-star": i < calculatedValue
                  }}
                  points="50,0 15,95 100,35 0,35 85,95"
                />
              </svg>
            ))}
          </div>
        )}
      </Host>
    );
  }
}
