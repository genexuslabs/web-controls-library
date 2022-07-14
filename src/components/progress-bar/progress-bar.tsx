import { Component, Element, Host, Prop, State, h } from "@stencil/core";
import { Component as GxComponent } from "../common/interfaces";

// Class transforms
import {
  getClassesWithoutFocus,
  getTransformedClassesWithoutFocus,
  tDescription,
  tTitle
} from "../common/css-transforms/css-transforms";

@Component({
  shadow: false,
  styleUrl: "progress-bar.scss",
  tag: "gx-progress-bar"
})
export class ProgressBar implements GxComponent {
  @Element() element: HTMLGxProgressBarElement;

  /**
   * It specifies the main text that is shown on the dialog.
   */
  @Prop() readonly caption: string = null;

  /**
   * A CSS class to set as the `gx-progress-bar` element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * It specifies more information that is shown on the dialog.
   */
  @Prop() readonly description: string = null;

  /**
   * This attribute lets you specify maximum value when type is `"determinate"`.
   */
  @Prop() readonly maxValue: number = 100;

  /**
   * This attribute lets you specify if the progress dialog is presented.
   */
  @Prop() readonly presented: boolean = false;

  /**
   * It specifies the type of progress indicator. Determinate indicators show
   * the progress of the processing, while indeterminate ones don't inform you
   * about the status during the process.
   */
  @Prop() readonly type: "determinate" | "indeterminate" = "indeterminate";

  /**
   * This attribute lets you specify the value when type is `"determinate"`.
   */
  @Prop() readonly value: number = 0;

  @State() lottiePath = "";

  private didLoad = false;

  componentDidLoad() {
    this.didLoad = true;
  }

  render() {
    const classes = getClassesWithoutFocus(this.cssClass);
    const titleClasses = getTransformedClassesWithoutFocus(
      this.cssClass,
      tTitle
    );
    const descriptionClasses = getTransformedClassesWithoutFocus(
      this.cssClass,
      tDescription
    );

    // Max value should not be negative
    const calculatedMaxValue = Math.max(this.maxValue, 0);

    const calculatedValue = Math.min(
      Math.max(this.value, 0), // At least 0
      calculatedMaxValue // At most this.maxValue
    );

    const percentage =
      calculatedMaxValue != 0
        ? Math.round((calculatedValue * 100) / calculatedMaxValue)
        : 100;

    return (
      <Host
        class={{ presented: this.presented }}
        aria-hidden={!this.presented ? "true" : undefined}
      >
        {this.presented && (
          <div
            class={{
              "gx-progress-dialog": true,
              "gx-progress-dialog--indeterminate":
                this.type === "indeterminate",
              "gx-progress-dialog--indeterminate-with-title":
                this.type === "indeterminate" && !!this.caption,
              "gx-progress-dialog--indeterminate-with-description":
                this.type === "indeterminate" && !!this.description
            }}
          >
            {!!this.caption && (
              <span
                class={{
                  [titleClasses.transformedCssClass]: true,
                  "gx-progress-title": true
                }}
              >
                {this.caption}
              </span>
            )}

            {!!this.description && (
              <span
                class={{
                  [descriptionClasses.transformedCssClass]: true,
                  "gx-progress-description": true
                }}
              >
                {this.description}
              </span>
            )}

            {this.didLoad && this.lottiePath == "" && (
              <div
                class={{
                  [this.cssClass]: !!this.cssClass,
                  [classes.vars]: true,
                  "gx-progress-bar-container": true,
                  "gx-progress-bar-container--determinate":
                    this.type === "determinate",
                  "gx-progress-bar-container--indeterminate":
                    this.type === "indeterminate"
                }}
              >
                {this.type === "determinate" ? (
                  [
                    <span
                      class="gx-progress-bar"
                      style={{ "--width": `${percentage}%` }}
                    ></span>,
                    <div class="gx-progress-bar-values">
                      <span class="gx-progress-bar-valuenow">
                        {percentage}%
                      </span>
                      <span>
                        {calculatedValue} / {calculatedMaxValue}
                      </span>
                    </div>
                  ]
                ) : (
                  <svg class="gx-progress-bar" viewBox="25 25 50 50">
                    <circle cx="50" cy="50" r="20" stroke-width="5"></circle>
                  </svg>
                )}
              </div>
            )}
          </div>
        )}
      </Host>
    );
  }
}
