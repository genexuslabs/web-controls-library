import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Prop,
  State,
  Watch
} from "@stencil/core";
import { Component as GxComponent } from "../common/interfaces";
import { getWindowsOrientation } from "../common/utils";

@Component({
  shadow: false,
  styleUrl: "layout.scss",
  tag: "gx-layout"
})
export class Layout implements GxComponent {
  // Media queries
  private mediaQueryOrientation: MediaQueryList;

  @Element() element: HTMLGxLayoutElement;

  /**
   * `true` if the bottom navbar is visible in the application.
   */
  @Prop() readonly bottomNavbarVisible: boolean = false;

  /**
   * This attribute lets you specify the layout size of the application.
   * Each layout size will set different behaviors in the gx-layout control.
   */
  @Prop() readonly layoutSize: "small" | "medium" | "large" = "large";

  /**
   * True to hide the top target
   */
  @Prop() readonly topHidden = false;

  /**
   * True to hide the right target
   */
  @Prop({ mutable: true }) rightHidden = false;

  /**
   * True to hide the bottom target
   */
  @Prop() readonly bottomHidden = false;

  /**
   * True to hide the left target
   */
  @Prop({ mutable: true }) leftHidden = false;

  @State() isMaskVisible = !this.rightHidden || !this.leftHidden;

  /**
   * Fired when the leftHidden property is changed
   */
  @Event() leftHiddenChange: EventEmitter;

  /**
   * Fired when the rightHidden property is changed
   */
  @Event() rightHiddenChange: EventEmitter;

  @Watch("rightHidden")
  handleRightHiddenChange() {
    this.updateMaskVisibility();
    this.rightHiddenChange.emit(this.rightHidden);
  }

  @Watch("leftHidden")
  handleLeftHiddenChange() {
    this.updateMaskVisibility();
    this.leftHiddenChange.emit(this.leftHidden);
  }

  private updateMaskVisibility() {
    this.isMaskVisible = !this.rightHidden || !this.leftHidden;
  }

  /**
   * Close gx-layout's targets when the mask is clicked.
   */
  private closeTargets = (e: MouseEvent) => {
    e.stopPropagation();
    this.rightHidden = true;
    this.leftHidden = true;
  };

  private updateGridsOrientation() {
    const grids = this.element.querySelectorAll("gx-grid-horizontal");
    const orientation = getWindowsOrientation();

    grids.forEach(grid => {
      grid.orientation = orientation;
    });
  }

  private startMediaQueryMonitoring() {
    // This event fires when the orientation is changed to "portrait" or "landscape"
    this.mediaQueryOrientation = window.matchMedia("(orientation: portrait)");
    this.mediaQueryOrientation.addEventListener("change", () =>
      this.updateGridsOrientation()
    );
  }

  private endMediaQueryMonitoring() {
    this.mediaQueryOrientation.removeEventListener(
      "change",
      this.updateGridsOrientation
    );
  }

  componentDidLoad() {
    this.startMediaQueryMonitoring();
  }

  disconnectedCallback() {
    this.endMediaQueryMonitoring();
  }

  render() {
    const bottomNavbarAndSmallLayoutSize =
      this.bottomNavbarVisible && this.layoutSize === "small";
    const notLargeLayoutSize = this.layoutSize !== "large";

    return (
      <Host>
        <main class="target center">
          <div
            class={{
              mask: true,
              "mask--active": this.isMaskVisible && notLargeLayoutSize
            }}
            onClick={this.closeTargets}
          ></div>
          <slot />
        </main>
        <header class="target top" hidden={this.topHidden}>
          <slot name="top" />
        </header>
        <aside
          class={{
            "target vertical left": true,
            "bottom-navbar-and-small-layout-size": bottomNavbarAndSmallLayoutSize,
            "not-large-layout-size": notLargeLayoutSize
          }}
          hidden={this.leftHidden}
        >
          <slot name="left" />
        </aside>
        <aside
          class={{
            "target vertical right": true,
            "bottom-navbar-and-small-layout-size": bottomNavbarAndSmallLayoutSize,
            "not-large-layout-size": notLargeLayoutSize
          }}
          hidden={this.rightHidden}
        >
          <slot name="right" />
        </aside>
        <footer class="target bottom" hidden={this.bottomHidden}>
          <slot name="bottom" />
        </footer>
      </Host>
    );
  }
}
