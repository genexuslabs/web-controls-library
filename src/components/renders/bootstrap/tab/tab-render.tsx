import { h } from "@stencil/core";
import { Renderer } from "../../../common/interfaces";
import { Tab } from "../../../tab/tab";

const BASE_TABLIST_SELECTOR = ":scope > [role='tablist']";
export class TabRender implements Renderer {
  constructor(private component: Tab) {}

  setSelectedTab(captionElement: HTMLElement) {
    this.getCaptionSlots().forEach((slotElement: any, i) => {
      slotElement.selected = slotElement === captionElement;
      const nthChild = i + 1;
      const pageElement = this.component.element.querySelector(
        `:scope > gx-tab-page:nth-child(${nthChild}), 
        ${BASE_TABLIST_SELECTOR} > .tab-content > gx-tab-page:nth-child(${nthChild})`
      ) as HTMLElement;
      this.mapPageToCaptionSelection(slotElement, pageElement);
    });
  }

  mapPageToCaptionSelection(captionElement: any, pageElement: HTMLElement) {
    pageElement.classList.toggle("active", !!captionElement.selected);
  }

  render(slots: { caption; page }) {
    this.setCaptionSlotsClass();
    this.setPageSlotsClass();

    return [
      <gx-bootstrap />,
      <div role="tablist">
        <div class="nav nav-tabs">{slots.caption}</div>
        <div class="tab-content">{slots.page}</div>
      </div>
    ];
  }

  private setCaptionSlotsClass() {
    this.getCaptionSlots().forEach(captionElement => {
      if (!captionElement.classList.contains("nav-item")) {
        captionElement.classList.add("nav-item");
      }
    });
  }

  getCaptionSlots(): HTMLElement[] {
    return Array.from(
      this.component.element.querySelectorAll(
        `:scope > [slot='caption'], 
         ${BASE_TABLIST_SELECTOR} > .nav > [slot='caption']`
      )
    );
  }

  private setPageSlotsClass() {
    this.getPageSlots().forEach(pageElement => {
      if (!pageElement.classList.contains("tab-pane")) {
        pageElement.classList.add("tab-pane");
      }
    });
  }

  getPageSlots(): HTMLElement[] {
    return Array.from(
      this.component.element.querySelectorAll(
        `:scope > [slot='page'], 
         ${BASE_TABLIST_SELECTOR} > .tab-content > [slot='page']`
      )
    );
  }
}
