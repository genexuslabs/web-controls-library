import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";

describe("gx-switch", () => {
  let element: E2EElement;
  let page: E2EPage;
  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent("<gx-switch id='id0'>TEST TEXT</gx-switch>");
    element = await page.find("gx-switch");
  });

  it("should work without parameters", () => {
    expect(element.textContent.trim()).toEqual("TEST TEXT");
  });

  it("should set label caption", async () => {
    await element.setProperty("caption", "TEST TEXT0");
    await page.waitForChanges();
    const label = await page.find("label");
    expect(label.textContent.trim()).toEqual("TEST TEXT0");
  });

  it("should detect if it's checked", async () => {
    await element.setProperty("checked", true);
    await page.waitForChanges();
    const input = await page.find("input");
    expect(await input.getProperty("checked")).toEqual(true);
  });

  it("should detect if it's disabled", async () => {
    await element.setProperty("disabled", true);
    await page.waitForChanges();
    const input = await page.find("input");
    expect(await input.getProperty("disabled")).toEqual(true);
  });

  it("should assign value to 'id' and 'for' attrs", async () => {
    expect(await element.getAttribute("id")).toEqual("id0");
    const input = await page.find("input");
    const label = await page.find("label");
    expect(await input.getProperty("id")).toEqual(
      await label.getProperty("htmlFor")
    );
  });
});
