import {
  Component,
  Element,
  Event,
  EventEmitter,
  Listen,
  Prop
} from "@stencil/core";
import { BaseComponent } from "../common/base-component";
import { TabRender } from "../renders/bootstrap/tab/tab-render";

@Component({
  shadow: false,
  styleUrl: "tab.scss",
  tag: "gx-tab"
})
export class Tab extends TabRender(BaseComponent) {
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
    super.setSelectedTab(captionElement);
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
    const captionSlots = super.getCaptionSlots();
    const pageSlots = super.getPageSlots();

    if (captionSlots.length === pageSlots.length) {
      captionSlots.forEach((captionElement: any, i) => {
        const pageElement: any = pageSlots[i];
        captionElement.setAttribute("aria-controls", pageElement.id);
        pageElement.setAttribute("aria-labelledby", captionElement.id);
        if (resolveSelected) {
          super.mapPageToCaptionSelection(captionElement, pageElement);
          if (captionElement.selected) {
            this.lastSelectedTab = captionElement;
          }
        }
      });
    }
  }
}
