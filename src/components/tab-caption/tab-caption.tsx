import {
  Component,
  Element,
  Event,
  EventEmitter,
  Prop,
  Watch,
  h
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
   * This attribute lets you specify the relative location of the image to the text.
   *
   * | Value    | Details                                                 |
   * | -------- | ------------------------------------------------------- |
   * | `above`  | The image is located above the text.                    |
   * | `before` | The image is located before the text, in the same line. |
   * | `after`  | The image is located after the text, in the same line.  |
   * | `below`  | The image is located below the text.                    |
   * | `behind` | The image is located behind the text.                   |
   */
  @Prop() readonly imagePosition:
    | "above"
    | "before"
    | "after"
    | "below"
    | "behind" = "above";

  /**
   * This attribute lets you specify if the tab page corresponding to this caption is selected
   *
   */
  @Prop() selected = false;

  @Watch("selected")
  selectedHandler() {
    if (this.selected) {
      this.tabSelect.emit(event);
    }
  }

  /**
   * Fired when the tab caption is selected
   *
   */
  @Event() tabSelect: EventEmitter;

  componentWillLoad() {
    if (!this.element.id) {
      this.element.id = `gx-tab-caption-auto-id-${autoTabId++}`;
    }
    this.renderer.componentWillLoad();
  }

  render() {
    return this.renderer.render({
      default: <slot />,
      disabledImage: <slot name="disabled-image" />,
      mainImage: <slot name="main-image" />
    });
  }
}
