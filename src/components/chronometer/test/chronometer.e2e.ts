import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";

describe("gx-chronometer", () => {
  let element: E2EElement;
  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(
      "<gx-chronometer unit='ms' value='3000' interval='1500' max-value-text='Final' max-value='9000'></gx-chronometer>"
    );
    element = await page.find("gx-chronometer");
  });

  const delay = (value: Promise<void>) =>
    new Promise(resolve => setTimeout(() => resolve(), value));

  it("Sets the chronometer state to started", async () => {
    expect(element.textContent.trim()).toEqual("3");
    await element.callMethod("start");
    await delay(1100);
    await page.waitForChanges();
    expect(element.textContent.trim()).toEqual("4");
  });

  it("Starts the chronometer by setting the Property state to started", async () => {
    expect(element.textContent.trim()).toEqual("3");
    element.setProperty("state", "running");
    await page.waitForChanges();
    await delay(1100);
    await page.waitForChanges();
    expect(element.textContent.trim()).toEqual("4");
  });

  it("Stops a running Chronometer by setting the Property state to stopped", async () => {
    expect(element.textContent.trim()).toEqual("3");
    element.setProperty("state", "running");
    await page.waitForChanges();
    await delay(1100);
    await page.waitForChanges();
    expect(element.textContent.trim()).toEqual("4");
    element.setProperty("state", "stopped");
    await page.waitForChanges();
    await delay(1100);
    await page.waitForChanges();
    expect(element.textContent.trim()).toEqual("4");
  });

  it("Stops a running Chronometer", async () => {
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

  it("Reset a running Chronometer", async () => {
    expect(element.textContent.trim()).toEqual("3");
    await element.callMethod("start");
    await delay(1100);
    await page.waitForChanges();
    expect(element.textContent.trim()).toEqual("4");
    await element.callMethod("reset");
    await page.waitForChanges();
    expect(element.textContent.trim()).toEqual("0");
  });

  it("Check max value text after max value time is reached", async () => {
    element.setProperty("maxValue", "1000");
    await element.callMethod("start");
    await page.waitForChanges();
    await delay(2000);
    await page.waitForChanges();
    expect(element.textContent.trim()).toEqual("Final");
  });
});
