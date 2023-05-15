import { newE2EPage } from "@stencil/core/testing";

describe("gx-action-group-menu", () => {
  it("renders", async () => {
    const page = await newE2EPage();
    await page.setContent("<gx-action-group-menu></gx-action-group-menu>");

    const element = await page.find("gx-action-group-menu");
    expect(element).toHaveClass("hydrated");
  });
});
