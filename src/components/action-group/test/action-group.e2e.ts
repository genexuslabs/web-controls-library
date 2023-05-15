import { newE2EPage } from "@stencil/core/testing";

describe("gx-action-group", () => {
  it("renders", async () => {
    const page = await newE2EPage();
    await page.setContent("<gx-action-group></gx-action-group>");

    const element = await page.find("gx-action-group");
    expect(element).toHaveClass("hydrated");
  });
});
