import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";

describe("gx-navbar", () => {
  let element: E2EElement;
  let page: E2EPage;
  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(`<gx-navbar caption="Foo"></gx-navbar>`);
    element = await page.find("gx-navbar");
  });

  it("should work without parameters", () => {
    expect(element.textContent.trim()).toEqual("Foo");
  });

  it("should be able to change the caption", async () => {
    await element.setProperty("caption", "Bar");
    await page.waitForChanges();
    expect(element.textContent.trim()).toEqual("Bar");
  });

  it("should support setting toggle-button-label attribute", async () => {
    await element.setProperty("toggleButtonLabel", "Foo");
    await page.waitForChanges();
    expect(
      (await page.find("button.navbar-toggler")).getAttribute("aria-label")
    ).toEqual("Foo");
  });

  it("should be able to set class of inner a", async () => {
    await element.setProperty("cssClass", "foo-class bar-class");
    await page.waitForChanges();
    expect(await page.find("nav")).toHaveClass("foo-class");
  });
});
