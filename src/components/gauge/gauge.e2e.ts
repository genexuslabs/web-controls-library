import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";
describe("gx-gauge", () => {
  let element: E2EElement;
  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage();
  });

  it("should be drawn without attributes attrs", async () => {
    await page.setContent("<gx-gauge></gx-gauge>");
    await page.waitForChanges();
    element = await page.find("gx-gauge");
    expect(element).toBeTruthy();
    expect(await element.find(".gaugeContainerLine")).toBeTruthy();
  });

  /////////////////// Type test ///////////////////////
  it("should render with the line type", async () => {
    await page.setContent("<gx-gauge type='line'></gx-gauge>");
    await page.waitForChanges();
    element = await page.find("gx-gauge");
    await page.waitForChanges();
    expect(await element.find(".gaugeContainerLine")).toBeTruthy();
  });

  it("should render with the circle type", async () => {
    await page.setContent(`
      <gx-gauge type="circle" min-value="0" value="1" show-value="true" style-shadow="true" thickness="60" >
        <gx-gauge-range amount="1" name="Blue" color="blue" ></gx-gauge-range>
        <gx-gauge-range amount="1" name="Gold" color="gold" ></gx-gauge-range>
      </gx-gauge>
    `);
    await page.waitForChanges();
    element = await page.find("gx-gauge");
    await page.waitForChanges();
    const svg = await element.find("svg");
    const svgCircle = await element.find("svg circle");
    await page.waitForChanges();
    expect(svg).toBeTruthy();
    expect(svgCircle).toBeTruthy();
    expect(svgCircle.getAttribute("stroke-dasharray")).toEqual(
      "248.79999999999998, 248.16"
    );
  });

  /////////////////// Values test ///////////////////////
  it("should set the minimum value", async () => {
    await page.setContent(`
      <gx-gauge type="line" min-value="-10" value="10" show-value="true" style-shadow="true" thickness="40" >
        <gx-gauge-range amount="10" name="Gold" color="gold" ></gx-gauge-range>
        <gx-gauge-range amount="10" name="MyBlue" color="rgb(0, 92, 129)" ></gx-gauge-range>
      </gx-gauge>
    `);
    await page.waitForChanges();
    element = await page.find("gx-gauge");
    await page.waitForChanges();
    const minValueDisplayer = await element.find("span.minValue");
    await page.waitForChanges();
    expect(await element.find("div.gaugeContainerLine")).toBeTruthy();
    expect(await element.getProperty("minValue")).toEqual(-10);
    page.waitForChanges();
    expect(minValueDisplayer.innerHTML).toEqual("-10<span></span>");
  });

  it("should set the current value", async () => {
    await page.setContent(`
      <gx-gauge type="circle" min-value="0" value="10" show-value="true" style-shadow="true" thickness="40" >
        <gx-gauge-range amount="10" name="Gold" color="gold" ></gx-gauge-range>
        <gx-gauge-range amount="10" name="MyBlue" color="rgb(0, 92, 129)" ></gx-gauge-range>
      </gx-gauge>
    `);
    await page.waitForChanges();
    element = await page.find("gx-gauge");
    const gaugeText = await page.find("div.gauge div");
    await page.waitForChanges();
    expect(await element.find("svg")).toBeTruthy();
    expect(await element.getProperty("minValue")).toEqual(0);
    expect(await element.getProperty("value")).toEqual(10);
    expect(gaugeText.innerHTML).toEqual("50%");
  });

  it("should display the name of range", async () => {
    await page.setContent(`
      <gx-gauge type="line" min-value="0" value="10" show-value="true" style-shadow="true" thickness="40" >
        <gx-gauge-range amount="10" name="Gold" color="gold" ></gx-gauge-range>
      </gx-gauge>
    `);
    await page.waitForChanges();
    element = await page.find("gx-gauge");
    const namesContainer = await page.find("div.namesContainer");
    const rangeName = await namesContainer.find("span.rangeName");
    await page.waitForChanges();
    expect(await element.find("div.gaugeContainerLine")).toBeTruthy();
    expect(rangeName.innerHTML).toEqual("Gold");
  });

  /*
  /// Commented test to be fixed later ///
  it("should show the current value", async () => {
    await page.setContent(
      `<gx-gauge type='circle' min-value='0' value='25' show-value='true' style-shadow='true' thickness='60'>
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
      "<gx-gauge type='circle' min-value='0' value='25' thickness='20'></gx-gauge>"
    );
    await page.waitForChanges();
    element = await page.find("gx-gauge");
    await page.waitForChanges();
    expect(await element.find("svg")).toBeTruthy();
    expect(await element.getProperty("thickness")).toEqual(20);
  });

  it("should set a marker in Line", async () => {
    await page.setContent(
      "<gx-gauge type='line' min-value='0' value='25' show-value='true' style-shadow='false'><gx-gauge-range color='rgba(116, 16, 216, 1)' amount='100' name='Violet'></gx-gauge-range></gx-gauge>"
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
    await page.setContent(`
      <gx-gauge type='circle' min-value='0' value='25' show-value='true' style-shadow='false'>
        <gx-gauge-range color='rgba(116, 16, 216, 1)' amount='100' name='Violet'></gx-gauge-range>
      </gx-gauge>
    `);
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
      `<gx-gauge type='line' min-value='0' value='25' show-value='true' style-shadow='false' thickness='50'>
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
    await page.setContent(`
      <gx-gauge type='circle' min-value='0' value='25' show-value='true' style-shadow='false' thickness='50'>
        <gx-gauge-range color='rgba(116, 16, 216, 1)' amount='100' name='Violet'></gx-gauge-range>
      </gx-gauge>"
    `);
    await page.waitForChanges();
    element = await page.find("gx-gauge");
    await page.waitForChanges();
    const range = await element.find("svg circle");
    await page.waitForChanges();
    expect(await element.find("svg")).toBeTruthy();
    expect(range.getAttribute("stroke")).toEqual("rgba(116, 16, 216, 1)");
  });
});
