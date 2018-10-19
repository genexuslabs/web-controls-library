import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";

describe("gx-map-marker", () => {
  let parentElement: E2EElement;
  let element: E2EElement;
  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage();
  });

  it("should work w/o attributes", async () => {
    await page.setContent("<gx-map><gx-map-marker></gx-map-marker></gx-map>");
    await page.waitForChanges();
    parentElement = await page.find("gx-map");
    element = await parentElement.find("gx-map-marker");
    ///////////////////////////////////////
    const innerContent = await parentElement.find(".leaflet-marker-icon");
    expect(!!innerContent).toEqual(true);
    expect(await element.getProperty("coords")).toEqual("0, 0");
    expect(await element.getProperty("iconSrc")).toEqual(
      "https://unpkg.com/leaflet@1.3.4/dist/images/marker-icon.png"
    );
    expect(await element.getProperty("iconSize")).toEqual("25, 41");
    expect(await element.getProperty("iconAnchor")).toEqual("12.5, 41");
    expect(await element.getProperty("tooltipAnchor")).toEqual("0, -30");
    expect(await element.getProperty("tooltipCaption")).toEqual(undefined);
  });
  it("should set a given coords (but w/ default properties)", async () => {
    await page.setContent(
      "<gx-map><gx-map-marker coords='-34.896589, -56.165579'></gx-map-marker></gx-map>"
    );
    await page.waitForChanges();
    parentElement = await page.find("gx-map");
    element = await parentElement.find("gx-map-marker");
    ///////////////////////////////////////
    expect(await element.getProperty("coords")).toEqual(
      "-34.896589, -56.165579"
    );
    expect(await element.getProperty("iconSrc")).toEqual(
      "https://unpkg.com/leaflet@1.3.4/dist/images/marker-icon.png"
    );
    expect(await element.getProperty("iconSize")).toEqual("25, 41");
    expect(await element.getProperty("iconAnchor")).toEqual("12.5, 41");
    expect(await element.getProperty("tooltipAnchor")).toEqual("0, -30");
    expect(await element.getProperty("tooltipCaption")).toEqual(undefined);
  });
  it("should set a given coords n' iconSrc (but w/ default properties)", async () => {
    await page.setContent(
      "<gx-map><gx-map-marker coords='-34.896589, -56.165579' icon-src='https://markmed.github.io/map/Resources/location.svg'></gx-map-marker></gx-map>"
    );
    await page.waitForChanges();
    parentElement = await page.find("gx-map");
    element = await parentElement.find("gx-map-marker");
    ///////////////////////////////////////
    expect(await element.getProperty("coords")).toEqual(
      "-34.896589, -56.165579"
    );
    expect(await element.getProperty("iconSrc")).toEqual(
      "https://markmed.github.io/map/Resources/location.svg"
    );
    expect(await element.getProperty("iconSize")).toEqual("25, 41");
    expect(await element.getProperty("iconAnchor")).toEqual("12.5, 41");
    expect(await element.getProperty("tooltipAnchor")).toEqual("0, -30");
    expect(await element.getProperty("tooltipCaption")).toEqual(undefined);
  });
  it("should set a given iconSrc and dimensions (but w/ default properties)", async () => {
    await page.setContent(
      "<gx-map><gx-map-marker icon-src='https://markmed.github.io/map/Resources/location.svg' icon-size='24.75, 37.5' icon-anchor='12.75, 37.5' tooltip-anchor='0, -28.875'></gx-map-marker></gx-map>"
    );
    await page.waitForChanges();
    parentElement = await page.find("gx-map");
    element = await parentElement.find("gx-map-marker");
    ///////////////////////////////////////
    expect(await element.getProperty("coords")).toEqual("0, 0");
    expect(await element.getProperty("iconSrc")).toEqual(
      "https://markmed.github.io/map/Resources/location.svg"
    );
    expect(await element.getProperty("iconSize")).toEqual("24.75, 37.5");
    expect(await element.getProperty("iconAnchor")).toEqual("12.75, 37.5");
    expect(await element.getProperty("tooltipAnchor")).toEqual("0, -28.875");
    expect(await element.getProperty("tooltipCaption")).toEqual(undefined);
  });
  it("should set all given attrs", async () => {
    await page.setContent(
      "<gx-map><gx-map-marker coords='-34.896589, -56.165579' tooltip-caption='New life' icon-src='https://markmed.github.io/map/Resources/location.svg' icon-size='24.75, 37.5' icon-anchor='12.75, 37.5' tooltip-anchor='0, -28.875'></gx-map-marker></gx-map>"
    );
    await page.waitForChanges();
    parentElement = await page.find("gx-map");
    element = await parentElement.find("gx-map-marker");
    ///////////////////////////////////////
    expect(await element.getProperty("coords")).toEqual(
      "-34.896589, -56.165579"
    );
    expect(await element.getProperty("iconSrc")).toEqual(
      "https://markmed.github.io/map/Resources/location.svg"
    );
    expect(await element.getProperty("iconSize")).toEqual("24.75, 37.5");
    expect(await element.getProperty("iconAnchor")).toEqual("12.75, 37.5");
    expect(await element.getProperty("tooltipAnchor")).toEqual("0, -28.875");
    expect(await element.getProperty("tooltipCaption")).toEqual("New life");
  });
});
