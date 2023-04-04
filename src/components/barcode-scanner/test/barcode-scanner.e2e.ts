import { newE2EPage } from "@stencil/core/testing";

describe("gx-barcode-scanner", () => {
  it("renders", async () => {
    const page = await newE2EPage();
    await page.setContent("<gx-barcode-scanner></gx-barcode-scanner>");

    const element = await page.find("gx-barcode-scanner");
    expect(element).toHaveClass("hydrated");
  });
});
