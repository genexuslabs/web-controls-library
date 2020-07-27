import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";
describe("gx-interactive-image", () => {
  let element: E2EElement;
  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent("<gx-interactive-image></gx-interactive-image>");
    await page.waitForChanges();
    element = await page.find("gx-interactive-image");
  });

  it("should properly render and locate the component", async () => {
    expect(await element.find("img")).toBeTruthy;
  });

  it("should set the src", async () => {
    element.setAttribute(
      "src",
      "https://www.genexus.com/media/images/genexus-share-link-image.png"
    );
    await page.waitForChanges();

    const imgElement = await element.find("img");
    expect(imgElement.getAttribute("src")).toEqual(
      "https://www.genexus.com/media/images/genexus-share-link-image.png"
    );
  });
});
