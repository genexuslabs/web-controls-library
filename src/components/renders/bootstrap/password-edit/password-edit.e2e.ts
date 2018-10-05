import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";

describe("gx-password-edit", () => {
  let element: E2EElement;
  let page: E2EPage;
  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent("<gx-password-edit value='foo'></gx-password-edit>");
    element = await page.find("gx-password-edit");
  });

  it("should be able to read value", async () => {
    expect(await element.getProperty("value")).toEqual("foo");
  });

  it("should be able to change value", async () => {
    await element.setProperty("value", "bar");
    await page.waitForChanges();
    expect(await element.getProperty("value")).toEqual("bar");
  });

  it("should keep inner and custom element values in sync", async () => {
    await element.setProperty("value", "bar");
    await page.waitForChanges();
    const edit = await page.find("gx-edit");
    expect(await edit.getProperty("value")).toEqual("bar");
  });
});
