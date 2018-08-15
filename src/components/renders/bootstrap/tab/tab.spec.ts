import { TestWindow } from "@stencil/core/testing";
import { Tab } from "../../../tab/tab";
import { TabCaption } from "../../../tab-caption/tab-caption";
import { TabPage } from "../../../tab-page/tab-page";

describe("gx-tab", () => {
  it("should build", () => {
    expect(new Tab()).toBeTruthy();
  });

  describe("rendering", () => {
    let element: HTMLElement;
    let testWindow: TestWindow;
    beforeEach(async () => {
      testWindow = new TestWindow();
      element = await testWindow.load({
        components: [Tab, TabPage, TabCaption],
        html: `<gx-tab>
                    <gx-tab-caption slot="caption">Tab Page 1</gx-tab-caption>
                    <gx-tab-page slot="page">
                        First tab page
                    </gx-tab-page>
                    <gx-tab-caption slot="caption" selected="true">Tab Page 2</gx-tab-caption>
                    <gx-tab-page slot="page">
                        Second tab page
                    </gx-tab-page>
                </gx-tab>`
      });
    });

    it("should work without parameters", () => {
      const captionsText = Array.from(
        element.querySelectorAll("gx-tab-caption")
      )
        .map((el: HTMLElement) => el.textContent.trim())
        .join("-");

      const pagesText = Array.from(element.querySelectorAll("gx-tab-page"))
        .map((el: HTMLElement) => el.textContent.trim())
        .join("-");

      expect(captionsText).toEqual("Tab Page 1-Tab Page 2");
      expect(pagesText).toEqual("First tab page-Second tab page");
    });

    it("should show the selected tab caption as active", () => {
      const selectedTabCaption: HTMLElement = element.querySelector(
        "gx-tab-caption[selected='true']"
      );

      expect(
        selectedTabCaption.querySelector("a").classList.contains("active")
      ).toBe(true);
    });

    it("should show the selected tab page as visible", () => {
      const selectedTabCaption: HTMLElement = element.querySelector(
        "gx-tab-caption[selected='true']"
      );
      const selectedTabPage: HTMLElement = element.querySelector(
        `#${selectedTabCaption.getAttribute("aria-controls")}`
      );

      expect(selectedTabPage.classList.contains("active")).toBe(true);
    });

    it("should render aria-selected=true for selected tab caption", () => {
      const selectedTabCaption: HTMLElement = element.querySelector(
        "gx-tab-caption[selected='true']"
      );

      expect(selectedTabCaption.getAttribute("aria-selected")).toEqual("true");
    });

    it("should render aria-selected=false for unselected tab caption", () => {
      const selectedTabCaption: HTMLElement = element.querySelector(
        "gx-tab-caption:not([selected='true'])"
      );

      expect(selectedTabCaption.getAttribute("aria-selected")).toEqual("false");
    });

    it("should render role=tablist container div", () => {
      expect(element.firstElementChild.matches("[role='tablist']")).toBe(true);
    });

    it("should render role=tab for all caption elements", () => {
      expect(
        element.querySelector("gx-tab-caption:not([role='tab'])")
      ).toBeFalsy();
    });

    it("should render role=tabpanel for all page elements", () => {
      expect(
        element.querySelector("gx-tab-page:not([role='tabpanel'])")
      ).toBeFalsy();
    });

    it("should have ids for all caption and page elements", () => {
      const withoutIdentifier: HTMLElement = element.querySelector(
        "gx-tab-caption:not([id]),gx-tab-page:not([id])"
      );

      expect(withoutIdentifier).toBeFalsy();
    });

    it("should have every caption linked with its corresponding page via aria-controls and aria-labelledby", () => {
      const tabCaptionElements = element.querySelectorAll("gx-tab-caption");
      const tabPageElements = element.querySelectorAll("gx-tab-page");

      Array.from(tabCaptionElements).forEach((captionEl, i) => {
        const pageEl = tabPageElements[i];
        expect(pageEl.id).toEqual(captionEl.getAttribute("aria-controls"));
        expect(captionEl.id).toEqual(pageEl.getAttribute("aria-labelledby"));
      });
    });
  });
});
