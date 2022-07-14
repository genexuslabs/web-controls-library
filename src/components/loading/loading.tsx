import { Component, Element, Host, Prop, h } from "@stencil/core";
import { Component as GxComponent } from "../common/interfaces";

// Class transforms
import {
  getTransformedClassesWithoutFocus,
  tLoading
} from "../common/css-transforms/css-transforms";

@Component({
  shadow: true,
  styleUrl: "loading.scss",
  tag: "gx-loading"
})
export class Loading implements GxComponent {
  @Element() element: HTMLGxLoadingElement;

  /**
   * A CSS class to set as the `gx-loading` element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * `true` if the `componentDidLoad()` method was called.
   * This property is not used as a state due to the following issue:
   * https://github.com/ionic-team/stencil/issues/3158
   */
  @Prop({ mutable: true }) didLoad = false;

  /**
   * This attribute lets you specify the lottie path to use for the lottie
   * animation.
   * This property is not used as a state due to the following issue:
   * https://github.com/ionic-team/stencil/issues/3158
   */
  @Prop({ mutable: true }) lottiePath = "";

  /**
   * This attribute lets you specify if the loading is presented.
   */
  @Prop() readonly presented: boolean = false;

  /**
   * `true` to display the animation defined in the default `<slot>` instead
   * the native (default) animation.
   */
  @Prop() readonly showSlotAnimation: boolean = false;

  // @Watch("value")
  // valueWatchHandler(newValue: number, oldValue: number) {
  //   if (newValue === oldValue) {
  //     return;
  //   }

  //   if (this.lottiePath) {
  //     const gxLottie = this.element.querySelector("gx-lottie");
  //     if (gxLottie !== null) {
  //       const from = oldValue > newValue ? 0 : oldValue;
  //       gxLottie.play(from, newValue);
  //     }
  //   }
  // }

  private updateLottiePath() {
    const rawLottiePath = window
      .getComputedStyle(this.element)
      .getPropertyValue("--gx-lottie-file-path");

    // Remove quotes from the string
    if (rawLottiePath) {
      this.lottiePath = rawLottiePath
        .trim()
        .replace(/^"/, "")
        .replace(/"$/, "");
    }
  }

  componentDidLoad(): void {
    this.didLoad = true;

    // Check if a lottie path exists
    this.updateLottiePath();
  }

  render() {
    const loadingClasses = getTransformedClassesWithoutFocus(
      this.cssClass,
      tLoading
    );

    const shouldShowContent = this.presented && this.didLoad;

    return (
      <Host
        class={{
          [loadingClasses.transformedCssClass]: true,
          [loadingClasses.vars]: true
        }}
        aria-hidden={!shouldShowContent ? "true" : undefined}
      >
        {shouldShowContent && this.lottiePath != "" && (
          <gx-lottie autoPlay loop path={this.lottiePath} />
        )}

        {shouldShowContent &&
          this.lottiePath == "" &&
          this.showSlotAnimation && <slot />}

        {// Default loading animation if no gx-lottie and slots animation
        shouldShowContent && this.lottiePath == "" && !this.showSlotAnimation && (
          <div class="gx-loading-rotate-container">
            <div class="circle circle-1" />
            <div class="circle circle-2" />
            <div class="circle circle-3" />
          </div>
        )}
      </Host>
    );
  }
}
