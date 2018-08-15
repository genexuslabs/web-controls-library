import { Component, Element } from "@stencil/core";
import { BaseComponent } from "../common/base-component";

@Component({
  shadow: false,
  styleUrl: "tab-page.scss",
  tag: "gx-tab-page"
})
export class TabPage extends BaseComponent {
  @Element() element: HTMLElement;

  componentWillLoad() {
    if (!this.element.id) {
      this.element.id = `gx-tab-page-auto-id-${autoTabId++}`;
    }
  }

  hostData() {
    return {
      role: "tabpanel",
      tabindex: 0
    };
  }

  render() {
    return <slot />;
  }
}

let autoTabId = 0;
