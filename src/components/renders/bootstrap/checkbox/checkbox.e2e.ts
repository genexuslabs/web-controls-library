import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";

describe("gx-checkbox", () => {
  let page: E2EPage;
  let element: E2EElement;

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(`<gx-checkbox checked='true'></gx-checkbox>`);
    element = await page.find("gx-checkbox");
  });

  it("renders", async () => {
    expect(element).toHaveClass("hydrated");
  });

  it("should be able to read value", async () => {
    expect(await element.getProperty("checked")).toEqual(true);
  });

  it("should be able to set value", async () => {
    element.setProperty("checked", false);
    await page.waitForChanges();
    expect(await element.getProperty("checked")).toEqual(false);
  });

  it("should keep input and custom element values in sync", async () => {
    const input = await page.find("input");
    expect(await input.getProperty("checked")).toEqual(true);
    await element.setProperty("checked", false);
    await page.waitForChanges();
    expect(await input.getProperty("checked")).toEqual(false);
  });
});
