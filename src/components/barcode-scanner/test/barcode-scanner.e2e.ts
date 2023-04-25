import { E2EPage, newE2EPage } from "@stencil/core/testing";

describe("gx-barcode-scanner", () => {
  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage();
  });

  it("renders", async () => {
    page = await newE2EPage();
    await page.setContent("<gx-barcode-scanner></gx-barcode-scanner>");

    const element = await page.find("gx-barcode-scanner");
    expect(element).toHaveClass("hydrated");
  });
  it("scanner should be invisible if display mode is set to As prompt", async () => {
    page = await newE2EPage();
    await page.setContent(`<gx-barcode-scanner
    operation-mode="Continuous read"
    display-mode="As Prompt"
    beep-on-each-read
  >
    <div id="gx-barcode-scanner-reader" slot="readerContainer"></div>
  </gx-barcode-scanner>`);

    const element = await page.find("gx-barcode-scanner");
    const elementHeight = (await element.getComputedStyle()).height;
    expect(elementHeight).toEqual("0px");
  });
  it("audio should be set when beepOnEachRead property is true and beepSrc is set", async () => {
    page = await newE2EPage();
    await page.setContent(`<gx-barcode-scanner
    operation-mode="Continuous read"
    beep-on-each-read
    beep-src="./assets/beep.wav"
  >
    <div id="gx-barcode-scanner-reader" slot="readerContainer"></div>
  </gx-barcode-scanner>`);
    const audio = await page.find("gx-barcode-scanner >>> audio");
    expect(audio).not.toBeNull();
  });
  it("audio should not be set when beepOnEachRead property is false or beepSrc is not set", async () => {
    page = await newE2EPage();
    await page.setContent(`<gx-barcode-scanner
    operation-mode="Continuous read"
  >
    <div id="gx-barcode-scanner-reader" slot="readerContainer"></div>
  </gx-barcode-scanner>`);
    const audio = await page.find("gx-barcode-scanner >>> audio");

    expect(audio).toBeNull();
  });
  it("Show scanner when display mode is As prompt and started property is set to true", async () => {
    page = await newE2EPage();
    await page.setContent(`<gx-barcode-scanner
    operation-mode="Continuous read"
    beep-on-each-read
    beep-src="./assets/beep.wav"
    display-mode="As Prompt"
  >
    <div id="gx-barcode-scanner-reader" slot="readerContainer"></div>
  </gx-barcode-scanner>`);
    await page.waitForChanges();
    const context = page.browserContext();
    context.clearPermissionOverrides();
    await context.overridePermissions(page.url(), ["camera"]);
    await page.waitForChanges();
    const element = await page.find("gx-barcode-scanner");
    let scannerReader = await element.find("#gx-barcode-scanner-reader video");
    expect(scannerReader).toBeNull();
    element.setAttribute("started", true);
    await page.waitForChanges();
    scannerReader = await element.find("#gx-barcode-scanner-reader");
    expect(scannerReader).not.toBeNull();
  });
});
