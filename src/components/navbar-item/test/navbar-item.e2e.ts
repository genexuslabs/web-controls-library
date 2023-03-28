import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";

describe("gx-navbar-item", () => {
  let element: E2EElement;
  let page: E2EPage;
  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(
      `<gx-navbar-item href="http://www.google.com">Item with link</gx-navbar-item>`
    );
    element = await page.find("gx-navbar-item");
  });

  it("renders", () => {
    expect(element).toHaveClass("hydrated");
  });

  it("should support setting as active", async () => {
    await element.setProperty("active", true);
    await page.waitForChanges();
    expect(await page.find("gx-navbar-item >>> a.item-active")).toBeDefined();
  });

  it("should render an icon", async () => {
    await element.setAttribute(
      "icon-src",
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
    );
    await page.waitForChanges();
    expect(
      await page.find("gx-navbar-item >>> a.item-with-icon")
    ).toBeDefined();
    expect(await page.find("gx-navbar-item >>> img")).toBeDefined();
  });

  it("should render as a button", async () => {
    await element.setAttribute("href", "");
    await page.waitForChanges();
    expect(await page.find("gx-navbar-item >>> button.item")).toBeDefined();
  });
});
