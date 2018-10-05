import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";

describe("gx-progress-bar", () => {
  let element: E2EElement;
  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent("<gx-progress-bar>Hello world!</gx-progress-bar");
    element = await page.find("gx-progress-bar");
  });

  it("should work without parameters", () => {
    expect(element.textContent.trim()).toEqual("Hello world!");
  });

  it("should set aria attributes", async () => {
    await element.setProperty("value", 30);
    await page.waitForChanges();
    const progressEl = await page.find(".progress-bar");
    expect(await progressEl.getAttribute("aria-valuenow")).toEqual("30");
  });
});
