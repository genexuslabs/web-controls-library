import { Component, Element, Prop, State, Watch } from "@stencil/core";
import { BaseComponent } from "../common/base-component";

@Component({
  shadow: false,
  styleUrl: "loading.scss",
  tag: "gx-loading"
})
export class Loading extends BaseComponent {
  @Element() element: HTMLElement;

  @State() private lottiePath = "";

  /**
   * Sets the description text.
   *
   */
  @Prop() description: string;

  /**
   * Sets the caption text.
   *
   */
  @Prop() caption: string;

  /**
   * Sets if the loading dialog is presented.
   */
  @Prop() presented = false;

  /**
   * Sets the value.
   *
   */
  @Prop() type: "determinate" | "indeterminate";

  /**
   * Sets the value when type is determinate. Must be a value between 0 and 1.
   *
   */
  @Prop() value = 0;

  @Watch("value")
  valueWatchHandler(newValue: number, oldValue: number) {
    if (newValue === oldValue) {
      return;
    }

    if (this.lottiePath) {
      const gxLottie = this.element.querySelector("gx-lottie");
      if (gxLottie) {
        const from = oldValue > newValue ? 0 : oldValue;
        gxLottie.play(from, newValue);
      }
    }
  }

  @Watch("presented")
  presentedWatchHandler(newValue: boolean, oldValue = false) {
    if (newValue === oldValue) {
      return;
    }

    if (newValue) {
      this.present();
    } else {
      this.dismiss();
    }
  }

  present() {
    const rawLottiePath = window
      .getComputedStyle(this.element.querySelector(".gx-lottie-test"))
      .getPropertyValue("--gx-lottie-file-path");

    if (rawLottiePath) {
      this.lottiePath = rawLottiePath
        .trim()
        .replace(/^"/, "")
        .replace(/"$/, "");
    }

    this.element.style.display = "block";
  }

  dismiss() {
    this.element.style.display = "none";
  }

  render() {
    this.element.style.display = this.presented ? "block" : "none";

    return (
      <div class="box" role="dialog">
        <div class="gx-lottie-test" />
        {this.lottiePath ? (
          <gx-lottie
            path={this.lottiePath}
            loop={this.type === "indeterminate"}
            autoPlay={this.type === "indeterminate"}
          />
        ) : (
          <div
            class={{
              [this.type]: true,
              loader: true
            }}
          >
            <div
              class="loader-inner"
              style={{
                width: `${this.value * 100}%`
              }}
            />
          </div>
        )}
        <div class="title">{this.caption}</div>
        <div class="description">{this.description}</div>
      </div>
    );
  }
}
