import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";

describe("gx-canvas", () => {
  let element: E2EElement;
  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(
      `<gx-canvas><gx-canvas-cell>Content</gx-canvas-cell></gx-canvas>`
    );
    element = await page.find("gx-canvas");
  });

  it("should work without parameters", () => {
    expect(element.textContent.trim()).toEqual("Content");
  });
});
