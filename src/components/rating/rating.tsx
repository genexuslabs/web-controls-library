import {
  Component,
  Element,
  Event,
  EventEmitter,
  Method,
  Prop,
  h
} from "@stencil/core";
import { FormComponent } from "../common/interfaces";

let autoInputRangeId = 0;

@Component({
  shadow: false,
  styleUrl: "rating.scss",
  tag: "gx-rating"
})
export class Rating implements FormComponent {
  constructor() {
    this.handleClick = this.handleClick.bind(this);
  }

  private inputId: string;

  private svgViewport = {
    viewBox: "0 0 100 100"
  };

  @Element() element: HTMLGxRatingElement;

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
   * This porpoerty is required if you want to display a score.
   * >E.g: In a score of 4/5 stars the `maxValue` is `5` and the `value` is `4`
   *
   */
  @Prop() maxValue: number;

  /**
   * This attribute indicates that the user cannot modify the value of the control.
   * Same as [readonly](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-readonly)
   * attribute for `input` elements.
   * _Disable by default_
   */
  @Prop() readonly = false;

  /**
   * The current value displayed by the component.
   *
   */
  @Prop({ mutable: true }) value = 0;

  /**
   * The 'input' event is emitted when a change to the element's value is committed by the user.
   */
  @Event() input: EventEmitter;

  handleClick(event: UIEvent) {
    const element = event.target as HTMLElement;
    const targetParent = element.parentElement;
    const score =
      element.nodeName === "polygon"
        ? Array.from(targetParent.parentElement.children).indexOf(
            targetParent
          ) + 1
        : Array.from(targetParent.children).indexOf(element) + 1;
    this.value = score;
    this.input.emit(this);
  }

  /**
   * Returns the id of the inner `input` element (if set).
   */
  @Method()
  async getNativeInputId() {
    return this.element.querySelector("input").id;
  }

  private renderStarsRating() {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg class="rating" {...this.svgViewport} onClick={this.handleClick}>
          {this.renderStarShape()}
        </svg>
      );
    }
    return stars;
  }

  private renderStarsScore() {
    const stars = [];
    let percent: number;
    let starsScore: number;
    if (this.maxValue - this.value >= 0) {
      percent = (this.value * 100) / this.maxValue;
      starsScore = Math.round((percent * 5) / 100);
    } else {
      console.error("'value' cannot be greater than 'max-value'");
    }
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg
          class={{
            active: i < starsScore,
            score: true
          }}
          {...this.svgViewport}
        >
          {this.renderStarShape()}
        </svg>
      );
    }
    return stars;
  }

  render() {
    const valuesDifference = this.maxValue - this.value;
    if (!this.inputId) {
      this.element.id
        ? (this.inputId = `${this.element.id}_inputRange`)
        : (this.inputId = `gx-inputRange-auto-id-${autoInputRangeId++}`);
    }
    if ((valuesDifference >= 0 && this.readonly) || !this.readonly) {
      return (
        <div>
          <input
            id={this.inputId}
            type="range"
            min="0"
            max={this.readonly ? this.maxValue : 5}
            step="1"
            value={this.value}
          />
          <div
            class={{
              rating: !this.readonly,
              score: this.readonly
            }}
            data-score={this.value !== 0 ? this.value : undefined}
          >
            {this.readonly ? this.renderStarsScore() : this.renderStarsRating()}
          </div>
        </div>
      );
    } else {
      if (this.maxValue !== 0) {
        console.error(
          "'value' cannot be higher than 'max-value'.",
          this.element
        );
      } else {
        console.error("'max-value' has not a value set.", this.element);
      }
    }
  }

  private renderStarShape() {
    return <polygon points="50,0 15,95 100,35 0,35 85,95" />;
  }
}
