import { newE2EPage } from "@stencil/core/testing";

describe("gx-header-row-pattern-market", () => {
  it("renders", async () => {
    const page = await newE2EPage();
    await page.setContent(
      "<gx-header-row-pattern-market></gx-header-row-pattern-market>"
    );

    const element = await page.find("gx-header-row-pattern-market");
    expect(element).toHaveClass("hydrated");
  });
});
