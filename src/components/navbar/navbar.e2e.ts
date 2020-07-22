import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";

describe("gx-navbar", () => {
  let element: E2EElement;
  let page: E2EPage;
  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(`<gx-navbar caption="Foo"></gx-navbar>`);
    element = await page.find("gx-navbar");
  });

  it("should render", () => {
    expect(element).toHaveClass("hydrated");
  });
});
