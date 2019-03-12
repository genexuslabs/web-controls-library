import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";

describe("gx-chronometer", () => {
  let element: E2EElement;
  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(
      "<gx-chronometer unit='1' value='3000' interval='1500' max-value-text='Final' max-value='9000'></gx-chronometer>"
    );
    element = await page.find("gx-chronometer");
  });

  const delay = value =>
    new Promise(resolve => setTimeout(() => resolve(), value));

  it("Chronometer not started", async () => {
    expect(element.textContent.trim()).toEqual("3");
    await element.callMethod("start");
    await delay(1100);
    await page.waitForChanges();
    expect(element.textContent.trim()).toEqual("4");
  });

  it("Chronometer stop method error", async () => {
    expect(element.textContent.trim()).toEqual("3");
    await element.callMethod("start");
    await delay(1100);
    await page.waitForChanges();
    expect(element.textContent.trim()).toEqual("4");
    await element.callMethod("stop");
    await delay(1100);
    await page.waitForChanges();
    expect(element.textContent.trim()).toEqual("4");
  });

  it("Chronometer reset method error", async () => {
    expect(element.textContent.trim()).toEqual("3");
    await element.callMethod("start");
    await delay(1100);
    await page.waitForChanges();
    expect(element.textContent.trim()).toEqual("4");
    await element.callMethod("reset");
    await page.waitForChanges();
    expect(element.textContent.trim()).toEqual("0");
  });
});
