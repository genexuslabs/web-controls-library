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
import { Component as GxComponent, LayoutSize } from "../common/interfaces";
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
   * `false` to hide the bottom target
   */
  @Prop() readonly bottomVisible = false;

  /**
   * This attribute lets you specify the layout size of the application.
   * Each layout size will set different behaviors in the gx-layout control.
   */
  @Prop() readonly layoutSize: LayoutSize = "large";

  /**
   * `false` to hide the left target
   */
  @Prop({ mutable: true }) leftVisible = false;

  /**
   * `false` to hide the right target
   */
  @Prop({ mutable: true }) rightVisible = false;

  /**
   * `false` to hide the top target.
   */
  @Prop() readonly topVisible = false;

  @State() isMaskVisible = this.rightVisible || this.leftVisible;

  /**
   * Fired when the leftHidden property is changed
   */
  @Event() leftHiddenChange: EventEmitter;

  /**
   * Fired when the rightVisible property is changed
   */
  @Event() rightHiddenChange: EventEmitter;

  @Watch("rightVisible")
  handleRightHiddenChange() {
    this.updateMaskVisibility();
    this.rightHiddenChange.emit(!this.rightVisible);
  }

  @Watch("leftVisible")
  handleLeftHiddenChange() {
    this.updateMaskVisibility();
    this.leftHiddenChange.emit(!this.leftVisible);
  }

  private updateMaskVisibility() {
    this.isMaskVisible = this.rightVisible || this.leftVisible;
  }

  /**
   * Close gx-layout's targets when the mask is clicked.
   */
  private closeTargets = (e: MouseEvent) => {
    e.stopPropagation();
    this.rightVisible = false;
    this.leftVisible = false;
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

        {this.topVisible && (
          <header class="target top">
            <slot name="top" />
          </header>
        )}

        <aside
          class={{
            "target vertical left": true,
            "bottom-navbar-and-small-layout-size": bottomNavbarAndSmallLayoutSize,
            "not-large-layout-size": notLargeLayoutSize
          }}
          hidden={!this.leftVisible}
        >
          <slot name="left" />
        </aside>

        <aside
          class={{
            "target vertical right": true,
            "bottom-navbar-and-small-layout-size": bottomNavbarAndSmallLayoutSize,
            "not-large-layout-size": notLargeLayoutSize
          }}
          hidden={!this.rightVisible}
        >
          <slot name="right" />
        </aside>

        {this.bottomVisible && (
          <footer class="target bottom">
            <slot name="bottom" />
          </footer>
        )}
      </Host>
    );
  }
}
