import {
  Component,
  Element,
  Event,
  EventEmitter,
  Host,
  Listen,
  Prop,
  h
} from "@stencil/core";
import {
  Component as GxComponent,
  VisibilityComponent
} from "../common/interfaces";
import {
  HighlightableComponent,
  makeHighlightable
} from "../common/highlightable";

const BASE_TABLIST_SELECTOR = ":scope > [role='tablist']";

@Component({
  shadow: false,
  styleUrl: "tab.scss",
  tag: "gx-tab"
})
export class Tab
  implements GxComponent, VisibilityComponent, HighlightableComponent {
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
   * True to highlight control when an action is fired.
   */
  @Prop() readonly highlightable = false;

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
        ${BASE_TABLIST_SELECTOR} > .gx-tab-content > gx-tab-page:nth-child(${nthChild})`
      ) as HTMLElement;
      this.mapPageToCaptionSelection(slotElement, pageElement);
    });
  }

  private getCaptionSlots(): HTMLElement[] {
    return Array.from(
      this.element.querySelectorAll(
        `:scope > [slot='caption'], 
         ${BASE_TABLIST_SELECTOR} > .gx-nav-tabs > .gx-nav-tabs-table > [slot='caption']`
      )
    );
  }

  private mapPageToCaptionSelection(
    captionElement: any,
    pageElement: HTMLElement
  ) {
    pageElement.classList.toggle(
      "gx-tab-page--active",
      !!captionElement.selected
    );
  }

  componentDidLoad() {
    makeHighlightable(this);
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
          <div class="gx-nav-tabs">
            <div class="gx-nav-tabs-table">
              <slot name="caption" />
              <div aria-hidden="true" class="gx-nav-tabs-filler"></div>
            </div>
          </div>
          <div class="gx-tab-content">
            <slot name="page" />
          </div>
        </div>
      </Host>
    );
  }

  private setCaptionSlotsClass() {
    this.getCaptionSlots().forEach(captionElement => {
      if (!captionElement.classList.contains("gx-nav-item")) {
        captionElement.classList.add("gx-nav-item");
      }
    });
  }

  private setPageSlotsClass() {
    this.getPageSlots().forEach(pageElement => {
      if (!pageElement.classList.contains("gx-tab-page")) {
        pageElement.classList.add("gx-tab-page");
      }
    });
  }

  private getPageSlots(): HTMLElement[] {
    return Array.from(
      this.element.querySelectorAll(
        `:scope > [slot='page'], 
         ${BASE_TABLIST_SELECTOR} > .gx-tab-content > [slot='page']`
      )
    );
  }
}
