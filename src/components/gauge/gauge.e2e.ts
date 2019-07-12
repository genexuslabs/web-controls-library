import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";
describe("gx-gauge", () => {
  let element: E2EElement;
  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage();
  });

  it("should be drawn w/o attrs", async () => {
    await page.setContent("<gx-gauge></gx-gauge>");
    await page.waitForChanges();
    element = await page.find("gx-gauge");
    expect(element).toBeTruthy();
    expect(await element.find(".gaugeContainerLine")).toBeTruthy();
  });
  /////////////////// Type test ///////////////////////

  it("should render with the line type", async () => {
    await page.setContent("<gx-gauge gauge-type='line'></gx-gauge>");
    await page.waitForChanges();
    element = await page.find("gx-gauge");
    await page.waitForChanges();
    expect(await element.find(".gaugeContainerLine")).toBeTruthy();
  });

  it("should render with the circle type", async () => {
    await page.setContent("<gx-gauge gauge-type='circle'></gx-gauge>");
    await page.waitForChanges();
    element = await page.find("gx-gauge");
    await page.waitForChanges();
    expect(await element.find("svg")).toBeTruthy();
  });

  /////////////////// Values test ///////////////////////
  it("should set min value", async () => {
    await page.setContent(
      "<gx-gauge gauge-type='circle' min-value='0'></gx-gauge>"
    );
    await page.waitForChanges();
    element = await page.find("gx-gauge");
    await page.waitForChanges();
    expect(await element.find("svg")).toBeTruthy();
    expect(await element.getProperty("minValue")).toEqual(0);
  });

  it("should set current value", async () => {
    await page.setContent(
      "<gx-gauge gauge-type='circle' min-value='0' value='25'></gx-gauge>"
    );
    await page.waitForChanges();
    element = await page.find("gx-gauge");
    await page.waitForChanges();
    expect(await element.find("svg")).toBeTruthy();
    expect(await element.getProperty("minValue")).toEqual(0);
    expect(await element.getProperty("value")).toEqual(25);
  });

  /*
  /// Commented test to be fixed later ///
  it("should show the current value", async () => {
    await page.setContent(
      `<gx-gauge gauge-type='circle' min-value='0' value='25' show-value='true' style-shadow='true' thickness='60'>
        <gx-gauge-range amount='100' name='Violet' color="purple"></gx-gauge-range>
      </gx-gauge>`
    );
    await page.waitForChanges();
    element = await page.find("gx-gauge");
    await page.waitForChanges();
    const marker = await element.find("span.marker");
    await page.waitForChanges();
    const markerStyle = marker.getComputedStyle();
    await page.waitForChanges();
    expect(await element.find("svg")).toBeTruthy();
    expect(await element.getProperty("minValue")).toEqual(0);
    expect(await element.getProperty("value")).toEqual(25);
    expect(markerStyle).toBeNull();
  });
  */

  /////////////////// Frontend test ///////////////////////
  it("should set thickness value", async () => {
    await page.setContent(
      "<gx-gauge gauge-type='circle' min-value='0' value='25' thickness='20'></gx-gauge>"
    );
    await page.waitForChanges();
    element = await page.find("gx-gauge");
    await page.waitForChanges();
    expect(await element.find("svg")).toBeTruthy();
    expect(await element.getProperty("thickness")).toEqual(20);
  });

  it("should set a marker in Line", async () => {
    await page.setContent(
      "<gx-gauge gauge-type='line' min-value='0' value='25' show-value='true' style-shadow='false'><gx-gauge-range color='rgba(116, 16, 216, 1)' amount='100' name='Violet'></gx-gauge-range></gx-gauge>"
    );
    await page.waitForChanges();
    element = await page.find("gx-gauge");
    await page.waitForChanges();
    await page.waitForChanges();
    expect(await element.find(".gaugeContainerLine")).toBeTruthy();
    expect(await element.find("span.marker")).toBeTruthy();
    expect(await element.find(".minMaxDisplay")).toBeTruthy();
  });

  it("should set a marker in Circle", async () => {
    await page.setContent(
      "<gx-gauge gauge-type='circle' min-value='0' value='25' show-value='true' style-shadow='false'><gx-gauge-range color='rgba(116, 16, 216, 1)' amount='100' name='Violet'></gx-gauge-range></gx-gauge>"
    );
    await page.waitForChanges();
    element = await page.find("gx-gauge");
    await page.waitForChanges();
    await page.waitForChanges();
    expect(await element.find("svg")).toBeTruthy();
    expect(await element.find("span.marker")).toBeTruthy();
  });

  /////////////////// gx-range tests ///////////////////////
  it("should correctly draw the range in Line", async () => {
    await page.setContent(
      `<gx-gauge gauge-type='line' min-value='0' value='25' show-value='true' style-shadow='false' thickness='50'>
        <gx-gauge-range amount='100' name='Violet' color="purple"></gx-gauge-range>
      </gx-gauge>`
    );
    await page.waitForChanges();
    element = await page.find("gx-gauge");
    await page.waitForChanges();
    const rangeContainer = await element.find("div.rangesContainer");
    await page.waitForChanges();
    const ranges = await rangeContainer.find("div.range");
    await page.waitForChanges();
    expect(rangeContainer).toBeTruthy();
    expect(ranges).toBeTruthy();
  });

  it("should correctly draw the range in Circle", async () => {
    await page.setContent(
      "<gx-gauge gauge-type='circle' min-value='0' value='25' show-value='true' style-shadow='false' thickness='50'><gx-gauge-range color='rgba(116, 16, 216, 1)' amount='100' name='Violet'></gx-gauge-range></gx-gauge>"
    );
    await page.waitForChanges();
    element = await page.find("gx-gauge");
    await page.waitForChanges();
    const range = await element.find("svg circle");
    await page.waitForChanges();
    expect(await element.find("svg")).toBeTruthy();
    expect(range.getAttribute("stroke")).toEqual("rgba(116, 16, 216, 1)");
  });
});
