import {
  Component,
  Element,
  Event,
  EventEmitter,
  Listen,
  Prop,
  h,
  Host
} from "@stencil/core";
import { TabRender } from "../renders/bootstrap/tab/tab-render";
import {
  Component as GxComponent,
  VisibilityComponent
} from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "tab.scss",
  tag: "gx-tab"
})
export class Tab implements GxComponent, VisibilityComponent {
  constructor() {
    this.renderer = new TabRender(this);
  }

  private renderer: TabRender;

  @Element() element: HTMLGxTabElement;

  private lastSelectedTab: HTMLElement;

  /**
   * This attribute lets you specify how this element will behave when hidden.
   *
   * | Value        | Details                                                                     |
   * | ------------ | --------------------------------------------------------------------------- |
   * | `keep-space` | The element remains in the document flow, and it does occupy space.         |
   * | `collapse`   | The element is removed form the document flow, and it doesn't occupy space. |
   */
  @Prop() readonly invisibleMode: "collapse" | "keep-space" = "collapse";

  /**
   * Fired when the active tab is changed
   *
   */
  @Event() tabChange: EventEmitter;

  @Listen("tabSelect")
  tabClickHandler(event: CustomEvent) {
    const oldSelectedTab = this.lastSelectedTab;
    this.setSelectedTab(event.target as HTMLElement);
    if (oldSelectedTab !== this.lastSelectedTab) {
      this.tabChange.emit(event);
    }
  }

  private setSelectedTab(captionElement: HTMLElement) {
    this.lastSelectedTab = captionElement;
    this.renderer.setSelectedTab(captionElement);
  }

  componentDidLoad() {
    this.linkTabs(true);
  }

  componentDidUpdate() {
    this.linkTabs();
  }

  componentDidUnload() {
    this.lastSelectedTab = null;
  }

  private linkTabs(resolveSelected = false) {
    const captionSlots = this.renderer.getCaptionSlots();
    const pageSlots = this.renderer.getPageSlots();

    if (captionSlots.length === pageSlots.length) {
      captionSlots.forEach((captionElement: any, i) => {
        const pageElement: any = pageSlots[i];
        captionElement.setAttribute("aria-controls", pageElement.id);
        pageElement.setAttribute("aria-labelledby", captionElement.id);
        if (resolveSelected) {
          this.renderer.mapPageToCaptionSelection(captionElement, pageElement);
          if (captionElement.selected) {
            this.lastSelectedTab = captionElement;
          }
        }
      });
    }
  }

  render() {
    return (
      <Host>
        {this.renderer.render({
          caption: <slot name="caption" />,
          page: <slot name="page" />
        })}
      </Host>
    );
  }
}
