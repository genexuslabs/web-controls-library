import { newE2EPage, E2EPage, E2EElement } from "@stencil/core/testing";

const testImage1 =
  "data:image/x-icon;base64,AAABAAEAICAQAAEABADoAgAAFgAAACgAAAAgAAAAQAAAAAEABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYGyAAISAgAA4gMQAFKUkAATVlAABFhQAAUJgAAFamAABhuQAFZ8MACGzIAA1xzAATd9QAHYHbAAAAAAAAAAAAERERERERERERERERERERERERERERERERERERERERERERERFDERERERERERA0EREREREQWDAREREREREEpBERERERESq1IRERERECbHIREREREREFy2MREREQOLtRERERERERFKu4QhERJKu5QRERERERERKKqrUhE2yqpyEREREREREQXKqsgzi6qrURERERERERETuqqrqqqqmUEREREREREREouqqqqqqrchERERERERERBcqqqqqqrFERERERERERERO6qqqqqqkxERERERERERAmqqqqqqqqUhEREREREREEnKqqqqqqqshCERERERECbMqqqqqqqqqstSEREREQSdqqqqqqqqqqqr2EAREQJsyqqqqqqqqqqqqqzFIRJd3d3d3duqqqq93d3d3cUjdlVVVVVYuqqshVVVVVVnMRARERERBdqqvVARERERARERERERERO7u8kxEREREREREREREREQjbvXIREREREREREREREREF271RERERERERERERERERE8zKMRERERERERERERERERCN1yEREREREREREREREREQXdURERERERERERERERERET2zEREREREREREREREREREKghERERERERERERERERERFnERERERERERERERERERERMxEREREREREREREREREREREREREREREREAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==";

describe("gx-tab-page", () => {
  let page: E2EPage;
  let tabCaptionElement: E2EElement;

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(`
<gx-tab>
  <gx-tab-caption slot="caption" selected>
    <img slot="main-image" src="${testImage1}" />
    <img slot="disabled-image" src="${testImage1}" />
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

  it("limits the size of the main and disabled images to 1em", async () => {
    const tabCaptionStyle = await tabCaptionElement.getComputedStyle();
    const fontSize = tabCaptionStyle.getPropertyValue("font-size");

    const mainImageSize = await getImageSize(
      "gx-tab-caption img[slot='main-image']"
    );
    expect(mainImageSize.height).toBe(fontSize);
    expect(mainImageSize.width).toBe(fontSize);

    tabCaptionElement.setAttribute("selected", false);
    await page.waitForChanges();

    const disabledImageSize = await getImageSize(
      "gx-tab-caption img[slot='disabled-image']"
    );
    expect(disabledImageSize.height).toBe(fontSize);
    expect(disabledImageSize.width).toBe(fontSize);
  });

  async function getImageSize(
    selector: string
  ): Promise<{ height: string; width: string }> {
    const element = await page.find(selector);
    const style = await element.getComputedStyle();
    return {
      height: style.getPropertyValue("height"),
      width: style.getPropertyValue("width")
    };
  }
});
