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
    expect(innerContent).not.toBeNull();
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

  it("should set default coords", async () => {
    await page.setContent("<gx-map><gx-map-marker></gx-map-marker></gx-map>");
    await page.waitForChanges();
    parentElement = await page.find("gx-map");
    element = await parentElement.find("gx-map-marker");
    ///////////////////////////////////////
    expect(await element.getProperty("coords")).toEqual("0, 0");
    expect(await element.getProperty("tooltipCaption")).toBeUndefined();
  });

  it("should set coords, and tooltip caption", async () => {
    await page.setContent(
      "<gx-map><gx-map-marker coords='-34.896589, -56.165579' tooltip-caption='Text Here'></gx-map-marker></gx-map>"
    );
    await page.waitForChanges();
    parentElement = await page.find("gx-map");
    element = await parentElement.find("gx-map-marker");
    ///////////////////////////////////////
    expect(await element.getProperty("coords")).toEqual(
      "-34.896589, -56.165579"
    );
    expect(await element.getProperty("tooltipCaption")).toEqual("Text Here");
  });

  it("should set the given class to the marker and has the default sizes", async () => {
    await page.setContent(
      "<gx-map><gx-map-marker coords='-34.896589, -56.165579' tooltip-caption='Text Here' marker-class='myCustomClass'></gx-map-marker></gx-map>"
    );
    await page.waitForChanges();
    parentElement = await page.find("gx-map");
    element = await parentElement.find("gx-map-marker");
    const insertedMarker = await parentElement.find(".myCustomClass");
    ///////////////////////////////////////
    expect(await element.getProperty("coords")).toEqual(
      "-34.896589, -56.165579"
    );
    expect(await element.getProperty("tooltipCaption")).toEqual("Text Here");
    expect(insertedMarker).toBeTruthy();
    expect((await insertedMarker.getComputedStyle()).width).toEqual("30px");
    expect((await insertedMarker.getComputedStyle()).height).toEqual("30px");
  });

  it("should set the given sizes to the marker", async () => {
    await page.setContent(`
    <gx-map
      ><gx-map-marker
        coords="-34.896589, -56.165579"
        tooltip-caption="Text Here"
        marker-class="myCustomClass"
        icon-height="45"
        icon-width="45"
      ></gx-map-marker
    ></gx-map>`);
    await page.waitForChanges();
    parentElement = await page.find("gx-map");
    element = await parentElement.find("gx-map-marker");
    const insertedMarker = await parentElement.find(".myCustomClass");
    ///////////////////////////////////////
    expect(await element.getProperty("coords")).toEqual(
      "-34.896589, -56.165579"
    );
    expect(await element.getProperty("tooltipCaption")).toEqual("Text Here");
    expect((await insertedMarker.getComputedStyle()).width).toEqual("45px");
    expect((await insertedMarker.getComputedStyle()).height).toEqual("45px");
  });
});
