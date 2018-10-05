import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";

describe("gx-table-cell", () => {
  let element: E2EElement;
  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent("<gx-table-cell>Cell</gx-table-cell>");
    element = await page.find("gx-table-cell");
  });

  it("should work without parameters", () => {
    expect(element.textContent.trim()).toEqual("Cell");
  });
});
