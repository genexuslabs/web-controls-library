import { Component, Element, h, Host, Prop, Watch, State } from "@stencil/core";
import { Component as GxComponent } from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "layout.scss",
  tag: "gx-layout"
})
export class Layout implements GxComponent {
  constructor() {
    this.handleBodyClick = this.handleBodyClick.bind(this);
    this.handleMediaQueryChange = this.handleMediaQueryChange.bind(this);
  }

  @Element() element: HTMLGxLayoutElement;

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

  private mediaQueryList: MediaQueryList;
  private isVerticalTargetsBreakpoint = false;

  @Watch("rightHidden")
  handleRightHiddenChange() {
    this.updateMaskVisibility();
  }

  @Watch("leftHidden")
  handleLeftHiddenChange() {
    this.updateMaskVisibility();
  }

  private updateMaskVisibility() {
    this.isMaskVisible = !this.rightHidden || !this.leftHidden;
  }

  private handleBodyClick(e: MouseEvent) {
    if (this.isMaskVisible && this.isVerticalTargetsBreakpoint) {
      const target = e.target as HTMLElement;
      if (!target.matches(`gx-layout .vertical ${target.tagName}`)) {
        this.rightHidden = true;
        this.leftHidden = true;
      }
    }
  }

  componentDidLoad() {
    document.body.addEventListener("click", this.handleBodyClick);

    const targetsBreakpoint = getComputedStyle(this.element).getPropertyValue(
      "--gx-layout-vertical-targets-breakpoint"
    );
    this.mediaQueryList = window.matchMedia(
      `(max-width: ${targetsBreakpoint})`
    );
    this.isVerticalTargetsBreakpoint = this.mediaQueryList.matches;
    this.mediaQueryList.addEventListener("change", this.handleMediaQueryChange);
  }

  private handleMediaQueryChange(e: MediaQueryListEvent) {
    this.isVerticalTargetsBreakpoint = e.matches;
  }

  disconnectedCallback() {
    document.body.removeEventListener("click", this.handleBodyClick);
    this.mediaQueryList.removeEventListener(
      "change",
      this.handleMediaQueryChange
    );
  }

  render() {
    return (
      <Host>
        <main class="target center">
          <div
            class={{
              mask: true,
              "mask--active": this.isMaskVisible
            }}
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
