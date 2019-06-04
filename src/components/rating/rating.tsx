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
   * The current value displayed by the component.
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
  @Prop() value = 0;

  handleChange: (UIEvent: any) => void;

  /**
   * The 'input' event is emitted when a change to the element's value is committed by the user.
   */
  @Event() input: EventEmitter;

  onClick(event: UIEvent) {
    const element = event.target as HTMLElement;
    const score =
      element.nodeName === "polygon"
        ? Array.from(element.parentElement.parentElement.children).indexOf(
            element.parentElement
          ) + 1
        : Array.from(element.parentElement.children).indexOf(element) + 1;
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
      console.error("'value' cannot be greater than 'max-value'");
    }
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg
          class={`score ${i < starsScore ? "active" : ""}`}
          viewBox="0 0 100 100"
        >
          <polygon points="50,0 15,95 100,35 0,35 85,95" />
        </svg>
      );
    }
    return stars;
  }

  render() {
    return (this.maxValue >= this.value && this.readonly) || !this.readonly ? (
      <div>
        <input
          type="range"
          min="0"
          max={this.readonly ? this.maxValue : 5}
          step="1"
          value={this.readonly ? this.value : this.ratingScore}
        />
        <div
          class={`svgContainer ${this.readonly ? "score" : "rating"}`}
          data-score={this.ratingScore !== 0 ? this.ratingScore : undefined}
        >
          {this.readonly ? this.addStarsScore() : this.addStarsRating()}
        </div>
      </div>
    ) : (
      // tslint:disable-next-line:no-console
      console.error(
        "'max-value' or 'value' attributes has not a value setted or has a incorrect value",
        this
      )
    );
  }
}
