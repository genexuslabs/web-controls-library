import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";

describe("gx-navbar-link", () => {
  let element: E2EElement;
  let page: E2EPage;
  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(
      `<gx-navbar-link href="http://www.google.com">Item with link</gx-navbar-link>`
    );
    element = await page.find("gx-navbar-link");
  });

  it("should work without parameters", () => {
    expect(element.textContent.trim()).toEqual("Item with link");
  });

  it("should have its href attribute set", async () => {
    expect(await element.getProperty("href")).toEqual("http://www.google.com");
  });

  it("should support setting as disabled", async () => {
    await element.setProperty("disabled", true);
    await page.waitForChanges();
    expect(await page.find("a")).toHaveClass("disabled");
  });

  it("should support setting as active", async () => {
    await element.setProperty("active", true);
    await page.waitForChanges();
    expect(await page.find("a")).toHaveClass("active");
  });

  it("should be able to set class of inner a", async () => {
    element.setProperty("cssClass", "foo-class bar-class");
    await page.waitForChanges();
    expect(await page.find("a")).toHaveClass("foo-class");
  });

  it("should render an icon", async () => {
    await element.setAttribute("icon-src", "image.png");
    await page.waitForChanges();
    expect(await element.getAttribute("data-has-icon")).toBeDefined();
  });
});
