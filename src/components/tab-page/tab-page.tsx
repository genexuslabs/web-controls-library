import { Component, Element, h } from "@stencil/core";
import { IComponent } from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "tab-page.scss",
  tag: "gx-tab-page"
})
export class TabPage implements IComponent {
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
