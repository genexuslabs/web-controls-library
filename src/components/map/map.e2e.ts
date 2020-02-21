import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";

describe("gx-map", () => {
  let element: E2EElement;
  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage();
  });

  it("should work without attributes", async () => {
    await page.setContent("<gx-map></gx-map>");
    await page.waitForChanges();
    element = await page.find("gx-map");
    const innerContent = await element.find("div .leaflet-control-container");
    expect(innerContent).not.toBeNull();
    expect(await element.getProperty("center")).toEqual("0, 0");
    expect(await element.getProperty("maxZoom")).toEqual(20);
    expect(await element.getProperty("zoom")).toEqual(1);
  });

  it("should set a given center", async () => {
    await page.setContent(
      "<gx-map center='38.87097161910191, -77.0559650659561'></gx-map>"
    );
    await page.waitForChanges();
    element = await page.find("gx-map");
    await page.waitForChanges();
    expect(await element.getProperty("center")).toEqual(
      "38.87097161910191, -77.0559650659561"
    );
  });

  it("should set a default maxZoom if given maxZoom exceed optimal range", async () => {
    await page.setContent("<gx-map max-zoom='24'></gx-map>");
    await page.waitForChanges();
    element = await page.find("gx-map");
    await page.waitForChanges();
    expect(await element.getProperty("maxZoom")).toEqual(20);
  });

  it("should set a default zoom if given zoom exceed optimal range", async () => {
    await page.setContent("<gx-map zoom='35'></gx-map>");
    await page.waitForChanges();
    element = await page.find("gx-map");
    await page.waitForChanges();
    expect(await element.getProperty("zoom")).toEqual(19);
  });

  it("should set the default mapType if mapType is no defined by user", async () => {
    await page.setContent("<gx-map></gx-map>");
    await page.waitForChanges();
    element = await page.find("gx-map");
    expect(await element.getProperty("mapType")).toEqual("standard");
  });

  it("should set the mapType defined by user", async () => {
    await page.setContent("<gx-map map-type='satellite'></gx-map>");
    await page.waitForChanges();
    element = await page.find("gx-map");
    expect(await element.getProperty("mapType")).toEqual("satellite");
  });

  it("should set the given mapProvider", async () => {
    await page.setContent(
      "<gx-map map-provider='http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'></gx-map>"
    );
    await page.waitForChanges();
    element = await page.find("gx-map");
    expect(await element.getProperty("mapProvider")).toEqual(
      "http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
    );
  });

  it("should properly intereact with gx-map-marker components", async () => {
    let childCounts: E2EElement[];

    await page.setContent(
      `<gx-map map-provider='http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'>
            <gx-map-marker marker-class='myCustomClass' coords='-34.87945241095968, -56.078210142066956' tooltip-caption='Some title here'></gx-map-marker>
            <gx-map-marker marker-class='myCustomClass' coords='-34.87945241095968, -56.078210142066956' tooltip-caption='Some title here'></gx-map-marker>
            <gx-map-marker marker-class='myCustomClass' coords='-34.87945241095968, -56.078210142066956' tooltip-caption='Some title here'></gx-map-marker>
        </gx-map>
        `
    );

    await page.waitForChanges();
    element = await page.find("gx-map");
    childCounts = await page.findAll("gx-map .myCustomClass");
    expect(childCounts.length).toEqual(3);

    element.innerHTML = "";
    await page.waitForChanges();
    childCounts = await page.findAll("gx-map .myCustomClass");
    expect(childCounts.length).toEqual(0);
  });
});
