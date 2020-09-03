import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";

describe("gx-tab", () => {
  let element: E2EElement;
  let page: E2EPage;
  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(
      `<gx-tab>
          <gx-tab-caption slot="caption">Tab Page 1</gx-tab-caption>
          <gx-tab-page slot="page">
              First tab page
          </gx-tab-page>
          <gx-tab-caption slot="caption" selected="true">Tab Page 2</gx-tab-caption>
          <gx-tab-page slot="page">
              Second tab page
          </gx-tab-page>
      </gx-tab>`
    );
    element = await page.find("gx-tab");
  });

  it("should work without parameters", async () => {
    const captionsText = Array.from(await element.findAll("gx-tab-caption"))
      .map(el => el.textContent.trim())
      .join("-");

    const pagesText = Array.from(await element.findAll("gx-tab-page"))
      .map(el => el.textContent.trim())
      .join("-");

    expect(captionsText).toEqual("Tab Page 1-Tab Page 2");
    expect(pagesText).toEqual("First tab page-Second tab page");
  });

  it("should show the selected tab caption as active", async () => {
    const selectedTabCaption = await element.find(
      "gx-tab-caption[selected='true']"
    );

    expect(selectedTabCaption).toHaveClass("gx-tab-caption--active");
  });

  it("should show the selected tab page as visible", async () => {
    const selectedTabCaption = await element.find(
      "gx-tab-caption[selected='true']"
    );
    const selectedTabPage = await element.find(
      `#${selectedTabCaption.getAttribute("aria-controls")}`
    );

    expect(selectedTabPage).toHaveClass("gx-tab-page--active");
  });

  it("should render aria-selected=true for selected tab caption", async () => {
    const selectedTabCaption = await element.find(
      "gx-tab-caption[selected='true']"
    );

    expect(await selectedTabCaption.getAttribute("aria-selected")).toEqual(
      "true"
    );
  });

  it("should render aria-selected=false for unselected tab caption", async () => {
    const selectedTabCaption = await element.find(
      "gx-tab-caption:not([selected='true'])"
    );

    expect(await selectedTabCaption.getAttribute("aria-selected")).toEqual(
      "false"
    );
  });

  it("should render role=tablist container div", async () => {
    const first = await element.find(":scope > div");
    expect(await first.getAttribute("role")).toEqual("tablist");
  });

  it("should render role=tab for all caption elements", async () => {
    expect(await element.find("gx-tab-caption:not([role='tab'])")).toBeFalsy();
  });

  it("should render role=tabpanel for all page elements", async () => {
    expect(
      await element.find("gx-tab-page:not([role='tabpanel'])")
    ).toBeFalsy();
  });

  it("should have ids for all caption and page elements", async () => {
    const withoutIdentifier = await element.find(
      "gx-tab-caption:not([id]),gx-tab-page:not([id])"
    );

    expect(withoutIdentifier).toBeFalsy();
  });

  it("should have every caption linked with its corresponding page via aria-controls and aria-labelledby", async () => {
    const tabCaptionElements = await element.findAll("gx-tab-caption");
    const tabPageElements = await element.findAll("gx-tab-page");

    for (let i = 0, len = tabCaptionElements.length; i < len; i++) {
      const captionEl = tabCaptionElements[i];
      const pageEl = tabPageElements[i];
      expect(await pageEl.getProperty("id")).toEqual(
        await captionEl.getAttribute("aria-controls")
      );
      expect(await captionEl.getProperty("id")).toEqual(
        await pageEl.getAttribute("aria-labelledby")
      );
    }
  });
});
