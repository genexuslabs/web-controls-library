import {
  Component,
  Element,
  Event,
  EventEmitter,
  Prop,
  h,
  Host
} from "@stencil/core";
import {
  Component as GxComponent,
  DisableableComponent
} from "../common/interfaces";
import { TabCaptionRender } from "../renders/bootstrap/tab-caption/tab-caption-render";

let autoTabId = 0;

@Component({
  shadow: false,
  styleUrl: "tab-caption.scss",
  tag: "gx-tab-caption"
})
export class TabCaption implements GxComponent, DisableableComponent {
  constructor() {
    this.renderer = new TabCaptionRender(this);
  }

  private renderer: TabCaptionRender;

  @Element() element: HTMLGxTabCaptionElement;

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
  @Event() tabSelect: EventEmitter;

  componentWillLoad() {
    if (!this.element.id) {
      this.element.id = `gx-tab-caption-auto-id-${autoTabId++}`;
    }
  }

  render() {
    return (
      <Host role="tab">{this.renderer.render({ default: <slot /> })}</Host>
    );
  }
}
