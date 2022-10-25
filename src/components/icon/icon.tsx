import {
  Component,
  Element,
  Host,
  Prop,
  State,
  Watch,
  getAssetPath,
  h
} from "@stencil/core";
import { getSvgContent, iconContent } from "./requests";

const CAMEL_CASE_TO_HYPHENED_REGEX = /(.)([A-Z])/g;

@Component({
  tag: "gx-icon",
  styleUrl: "icon.scss",
  shadow: true,
  assetsDirs: ["assets"]
})
export class Icon {
  private io?: IntersectionObserver;

  @Element() element: HTMLGxIconElement;

  /**
   * The color of the icon.
   *
   */
  @Prop() color: string;

  /**
   * A label for the icon, for screen readers to use.
   */
  @Prop() label = "";

  /**
   * If enabled, the icon will be loaded lazily when it's visible in the viewport.
   */
  @Prop() lazy = false;

  /**
   * The type of icon. Possible values: the name each of the icons in /assets.
   */
  @Prop() type = "none";

  @State() private isVisible = false;

  @State() private svgContent?: string;

  connectedCallback() {
    // purposely do not return the promise here because loading
    // the svg file should not hold up loading the app
    // only load the svg if it's visible
    this.waitUntilVisible(this.element, "50px", () => {
      this.isVisible = true;
      this.getIcon();
    });
  }

  disconnectedCallback() {
    // eslint-disable-next-line @stencil/strict-boolean-conditions
    if (this.io) {
      this.io.disconnect();
      this.io = undefined;
    }
  }

  private waitUntilVisible(
    el: HTMLElement,
    rootMargin: string,
    callback: () => void
  ) {
    if (
      this.lazy &&
      typeof window !== "undefined" &&
      (window as any).IntersectionObserver
    ) {
      const io = (this.io = new (window as any).IntersectionObserver(
        (data: IntersectionObserverEntry[]) => {
          if (data[0].isIntersecting) {
            io.disconnect();
            this.io = undefined;
            callback();
          }
        },
        { rootMargin }
      ));

      io.observe(el);
    } else {
      // browser doesn't support IntersectionObserver
      // so just fallback to always show it
      callback();
    }
  }

  @Watch("type")
  private async getIcon() {
    if (this.isVisible) {
      if (this.type === "none") {
        this.svgContent = "";
        return;
      }

      const fileName = this.getFileName();

      const url = getAssetPath(`./assets/${fileName}`);
      if (url) {
        if (iconContent.has(url)) {
          this.svgContent = iconContent.get(url);
        } else {
          this.svgContent = await getSvgContent(url);
        }
      }
    }
  }

  private getFileName() {
    const name = this.type
      .replace(CAMEL_CASE_TO_HYPHENED_REGEX, "$1-$2")
      .toLowerCase();
    return `${name}.svg`;
  }

  render() {
    return (
      <Host aria-label={this.label || this.type}>
        <div
          class={{
            "svg-icon-native": true
          }}
          style={
            this.color && {
              "--gx-icon-color": this.color
            }
          }
          innerHTML={this.svgContent}
        />
      </Host>
    );
  }
}
