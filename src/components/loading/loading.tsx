import { Component, Element, Prop, State, Watch, h, Host } from "@stencil/core";
import { Component as GxComponent } from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "loading.scss",
  tag: "gx-loading"
})
export class Loading implements GxComponent {
  @Element() element: HTMLGxLoadingElement;

  @State() private lottiePath = "";

  /**
   * Sets the description text.
   */
  @Prop() readonly description: string;

  /**
   * Sets the caption text.
   */
  @Prop() readonly caption: string;

  /**
   * Sets if the loading dialog is presented.
   */
  @Prop() readonly presented = false;

  /**
   * Sets if the loading will be separated from the main content of the page.
   * If `dialog = true` the `gx-loading` will be displayed separately from the
   * main content the web page in a dialog box.
   * If `dialog = false` the `gx-loading` will be displayed inside its
   * container and will not be separated from the web page.
   */
  @Prop() readonly dialog = false;

  /**
   * Sets the value.
   */
  @Prop() readonly type: "determinate" | "indeterminate";

  /**
   * Sets the value when type is determinate. Must be a value between 0 and 1.
   */
  @Prop() readonly value = 0;

  @Watch("value")
  valueWatchHandler(newValue: number, oldValue: number) {
    if (newValue === oldValue) {
      return;
    }

    if (this.lottiePath) {
      const gxLottie = this.element.querySelector("gx-lottie");
      if (gxLottie !== null) {
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

  private present() {
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

  private dismiss() {
    this.element.style.display = "none";
  }

  render() {
    this.element.style.display = this.presented ? "block" : "none";

    return (
      <Host class={{ dialog: this.dialog }}>
        <div class="box" role={this.dialog ? "dialog" : null}>
          <div class="gx-lottie-test" />

          {this.lottiePath ? (
            <gx-lottie
              path={this.lottiePath}
              loop={this.type === "indeterminate"}
              autoPlay={this.type === "indeterminate"}
            />
          ) : this.dialog ? (
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
          ) : (
            // Default loading animation if no gx-lottie
            <div class="loading-rotate-container">
              <div class="circle" />
              <div class="circle" />
              <div class="circle" />
            </div>
          )}
          <div class="title">{this.caption}</div>
          <div class="description">{this.description}</div>
        </div>
      </Host>
    );
  }
}
