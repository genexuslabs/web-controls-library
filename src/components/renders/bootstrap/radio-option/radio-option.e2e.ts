import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";

describe("gx-radio-option", () => {
  let element: E2EElement;
  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(
      "<gx-radio-option caption='Label' value='foo'></gx-radio-option>"
    );
    element = await page.find("gx-radio-option");
  });

  it("should work without parameters", () => {
    expect(element.textContent.trim()).toEqual("Label");
  });

  it("should be able to read value", async () => {
    expect(await element.getProperty("value")).toEqual("foo");
  });

  it("should be able to change value", async () => {
    await element.setProperty("value", "bar");
    await page.waitForChanges();
    expect(await element.getProperty("value")).toEqual("bar");
  });

  it("should keep input and custom element values in sync", async () => {
    await element.setProperty("value", "bar");
    await page.waitForChanges();
    const input = await page.find("input");
    expect(await input.getProperty("value")).toEqual("bar");
  });

  it("should be able to set class of inner input", async () => {
    element.setProperty("cssClass", "foo-class bar-class");
    await page.waitForChanges();
    expect(await page.find("input")).toHaveClass("foo-class");
  });
});
