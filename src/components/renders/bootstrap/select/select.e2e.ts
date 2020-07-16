import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";

describe("gx-select", () => {
  let element: E2EElement;
  let page: E2EPage;
  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(
      `<gx-select value="2">
          <gx-select-option value="1">One</gx-select-option>
          <gx-select-option value="2">Two</gx-select-option>
          <gx-select-option value="3">Three</gx-select-option>
          <gx-select-option value="4">Four</gx-select-option>
          <gx-select-option value="5" disabled>Five</gx-select-option>
        </gx-select>`
    );
    element = await page.find("gx-select");
  });

  it("should be able to read value", async () => {
    expect(await element.getProperty("value")).toEqual("2");
  });

  it("should be able to change value", async () => {
    await element.setProperty("value", "3");
    await page.waitForChanges();
    expect(await element.getProperty("value")).toEqual("3");
  });

  it("should keep input and custom element values in sync", async () => {
    await element.setProperty("value", "3");
    await page.waitForChanges();
    const innerSelect = await page.find("select");
    expect(await innerSelect.getProperty("value")).toEqual("3");
  });

  it("should be able to set class of inner input", async () => {
    await element.setProperty("cssClass", "foo-class bar-class");
    await page.waitForChanges();
    expect(await page.find("select")).toHaveClass("foo-class");
  });

  it("should set the input with suggest list if suggest attr is enabled", async () => {
    const input = await element.find("input[list='gx-select-auto-id-0']");
    const dataList = await element.find("datalist#gx-select-auto-id-0");
    expect(input).toBeTruthy();
    expect(dataList).toBeTruthy();
  });
});
