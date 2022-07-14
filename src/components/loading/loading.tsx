import { Component, Element, State, h, Host } from "@stencil/core";
import { Component as GxComponent } from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "loading.scss",
  tag: "gx-loading"
})
export class Loading implements GxComponent {
  @Element() element: HTMLGxLoadingElement;

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
    return <Host></Host>;
  }
}
