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
  shadow: true,
  styleUrl: "layout.scss",
  tag: "gx-layout"
})
export class Layout implements GxComponent {
  // Media queries
  private mediaQueryOrientation: MediaQueryList;

  @Element() element: HTMLGxLayoutElement;

  /**
   * `true` if the bottom navbar is visible in the application.
   * This property can only be true if `layoutSize` == `"small"`
   */
  @Prop() readonly bottomNavbarVisible: boolean = false;

  /**
   * `false` to hide the bottom target
   */
  @Prop() readonly bottomVisible = false;

  /**
   * This attribute lets you specify if the header row pattern is enabled in
   * the top navbar.
   */
  @Prop() readonly enableHeaderRowPattern: boolean = false;

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
   * `true` if the top navbar is visible in the application.
   */
  @Prop() readonly topNavbarVisible: boolean = false;

  /**
   * `false` to hide the top target.
   */
  @Prop() readonly topVisible = false;

  @State() isMaskVisible = this.rightVisible || this.leftVisible;

  /**
   * Fired when the leftVisible property is changed
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
    const notLargeLayoutSize = this.layoutSize !== "large";

    return (
      <Host
        class={{
          "gx-navbar-bottom--visible": this.bottomNavbarVisible,

          "gx-navbar-top--visible-HRP":
            this.topNavbarVisible && this.enableHeaderRowPattern,
          "gx-navbar-top--visible-no-HRP":
            this.topNavbarVisible && !this.enableHeaderRowPattern
        }}
      >
        <main class="target center" part="main">
          <slot />
          {this.isMaskVisible && notLargeLayoutSize && (
            <div class="mask" part="mask" onClick={this.closeTargets}></div>
          )}
        </main>

        {this.topVisible && (
          <header class="target top" part="header">
            <slot name="top" />
          </header>
        )}

        <aside
          class={{
            "target vertical left": true,
            "not-large-layout-size": notLargeLayoutSize
          }}
          part="left"
          hidden={!this.leftVisible}
        >
          <slot name="left" />
        </aside>

        <aside
          class={{
            "target vertical right": true,
            "not-large-layout-size": notLargeLayoutSize
          }}
          part="right"
          hidden={!this.rightVisible}
        >
          <slot name="right" />
        </aside>

        {this.bottomVisible && (
          <footer class="target bottom" part="footer">
            <slot name="bottom" />
          </footer>
        )}
      </Host>
    );
  }
}
