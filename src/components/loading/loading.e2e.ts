import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";

describe("gx-loading", () => {
  let element: E2EElement;
  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(
      `<gx-loading caption="Loading" presented></gx-loading>`
    );
    element = await page.find("gx-loading");
  });

  it("should work without parameters", () => {
    expect(element.textContent.trim()).toEqual("Loading");
  });
});
