import { newE2EPage } from "@stencil/core/testing";

describe("gx-cropper-image", () => {
  it("renders", async () => {
    const page = await newE2EPage();
    await page.setContent("<gx-cropper-image></gx-cropper-image>");

    const element = await page.find("gx-cropper-image");
    expect(element).toHaveClass("hydrated");
  });
  it("gx-cropper-image src takes the src passed through gx-cropper", async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<gx-cropper-image src="./assets/tree-middle.jpg"></gx-cropper-image>'
    );

    const element = await page.find("gx-cropper-image");
    const src = await element.getAttribute("src");
    console.log(src);

    expect(src).toBe("./assets/tree-middle.jpg");
  });
});
