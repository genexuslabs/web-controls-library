import { newE2EPage, E2EPage, E2EElement } from "@stencil/core/testing";

describe("gx-tab-page", () => {
  let page: E2EPage;
  let tabCaptionElement: E2EElement;

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(`
<gx-tab>
  <gx-tab-caption slot="caption" selected>
    <img slot="main-image" />
    <img slot="disabled-image"/>
    First tab
  </gx-tab-caption>

  <gx-tab-page slot="page">
    First tab content
  </gx-tab-page>
</gx-tab>
    `);
    tabCaptionElement = await page.find("gx-tab-caption");
  });

  it("renders", async () => {
    expect(tabCaptionElement).toHaveClass("hydrated");
  });

  it("shows the main image / hides disabled image", async () => {
    expect(await isVisible("gx-tab-caption img[slot='main-image']")).toBe(true);
    expect(await isVisible("gx-tab-caption img[slot='disabled-image']")).toBe(
      false
    );
  });

  it("shows the disabled image / hides main image", async () => {
    tabCaptionElement.setAttribute("selected", false);
    await page.waitForChanges();

    expect(await isVisible("gx-tab-caption img[slot='main-image']")).toBe(
      false
    );
    expect(await isVisible("gx-tab-caption img[slot='disabled-image']")).toBe(
      true
    );
  });

  async function isVisible(selector: string): Promise<boolean> {
    return await page.$eval(selector, (elem: Element) => {
      return (
        window.getComputedStyle(elem).getPropertyValue("display") !== "none"
      );
    });
  }
});
