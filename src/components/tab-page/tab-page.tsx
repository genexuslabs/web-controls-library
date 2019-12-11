import { Component, Element, h, Host } from "@stencil/core";
import { Component as GxComponent } from "../common/interfaces";

let autoTabId = 0;

@Component({
  shadow: false,
  styleUrl: "tab-page.scss",
  tag: "gx-tab-page"
})
export class TabPage implements GxComponent {
  @Element() element: HTMLGxTabPageElement;

  componentWillLoad() {
    if (!this.element.id) {
      this.element.id = `gx-tab-page-auto-id-${autoTabId++}`;
    }
  }

  render() {
    return (
      <Host role="tabpanel" tabindex="0">
        <slot />
      </Host>
    );
  }
}
