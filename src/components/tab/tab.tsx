import {
  Component,
  Element,
  Event,
  EventEmitter,
  Listen,
  Prop
} from "@stencil/core";
import { TabRender } from "../renders/bootstrap/tab/tab-render";
import { IComponent, IVisibilityComponent } from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "tab.scss",
  tag: "gx-tab"
})
export class Tab implements IComponent, IVisibilityComponent {
  constructor() {
    this.renderer = new TabRender(this);
  }

  private renderer: TabRender;

  @Element() element: HTMLElement;

  private lastSelectedTab: HTMLElement;

  /**
   * This attribute lets you specify how this element will behave when hidden.
   *
   * | Value        | Details                                                                     |
   * | ------------ | --------------------------------------------------------------------------- |
   * | `keep-space` | The element remains in the document flow, and it does occupy space.         |
   * | `collapse`   | The element is removed form the document flow, and it doesn't occupy space. |
   */
  @Prop() invisibleMode: "collapse" | "keep-space" = "collapse";

  /**
   * Fired when the active tab is changed
   *
   */
  @Event() onTabChange: EventEmitter;

  @Listen("onTabSelect")
  tabClickHandler(event: CustomEvent) {
    const oldSelectedTab = this.lastSelectedTab;
    this.setSelectedTab(event.target as HTMLElement);
    if (oldSelectedTab !== this.lastSelectedTab) {
      this.onTabChange.emit(event);
    }
  }

  setSelectedTab(captionElement: HTMLElement) {
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
    return this.renderer.render();
  }
}
