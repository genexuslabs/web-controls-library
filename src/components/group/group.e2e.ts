import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";

describe("gx-group", () => {
  let element: E2EElement;
  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent("<gx-group>TEST TEXT</gx-group>");
    element = await page.find("gx-group");
  });

  it("should work without parameters", () => {
    expect(element.textContent.trim()).toEqual("TEST TEXT");
  });

  it("should set legend caption", async () => {
    await element.setProperty("caption", "TEST TEXT");
    await page.waitForChanges();
    const content = await element.find("legend .content");
    expect(content.textContent.trim()).toEqual("TEST TEXT");
  });
});
