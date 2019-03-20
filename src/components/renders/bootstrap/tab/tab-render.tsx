import { IRenderer } from "../../../common/interfaces";
import { Tab } from "../../../tab/tab";

export class TabRender implements IRenderer {
  constructor(public component: Tab) {}

  setSelectedTab(captionElement: HTMLElement) {
    this.getCaptionSlots().forEach((slotElement: any, i) => {
      slotElement.selected = slotElement === captionElement;
      const pageElement = this.component.element.querySelector(
        `gx-tab-page:nth-child(${i + 1})`
      ) as HTMLElement;
      this.mapPageToCaptionSelection(slotElement, pageElement);
    });
  }

  mapPageToCaptionSelection(captionElement: any, pageElement: HTMLElement) {
    pageElement.classList.toggle("active", !!captionElement.selected);
  }

  render() {
    this.setCaptionSlotsClass();
    this.setPageSlotsClass();

    return [
      <gx-bootstrap />,
      <div role="tablist">
        <div class="nav nav-tabs">
          <slot name="caption" />
        </div>
        <div class="tab-content">
          <slot name="page" />
        </div>
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
      this.component.element.querySelectorAll("[slot='caption']")
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
    return Array.from(this.component.element.querySelectorAll("[slot='page']"));
  }
}
