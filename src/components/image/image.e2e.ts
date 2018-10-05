import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";

describe("gx-image", () => {
  let element: E2EElement;
  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(
      "<gx-image src='img.png' alt='Alternate text'></gx-image>"
    );
    element = await page.find("gx-image");
  });

  it("inner img should have alternate text", async () => {
    const img = await page.find("img");
    expect(await img.getProperty("alt")).toEqual(
      await element.getProperty("alt")
    );
  });
});
