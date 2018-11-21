import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";

describe("gx-map", () => {
  let element: E2EElement;
  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent("<gx-map></gx-map>");
    element = await page.find("gx-map");
  });

  it("should work without attributes", async () => {
    const innerContent = await element.find("div .leaflet-control-container");
    expect(!!innerContent).toBeTruthy();
    expect(await element.getProperty("center")).toEqual("0, 0");
    expect(await element.getProperty("maxZoom")).toEqual(20);
    expect(await element.getProperty("zoom")).toEqual(1);
  });

  it("should set a given center", async () => {
    await element.setProperty("center", "38.87097161910191, -77.0559650659561");
    await page.waitForChanges();
    expect(await element.getProperty("center")).toEqual(
      "38.87097161910191, -77.0559650659561"
    );
  });

  it("should set a given maxZoom", async () => {
    await element.setProperty("maxZoom", 21);
    await page.waitForChanges();
    expect(await element.getProperty("maxZoom")).toEqual(21);
  });

  it("should set a given zoom", async () => {
    await element.setProperty("zoom", 16);
    await page.waitForChanges();
    expect(await element.getProperty("zoom")).toEqual(16);
  });
});
