import { Component, Element, Host, Prop, State, h } from "@stencil/core";
import { Component as GxComponent } from "../common/interfaces";

@Component({
  shadow: true,
  styleUrl: "loading.scss",
  tag: "gx-loading"
})
export class Loading implements GxComponent {
  @Element() element: HTMLGxLoadingElement;

  /**
   * This attribute lets you specify if the loading is presented.
   */
  @Prop() readonly presented: boolean = false;

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

  @State() private lottiePath = "";

  private present() {
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

  render() {
    const shouldShowContent = this.presented;

    return (
      <Host aria-hidden={!shouldShowContent ? "true" : undefined}>
        {// Default loading animation if no gx-lottie
        shouldShowContent && this.lottiePath == "" && (
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
