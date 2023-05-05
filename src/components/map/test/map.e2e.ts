import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";
/* import { BrowserContext } from "puppeteer"; */

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
    expect(await element.getProperty("center")).toEqual("0,0");
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

  it("should set a default maxZoom(23) if given zoom exceed optimal range", async () => {
    await page.setContent("<gx-map zoom='30'></gx-map>");
    await page.waitForChanges();
    element = await page.find("gx-map");
    await page.waitForChanges();
    expect(await element.getProperty("zoom")).toEqual(23);
  });

  it("should set a default zoom if given zoom exceed optimal range", async () => {
    await page.setContent("<gx-map zoom='35'></gx-map>");
    await page.waitForChanges();
    element = await page.find("gx-map");
    await page.waitForChanges();
    expect(await element.getProperty("zoom")).toEqual(23);
  });

  it("should set the default mapType if mapType is not defined by user", async () => {
    await page.setContent("<gx-map></gx-map>");
    await page.waitForChanges();
    element = await page.find("gx-map");
    expect(await element.getProperty("mapType")).toEqual("standard");
  });

  it("should properly interact with gx-map-marker components", async () => {
    let childCounts: E2EElement[];

    await page.setContent(
      `<gx-map map-provider='http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'>
            <gx-map-marker class='myCustomClass' coords='-34.87945241095968, -56.078210142066956' tooltip-caption='Some title here'></gx-map-marker>
            <gx-map-marker class='myCustomClass' coords='-34.87945241095968, -56.078210142066956' tooltip-caption='Some title here'></gx-map-marker>
            <gx-map-marker class='myCustomClass' coords='-34.87945241095968, -56.078210142066956' tooltip-caption='Some title here'></gx-map-marker>
        </gx-map>
        `
    );

    await page.waitForChanges();
    element = await page.find("gx-map");
    childCounts = await page.findAll("gx-map-marker.myCustomClass");
    expect(childCounts.length).toEqual(3);

    element.innerHTML = "";
    await page.waitForChanges();
    childCounts = await page.findAll("gx-map .myCustomClass");
    expect(childCounts.length).toEqual(0);
  });

  it("should set the selection marker with the center coords returned by the map", async () => {
    const centerCoords = "-34.80682668989773,-56.16348266601563";
    await page.setContent(
      `<gx-map center="${centerCoords}" selection-layer="true"></gx-map>`
    );
    await page.waitForChanges();
    element = await page.find("gx-map");
    const selectionMarker = await element.find("gx-map-marker");

    const selectionMarkerCoords = await selectionMarker.getProperty("coords");

    expect(selectionMarkerCoords).toEqual(centerCoords);
  });

  // New Tests

  // TODO: It's supposed that when the user location is set the user-location marker get that location as it's coords
  it.skip("should set the location marker with the default coords set by the navigator location", async () => {
    /*  const context = await page.browserContext();
    const url = window.location.href;
    await context.overridePermissions(url, ["geolocation"]); */
    await page.setContent(`<gx-map show-my-location="true"></gx-map>`);
    await page.setGeolocation({ latitude: 45.1, longitude: 30.4 });
    await page.waitForChanges();

    const element = await page.find("gx-map");
    const selectionMarker = await element.find("gx-map-marker");
    const selectionMarkerCoords = await selectionMarker.getProperty("coords");
    expect(selectionMarkerCoords).toEqual(`45.1, 30.4`);
    /* expect(locationChange).toHaveReceivedEvent(); */
  });

  it("should display a visible and interactive map", async () => {
    await page.setContent(`<gx-map></gx-map>`);
    // Check that the map element exists
    const map = await page.find("gx-map");
    expect(map).toBeDefined();
  });
  // TODO: Fix this
  it.skip("trigger gxMapDidLoad event when map the map is opened first time", async () => {
    const mapDidLoad = await page.spyOnEvent("gxMapDidLoad");
    await page.setContent(
      `<div style="background-color:cornsilk; height:1000px; width:500px;"></div><gx-map></gx-map>`
    );
    await page.mouse.wheel({ deltaY: 1200 });
    await page.waitForChanges();

    expect(mapDidLoad).toHaveReceivedEvent();
  });

  it("create a selection map-marker when selectionLayer property is set in runtime", async () => {
    await page.setContent(`<gx-map></gx-map>`);
    const map = await page.find("gx-map");
    const marker = await page.find("gx-map-marker");
    expect(marker).toBeNull();
    await map.setProperty("selectionLayer", "true");
    await page.waitForChanges();
    const markerDefined = await page.find("gx-map-marker");
    expect(markerDefined).not.toBeNull();
  });

  it("create a user location map-marker when showMyLocation property is set in runtime", async () => {
    await page.setContent(`<gx-map></gx-map>`);
    const map = await page.find("gx-map");
    const marker = await page.find("gx-map-marker");
    expect(marker).toBeNull();
    await map.setProperty("showMyLocation", "true");
    await page.waitForChanges();
    const markerDefined = await page.find("gx-map-marker");
    expect(markerDefined).not.toBeNull();
  });
});
