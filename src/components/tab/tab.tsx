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
import {
  Component as GxComponent,
  VisibilityComponent
} from "../common/interfaces";

const BASE_TABLIST_SELECTOR = ":scope > [role='tablist']";

@Component({
  shadow: false,
  styleUrl: "tab.scss",
  tag: "gx-tab"
})
export class Tab implements GxComponent, VisibilityComponent {
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
    const targetElement = event.target as HTMLElement;
    if (targetElement.closest("gx-tab") !== this.element) {
      return;
    }

    const oldSelectedTab = this.lastSelectedTab;
    this.setSelectedTab(targetElement);
    if (oldSelectedTab !== this.lastSelectedTab) {
      this.tabChange.emit(event);
    }
  }

  private setSelectedTab(captionElement: HTMLElement) {
    this.lastSelectedTab = captionElement;
    this.getCaptionSlots().forEach((slotElement: any, i) => {
      slotElement.selected = slotElement === captionElement;
      const nthChild = i + 1;
      const pageElement = this.element.querySelector(
        `:scope > gx-tab-page:nth-child(${nthChild}), 
        ${BASE_TABLIST_SELECTOR} > .tab-content > gx-tab-page:nth-child(${nthChild})`
      ) as HTMLElement;
      this.mapPageToCaptionSelection(slotElement, pageElement);
    });
  }

  private getCaptionSlots(): HTMLElement[] {
    return Array.from(
      this.element.querySelectorAll(
        `:scope > [slot='caption'], 
         ${BASE_TABLIST_SELECTOR} > .nav > [slot='caption']`
      )
    );
  }

  private mapPageToCaptionSelection(
    captionElement: any,
    pageElement: HTMLElement
  ) {
    pageElement.classList.toggle("active", !!captionElement.selected);
  }

  componentDidLoad() {
    this.linkTabs(true);
  }

  componentDidUpdate() {
    this.linkTabs();
  }

  disconnectedCallback() {
    this.lastSelectedTab = null;
  }

  private linkTabs(resolveSelected = false) {
    const captionSlots = this.getCaptionSlots();
    const pageSlots = this.getPageSlots();

    if (captionSlots.length === pageSlots.length) {
      captionSlots.forEach((captionElement: any, i) => {
        const pageElement: any = pageSlots[i];
        captionElement.setAttribute("aria-controls", pageElement.id);
        pageElement.setAttribute("aria-labelledby", captionElement.id);
        if (resolveSelected) {
          this.mapPageToCaptionSelection(captionElement, pageElement);
          if (captionElement.selected) {
            this.lastSelectedTab = captionElement;
          }
        }
      });
    }
  }

  render() {
    this.setCaptionSlotsClass();
    this.setPageSlotsClass();
    return (
      <Host>
        <div role="tablist">
          <div class="nav nav-tabs">
            <slot name="caption" />
          </div>
          <div class="tab-content">
            <slot name="page" />
          </div>
        </div>
      </Host>
    );
  }

  private setCaptionSlotsClass() {
    this.getCaptionSlots().forEach(captionElement => {
      if (!captionElement.classList.contains("nav-item")) {
        captionElement.classList.add("nav-item");
      }
    });
  }

  private setPageSlotsClass() {
    this.getPageSlots().forEach(pageElement => {
      if (!pageElement.classList.contains("tab-pane")) {
        pageElement.classList.add("tab-pane");
      }
    });
  }

  private getPageSlots(): HTMLElement[] {
    return Array.from(
      this.element.querySelectorAll(
        `:scope > [slot='page'], 
         ${BASE_TABLIST_SELECTOR} > .tab-content > [slot='page']`
      )
    );
  }
}
