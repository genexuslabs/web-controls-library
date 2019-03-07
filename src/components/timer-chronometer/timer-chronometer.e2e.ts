import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";

describe("gx-chronometer", () => {
  let element: E2EElement;
  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(
      "<gx-chronometer initial-milliseconds='2000' tick-interval='5000' max-value-text='Final' max-value='1'></gx-chronometer>"
    );
    element = await page.find("gx-chronometer");
    await element.callMethod("start");
    await page.waitForChanges();
  });

  it("Max Value Text not working", () => {
    expect(element.textContent.trim()).toEqual("Final");
  });
});
