import { newE2EPage } from "@stencil/core/testing";

describe("gx-action-group-item", () => {
  it("renders", async () => {
    const page = await newE2EPage();
    await page.setContent("<gx-action-group-item></gx-action-group-item>");

    const element = await page.find("gx-action-group-item");
    expect(element).toHaveClass("hydrated");
  });
});
