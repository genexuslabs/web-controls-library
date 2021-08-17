import { newE2EPage } from "@stencil/core/testing";

describe("gx-edit", () => {
  let element;
  let page;
  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent("<gx-edit></gx-edit>");
    element = await page.find("gx-edit");
  });

  it("should be able to read value", async () => {
    element.value = "foo";
    await page.waitForChanges();
    expect(element.value).toEqual("foo");
  });

  it("should be able to change value", async () => {
    element.value = "foo";
    await page.waitForChanges();
    element.value = "bar";
    await page.waitForChanges();
    expect(element.value).toEqual("bar");
  });

  it("should render as read only", async () => {
    await element.setProperty("readonly", true);
    await page.waitForChanges();
    const readonlyElement = await element.find("[data-readonly]");
    expect(readonlyElement).toBeTruthy();
  });

  it("should render as read only using a h1 element - fontCategory property", async () => {
    await element.setProperty("readonly", true);
    await element.setProperty("fontCategory", "headline");
    await page.waitForChanges();
    const readonlyElement = await element.find(
      "[data-readonly] .readonly-content"
    );
    expect(readonlyElement.tagName).toBe("H1");
  });

  it("should render as read only using a h1 element - --font-category CSS property", async () => {
    await element.setProperty("readonly", true);
    await element.setProperty("style", "--font-category: headline");
    await page.waitForChanges();
    const readonlyElement = await element.find(
      "[data-readonly] .readonly-content"
    );
    expect(readonlyElement.tagName).toBe("H1");
  });

  it("should render as read only using a p element - --font-category CSS property", async () => {
    await element.setProperty("readonly", true);
    await element.setProperty("style", "--font-category: body");
    await page.waitForChanges();
    const readonlyElement = await element.find(
      "[data-readonly] .readonly-content"
    );
    expect(readonlyElement.tagName).toBe("P");
  });
});
