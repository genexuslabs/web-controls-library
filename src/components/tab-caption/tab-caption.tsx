import {
  Component,
  Element,
  Event,
  EventEmitter,
  Prop,
  h
} from "@stencil/core";
import { IComponent, IDisableableComponent } from "../common/interfaces";

import { TabCaptionRender } from "../renders/bootstrap/tab-caption/tab-caption-render";

@Component({
  shadow: false,
  styleUrl: "tab-caption.scss",
  tag: "gx-tab-caption"
})
export class TabCaption implements IComponent, IDisableableComponent {
  constructor() {
    this.renderer = new TabCaptionRender(this);
  }

  private renderer: TabCaptionRender;

  @Element() element: HTMLElement;

  /**
   * This attribute lets you specify if the tab page is disabled
   *
   */
  @Prop() disabled = false;

  /**
   * This attribute lets you specify if the tab page corresponding to this caption is selected
   *
   */
  @Prop() selected = false;

  /**
   * Fired when the tab caption is selected
   *
   */
  @Event() onTabSelect: EventEmitter;

  componentWillLoad() {
    if (!this.element.id) {
      this.element.id = `gx-tab-caption-auto-id-${autoTabId++}`;
    }
  }

  hostData() {
    return {
      role: "tab"
    };
  }

  render() {
    return this.renderer.render({ default: <slot /> });
  }
}

let autoTabId = 0;
