import { newE2EPage, E2EElement, E2EPage } from "@stencil/core/testing";

describe("gx-icon", () => {
  let page: E2EPage;
  let icon: E2EElement;

  beforeEach(async () => {
    page = await newE2EPage();

    await page.setContent(`<gx-icon type="burger"></gx-icon>`);
    icon = await page.find("gx-icon");
  });

  it("renders", async () => {
    expect(icon).toHaveClass("hydrated");
  });
});
