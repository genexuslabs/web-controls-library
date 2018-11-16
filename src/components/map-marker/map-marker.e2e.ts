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
    expect(!!innerContent).toBeTruthy();
    expect(await element.getProperty("coords")).toEqual("0, 0");
    expect(await element.getProperty("tooltipCaption")).toBeUndefined();
  });

  it("should set a given coords", async () => {
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
    expect(await element.getProperty("tooltipCaption")).toBeUndefined();
  });

  it("should set a given coords and iconSrc", async () => {
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
    expect(await element.getProperty("tooltipCaption")).toBeUndefined();
  });

  it("should set a given iconSrc (but default coords)", async () => {
    await page.setContent(
      "<gx-map><gx-map-marker icon-src='https://markmed.github.io/map/Resources/location.svg'></gx-map-marker></gx-map>"
    );
    await page.waitForChanges();
    parentElement = await page.find("gx-map");
    element = await parentElement.find("gx-map-marker");
    ///////////////////////////////////////
    expect(await element.getProperty("coords")).toEqual("0, 0");
    expect(await element.getProperty("iconSrc")).toEqual(
      "https://markmed.github.io/map/Resources/location.svg"
    );
    expect(await element.getProperty("tooltipCaption")).toBeUndefined();
  });

  it("should set a given iconSrc, coords, and tooltip caption", async () => {
    await page.setContent(
      "<gx-map><gx-map-marker coords='-34.896589, -56.165579' tooltip-caption='The new life' icon-src='https://markmed.github.io/map/Resources/location.svg'></gx-map-marker></gx-map>"
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
    expect(await element.getProperty("tooltipCaption")).toEqual("The new life");
  });
});
