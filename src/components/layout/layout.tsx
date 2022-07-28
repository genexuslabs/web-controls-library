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
  constructor() {
    this.handleMediaQueryChange = this.handleMediaQueryChange.bind(this);
  }

  @Element() element: HTMLGxLayoutElement;

  /**
   * `true` if the bottom navbar is visible in the application.
   */
  @Prop() readonly bottomNavbarVisible: boolean = false;

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

  /**
   * Fired when the viewport size is less than the vertical targets breakpoint.
   */
  @Event() verticalTargetsBreakpointMatchChange: EventEmitter;

  private mediaQueryList: MediaQueryList;
  private mediaQueryOrientation: MediaQueryList;

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

  componentDidLoad() {
    this.startMediaQueryMonitoring();
  }

  disconnectedCallback() {
    this.endMediaQueryMonitoring();
  }

  private startMediaQueryMonitoring() {
    const targetsBreakpoint = getComputedStyle(this.element).getPropertyValue(
      "--gx-layout-vertical-targets-breakpoint"
    );
    this.mediaQueryList = window.matchMedia(
      `(max-width: ${targetsBreakpoint})`
    );
    this.updateVerticalTargetsBreakpointStatus(this.mediaQueryList.matches);
    this.mediaQueryList.addEventListener("change", this.handleMediaQueryChange);

    // This event fires when the orientation is changed to "portrait" or "landscape"
    this.mediaQueryOrientation = window.matchMedia("(orientation: portrait)");
    this.mediaQueryOrientation.addEventListener("change", () =>
      this.updateGridsOrientation()
    );
  }

  private handleMediaQueryChange(event: MediaQueryListEvent) {
    this.updateVerticalTargetsBreakpointStatus(event.matches);
  }

  private updateVerticalTargetsBreakpointStatus(matches: boolean) {
    this.verticalTargetsBreakpointMatchChange.emit({
      matches
    });
  }

  private endMediaQueryMonitoring() {
    this.mediaQueryList.removeEventListener(
      "change",
      this.handleMediaQueryChange
    );

    this.mediaQueryOrientation.removeEventListener(
      "change",
      this.updateGridsOrientation
    );
  }

  render() {
    return (
      <Host data-bottom-navbar={this.bottomNavbarVisible ? "" : undefined}>
        <main class="target center">
          <div
            class={{
              mask: true,
              "mask--active": this.isMaskVisible
            }}
            onClick={this.closeTargets}
          ></div>
          <slot />
        </main>
        <header class="target top" hidden={this.topHidden}>
          <slot name="top" />
        </header>
        <aside class="target vertical left" hidden={this.leftHidden}>
          <slot name="left" />
        </aside>
        <aside class="target vertical right" hidden={this.rightHidden}>
          <slot name="right" />
        </aside>
        <footer class="target bottom" hidden={this.bottomHidden}>
          <slot name="bottom" />
        </footer>
      </Host>
    );
  }
}
