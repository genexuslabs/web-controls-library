import { Component, Element, h, Host, Prop } from "@stencil/core";
import { Component as GxComponent } from "../common/interfaces";

let autoTabId = 0;

@Component({
  shadow: true,
  styleUrl: "tab-page.scss",
  tag: "gx-tab-page"
})
export class TabPage implements GxComponent {
  @Element() element: HTMLGxTabPageElement;

  /**
   * This attribute lets you specify if the tab page is selected.
   */
  @Prop() readonly selected: boolean = false;

  componentWillLoad() {
    if (!this.element.id) {
      this.element.id = `gx-tab-page-auto-id-${autoTabId++}`;
    }
  }

  render() {
    return (
      <Host
        role="tabpanel"
        tabindex="0"
        class={this.selected ? "gx-tab-page--selected" : undefined}
      >
        <slot />
      </Host>
    );
  }
}
