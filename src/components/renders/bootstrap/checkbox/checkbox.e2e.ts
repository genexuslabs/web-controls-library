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

  it("fires input event", async () => {
    const uncheckedValue = "no";
    const checkedValue = "yes";
    await element.setProperty("checkedValue", checkedValue);
    await element.setProperty("unCheckedValue", uncheckedValue);
    await page.waitForChanges();
    const spy = await element.spyOnEvent("input");
    const input = await page.find("input");

    await input.click();
    expect(spy).toHaveReceivedEvent();
    expect(await element.getProperty("value")).toBe(uncheckedValue);

    await input.click();
    expect(spy).toHaveReceivedEvent();
    expect(await element.getProperty("value")).toBe(checkedValue);
  });
});
