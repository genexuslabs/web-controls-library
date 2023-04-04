import { newE2EPage } from "@stencil/core/testing";

describe("gx-cropper-selection", () => {
  it("renders", async () => {
    const page = await newE2EPage();
    await page.setContent("<gx-cropper-selection></gx-cropper-selection>");
    const element = await page.find("gx-cropper-selection");
    expect(element).toHaveClass("hydrated");
  });
});
