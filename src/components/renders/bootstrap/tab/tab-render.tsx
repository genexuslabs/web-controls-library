type Constructor<T> = new (...args: any[]) => T;
export function TabRender<T extends Constructor<{}>>(Base: T) {
  return class extends Base {
    element: HTMLElement;

    setSelectedTab(captionElement: HTMLElement) {
      this.getCaptionSlots().forEach((slotElement: any, i) => {
        slotElement.selected = slotElement === captionElement;
        const pageElement = this.element.querySelector(
          `gx-tab-page:nth-child(${i + 1})`
        ) as HTMLElement;
        this.mapPageToCaptionSelection(slotElement, pageElement);
      });
    }

    mapPageToCaptionSelection(captionElement: any, pageElement: HTMLElement) {
      pageElement.classList.toggle("active", captionElement.selected);
    }

    render() {
      this.setCaptionSlotsClass();
      this.setPageSlotsClass();

      return (
        <div role="tablist">
          <div class="nav nav-tabs">
            <slot name="caption" />
          </div>
          <div class="tab-content">
            <slot name="page" />
          </div>
        </div>
      );
    }

    private setCaptionSlotsClass() {
      this.getCaptionSlots().forEach(captionElement => {
        if (!captionElement.classList.contains("nav-item")) {
          captionElement.classList.add("nav-item");
        }
      });
    }

    getCaptionSlots() {
      return Array.from(this.element.querySelectorAll("[slot='caption']"));
    }

    private setPageSlotsClass() {
      this.getPageSlots().forEach(pageElement => {
        if (!pageElement.classList.contains("tab-pane")) {
          pageElement.classList.add("tab-pane");
        }
      });
    }

    getPageSlots() {
      return Array.from(this.element.querySelectorAll("[slot='page']"));
    }
  };
}
