import {
  Component,
  Element,
  Event,
  EventEmitter,
  Method,
  Prop
} from "@stencil/core";
import { IFormComponent } from "../common/interfaces";
@Component({
  shadow: false,
  styleUrl: "rating.scss",
  tag: "gx-rating"
})
export class Rating implements IFormComponent {
  inputId: string;

  starShape = <polygon points="50,0 15,95 100,35 0,35 85,95" />;

  svgViewport = {
    viewBox: "0 0 100 100"
  };

  @Element() element: HTMLElement;

  /**
   * This attribute allows you specify if the element is disabled.
   * If disabled, it will not trigger any user interaction related event
   * (for example, click event).
   */
  @Prop() disabled = false;

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

  handleChange: (UIEvent: any) => void;

  /**
   * The 'input' event is emitted when a change to the element's value is committed by the user.
   */
  @Event() input: EventEmitter;

  onClick(event: UIEvent) {
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
        <svg
          class="rating"
          {...this.svgViewport}
          onClick={ev => this.onClick(ev)}
        >
          {this.starShape}
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
      // tslint:disable-next-line:no-console
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
          {this.starShape}
        </svg>
      );
    }
    return stars;
  }

  render() {
    const valuesDifference = this.maxValue - this.value;
    if (!this.inputId) {
      this.id
        ? (this.inputId = `${this.id}_inputRange`)
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
      if (!!this.maxValue) {
        // tslint:disable-next-line:no-console
        console.error(
          "Incongruence between values. 'value' is higher than 'max-value'.",
          this
        );
      } else {
        // tslint:disable-next-line:no-console
        console.error("'max-value' has not a value setted ", this);
      }
    }
  }
}

let autoInputRangeId = 0;
