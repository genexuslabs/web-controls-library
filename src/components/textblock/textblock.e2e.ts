import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";

describe("gx-textblock", () => {
  let element: E2EElement;
  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent("<gx-textblock>Hello world!</gx-textblock>");
    element = await page.find("gx-textblock");
  });

  it("should work without parameters", () => {
    expect(element.textContent.trim()).toEqual("Hello world!");
  });
});
