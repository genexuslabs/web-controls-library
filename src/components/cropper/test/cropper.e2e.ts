import { newE2EPage, E2EPage, E2EElement } from "@stencil/core/testing";

describe("gx-cropper", () => {
  let element: E2EElement;
  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage();
  });

  it("renders", async () => {
    page = await newE2EPage();
    await page.setContent("<gx-cropper></gx-cropper>");

    element = await page.find("gx-cropper");
    expect(element).toHaveClass("hydrated");
  });
  it("component have display none style when show-behavior is popup", async () => {
    page = await newE2EPage();
    await page.setContent(`<gx-cropper show-behavior="popup"></gx-cropper>`);
    element = await page.find("gx-cropper");
    expect((await element.getComputedStyle()).display).toBe("none");
  });
  it("component have display none style when show-behavior is popup", async () => {
    page = await newE2EPage();
    await page.setContent(`<gx-cropper></gx-cropper>`);
    element = await page.find("gx-cropper");
    expect((await element.getComputedStyle()).display).toBe("block");
  });
  it("render footer by default", async () => {
    page = await newE2EPage();
    await page.setContent("<gx-cropper></gx-cropper>");
    element = await page.find("gx-cropper");
    const footer = await page.find("gx-cropper >>> .footer");
    expect(footer).toBeDefined();
  });
  it("not render footer when showFooter property is set to false", async () => {
    page = await newE2EPage();
    await page.setContent('<gx-cropper show-footer="false"></gx-cropper>');
    element = await page.find("gx-cropper");
    const footer = await page.find("gx-cropper >>> .footer");
    expect(footer).toBeNull();
  });
  it("render header by default", async () => {
    page = await newE2EPage();
    await page.setContent("<gx-cropper></gx-cropper>");
    element = await page.find("gx-cropper");
    const footer = await page.find("gx-cropper >>> .header");
    expect(footer).toBeDefined();
  });
  it("not render header when showHeader property is set to false", async () => {
    page = await newE2EPage();
    await page.setContent('<gx-cropper show-header="false"></gx-cropper>');
    element = await page.find("gx-cropper");
    const footer = await page.find("gx-cropper >>> .header");
    expect(footer).toBeNull();
  });
  it("dialog takes the width and height set in popupWidth and popUpHeight properties", async () => {
    const width = "300px";
    const height = "300px";
    page = await newE2EPage();
    await page.setContent(` <gx-cropper src="./assets/tree-middle.jpg" show-behavior="popup" popup-height=${height} popup-width=${width}>
  </gx-cropper>`);
    element = await page.find("gx-cropper");
    const cropperContainer = await page.find(
      "gx-cropper >>> .cropper-container"
    );
    expect((await cropperContainer.getComputedStyle()).height).toBe(height);
    expect((await cropperContainer.getComputedStyle()).width).toBe(width);
  });

  it("trigger gxCropperImageChanged envent when image change", async () => {
    page = await newE2EPage();

    await page.setContent(
      `<gx-cropper src="./assets/1.jpg" width="200" height="200" show-behavior="inline"></gx-cropper>`
    );

    element = await page.find("gx-cropper");
    const imageChanged = await element.spyOnEvent("gxCropperImageExported");
    element.setAttribute("src", "./assets/2.jpg");
    await page.waitForChanges();
    expect(imageChanged).toHaveReceivedEvent();
  });
  it("change showInside property when gx-cropper-selection is moving", async () => {
    page = await newE2EPage();
    await page.setContent(`<gx-cropper src="./assets/tree-middle.jpg" width="200" height="200" show-behavior="popup" >
  </gx-cropper>`);
    element = await page.find("gx-cropper");
    element.setAttribute("opened", true);
    await page.waitForChanges();
    const corner = await page.find(
      "gx-cropper >>> gx-cropper-selection >>>.corner"
    );
    expect(await element.getProperty("showInside")).toBeFalsy();
    corner.triggerEvent("mousedown");
    corner.triggerEvent("mousemove");
    await page.waitForChanges();
    expect(await corner.getProperty("showInside")).toBe(true);
  });
});
