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
    if (this.isMaskVisible) {
      const target = e.target as HTMLElement;
      console.log(`gx-layout .vertical ${target.tagName}`);
      if (!target.matches(`gx-layout .vertical ${target.tagName}`)) {
        this.rightHidden = true;
        this.leftHidden = true;
      }
    }
  }

  componentDidLoad() {
    document.body.addEventListener("click", this.handleBodyClick);
  }

  disconnectedCallback() {
    document.body.removeEventListener("click", this.handleBodyClick);
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
