// https://www.cssscript.com/demo/radio-button-based-star-rating-system/
// https://codepen.io/brianknapp/pen/JEotD/
import {
  Component,
  Element,
  Event,
  EventEmitter,
  Method,
  Prop,
  State
} from "@stencil/core";
import { IFormComponent } from "../common/interfaces";
@Component({
  shadow: false,
  styleUrl: "rating.scss",
  tag: "gx-rating"
})
export class Rating implements IFormComponent {
  @State() ratingScore = 0;

  /**
   * This attribute allows you specify if the element is disabled.
   * If disabled, it will not trigger any user interaction related event
   * (for example, click event).
   */
  @Prop() disabled = false;

  handleChange: (UIEvent: any) => void;

  @Element() element: HTMLElement;

  /**
   * The control id. Must be unique per control!
   */
  @Prop() id: string;

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
   * The current value displayed by the component.
   *
   */
  @Prop() maxValue: number;

  /**
   * This attribute i0ndicates that the user cannot modify the value of the control.
   * Same as [readonly](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-readonly)
   * attribute for `input` elements.
   * _Disable by default_
   */
  @Prop() readonly = false;

  /**
   * The current value displayed by the component.
   *
   */
  @Prop() value = 0;

  /**
   * The 'input' event is emitted when a change to the element's value is committed by the user.
   */
  @Event() input: EventEmitter;

  onClick(param) {
    const element = param.target;
    const score =
      element.nodeName === "polygon"
        ? parseInt(element.parentElement.getAttribute("star-number"), 10)
        : parseInt(element.getAttribute("star-number"), 10);
    this.ratingScore = score;
    this.input.emit(this);
  }

  /**
   * Returns the id of the inner `input` element (if set).
   */
  @Method()
  async getNativeInputId() {
    return this.render();
  }

  private addStarsRating() {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg
          class="rating"
          viewBox="0 0 100 100"
          star-number={1 + i}
          onClick={ev => this.onClick(ev)}
        >
          <polygon points="50,0 15,95 100,35 0,35 85,95" />
        </svg>
      );
    }
    return stars;
  }
  private addStarsScore() {
    const stars = [];
    let percent: number;
    let starsScore: number;
    if (this.maxValue - this.value >= 0) {
      percent = (this.value * 100) / this.maxValue;
      starsScore = Math.round((percent * 5) / 100);
    } else {
      // tslint:disable-next-line:no-console
      console.error(
        "Incongruence in values of 'max-value' and 'value' attributes"
      );
    }
    for (let i = 0; i < 5; i++) {
      if (i < starsScore) {
        stars.push(
          <svg class="score active" viewBox="0 0 100 100" star-number={1 + i}>
            <polygon points="50,0 15,95 100,35 0,35 85,95" />
          </svg>
        );
      } else {
        stars.push(
          <svg class="score" viewBox="0 0 100 100" star-number={1 + i}>
            <polygon points="50,0 15,95 100,35 0,35 85,95" />
          </svg>
        );
      }
    }
    return stars;
  }

  render() {
    if (this.readonly) {
      return this.maxValue && this.value ? (
        <div>
          <input
            type="range"
            min="0"
            max={this.maxValue}
            step="1"
            value={this.value}
          />
          <div class="svgContainer score">{this.addStarsScore()}</div>
        </div>
      ) : (
        // tslint:disable-next-line:no-console
        console.error(
          "'max-value' or 'value' attributes has not a value setted or has a incorrect value",
          this
        )
      );
    } else {
      return (
        <div>
          <input
            type="range"
            min="0"
            max="5"
            step="1"
            value={this.ratingScore}
          />
          <div
            class="svgContainer rating"
            data-score={this.ratingScore !== 0 ? this.ratingScore : undefined}
          >
            {this.addStarsRating()}
          </div>
        </div>
      );
    }
  }
}
