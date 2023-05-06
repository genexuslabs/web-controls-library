import { newE2EPage } from "@stencil/core/testing";

describe("gx-header-row-pattern-marker", () => {
  it("renders", async () => {
    const page = await newE2EPage();
    await page.setContent(
      "<gx-header-row-pattern-marker></gx-header-row-pattern-marker>"
    );

    const element = await page.find("gx-header-row-pattern-marker");
    expect(element).toHaveClass("hydrated");
  });
});
