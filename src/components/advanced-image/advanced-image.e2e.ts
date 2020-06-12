import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";
describe("gx-advanced-image", () => {
  let element: E2EElement;
  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent("<gx-advanced-image></gx-advanced-image>");
    element = await page.find("gx-advanced-image");
  });

  it("should properly render and locate the component", async () => {
    expect(element.textContent).toEqual("AdvancedImage");
  });
});
