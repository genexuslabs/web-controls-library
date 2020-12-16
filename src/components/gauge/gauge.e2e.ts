import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";
describe("gx-gauge", () => {
  let element: E2EElement;
  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage();
  });

  it("should be drawn without attributes", async () => {
    await page.setContent("<gx-gauge></gx-gauge>");
    await page.waitForChanges();
    element = await page.find("gx-gauge");
    expect(element).toBeTruthy();
    expect(await element.find(".gaugeContainerLine")).toBeTruthy();
  });

  /////////////////// Values test ///////////////////////
  it("should set the default and the minimum value", async () => {
    await page.setContent(`
      <gx-gauge show-value="true"></gx-gauge>
    `);
    await page.waitForChanges();
    element = await page.find("gx-gauge");

    const minValueDisplayer = await element.find("span.minValue");
    expect(minValueDisplayer.textContent).toEqual("0");

    const minValueTest = -100;
    await element.setProperty("minValue", minValueTest);
    await page.waitForChanges();
    expect(minValueDisplayer.textContent).toEqual(`${minValueTest}`);
  });

  it("should set the passed current value", async () => {
    const currentValueTest = 5;
    await page.setContent(`
      <gx-gauge type="line" min-value="0" value="${currentValueTest}" max-value="10" show-value="true">
      </gx-gauge>
    `);
    await page.waitForChanges();
    element = await page.find("gx-gauge");
    const gaugeCurrentValue = await page.find("div.gauge span.marker-value");
    expect(await element.getProperty("value")).toEqual(currentValueTest);
    expect(gaugeCurrentValue.textContent).toEqual(`${currentValueTest}`);
  });

  it("should set the passed maximum value", async () => {
    const maxValueTest = 100;
    await page.setContent(`
      <gx-gauge type="line" min-value="0" value="5" max-value="${maxValueTest}" show-value="true">
      </gx-gauge>
    `);
    await page.waitForChanges();
    element = await page.find("gx-gauge");
    const maxValueDisplayer = await element.find(
      "div.minMaxDisplay span.maxValue"
    );
    expect(await element.getProperty("maxValue")).toEqual(maxValueTest);
    expect(maxValueDisplayer.textContent).toEqual(`${maxValueTest}`);
  });

  it("should calculate the total ranges values and show the sum as the maximum value", async () => {
    await page.setContent(`
      <gx-gauge type="line" show-value="true">
        <gx-gauge-range amount="50" color="rgba(256, 116, 86, 1)" name="Problem"></gx-gauge-range>
        <gx-gauge-range amount="25" color="rgba(256, 216, 106, 1)" name="Warning"></gx-gauge-range>
        <gx-gauge-range amount="25" color="rgba(166, 216, 116, 1)" name="Good" ></gx-gauge-range>
      </gx-gauge>
    `);
    await page.waitForChanges();
    element = await page.find("gx-gauge");
    const maxValueDisplayer = await element.find(
      "div.minMaxDisplay span.maxValue"
    );
    await page.waitForChanges();
    expect(maxValueDisplayer.textContent).toEqual(`${100}`);
  });

  /////////////////// Interface tests ///////////////////////

  it("it should render according to the gauge type specified in the attribute 'type'", async () => {
    await page.setContent("<gx-gauge type='line'></gx-gauge>");
    await page.waitForChanges();
    element = await page.find("gx-gauge");
    await page.waitForChanges();
    expect(await element.find(".gaugeContainerLine")).toBeTruthy();

    element.setProperty("type", "circle");
    await page.waitForChanges();

    expect(await element.find("svg")).toBeTruthy();
    expect(await element.find("svg circle")).toBeTruthy();
  });

  it("should display the name of range (in each gauge type)", async () => {
    await page.setContent(`
      <gx-gauge type="line" min-value="0" value="10" show-value="true">
        <gx-gauge-range amount="10" name="Gold" color="gold" ></gx-gauge-range>
      </gx-gauge>
    `);
    await page.waitForChanges();
    element = await page.find("gx-gauge");
    const namesContainer = await page.find("div.labelsContainerLine");
    const rangeName = await namesContainer.find("span.rangeName");
    expect(await element.find("div.gaugeContainerLine")).toBeTruthy();
    expect(rangeName.textContent).toEqual("Gold");

    element.setProperty("type", "circle");
    await page.waitForChanges();

    const labelsContainer = await element.find("div.labelsContainerCircle");
    expect(labelsContainer).toBeTruthy();
    const label = await labelsContainer.find("div.range-label");
    expect(label).toBeTruthy();
    expect((await label.find("span")).textContent).toEqual(`10 - Gold`);
  });

  it("should propely the set a marker (in each gauge type)", async () => {
    // improve this test to check if the marker is in the correct position
    await page.setContent(
      "<gx-gauge type='line' min-value='-100' max-value='100' value='0' show-value='true'></gx-gauge>"
    );
    await page.waitForChanges();
    element = await page.find("gx-gauge");
    await page.waitForChanges();
    expect(await element.find(".gaugeContainerLine")).toBeTruthy();
    const gaugeLineMarker = await element.find(".gaugeContainerLine .marker");
    expect(gaugeLineMarker).toBeTruthy();
    // expect(gaugeLineMarker.getAttribute("style").includes("margin-left: 50%;")).toBeTruthy()

    element.setProperty("type", "circle");
    await page.waitForChanges();

    expect(await element.find("svg")).toBeTruthy();
    expect(await element.find("svg circle")).toBeTruthy();
    expect(await element.find("div.indicator")).toBeTruthy();
    const gaugeCircleMarker = await page.find("div.svgContainer span.marker");
    expect(gaugeCircleMarker).toBeTruthy();
    // expect(gaugeCircleMarker.getAttribute("style").includes("transform: rotate(180deg)")).toBeTruthy()
  });

  it("should correctly draw the range (in each gauge type)", async () => {
    // improve this test to check if the range is corrctly drawn (position, length, etc)
    await page.setContent(`
		<gx-gauge type="line" min-value="0" value="5" max-value='10' show-value="true">
			<gx-gauge-range amount="5" name="Gold" color="gold" ></gx-gauge-range>
		</gx-gauge>
      `);
    await page.waitForChanges();
    element = await page.find("gx-gauge");
    await page.waitForChanges();
    expect(await element.find(".gaugeContainerLine")).toBeTruthy();
    const gaugeLineRange = await element.find(".rangesContainer .range");
    expect(gaugeLineRange).toBeTruthy();
    // expect(gaugeLineRange.getAttribute("style")).toEqual("background-color: gold; margin-left: 0%; width: 50%;");

    element.setProperty("type", "circle");
    await page.waitForChanges();

    expect(await element.find("svg")).toBeTruthy();
    expect(await element.find("svg circle")).toBeTruthy();
    expect(await element.find("div.indicator")).toBeTruthy();
    const gaugeCircleRange = await page.find(
      "div.svgContainer svg circle.circle-range"
    );
    expect(gaugeCircleRange).toBeTruthy();
    expect(gaugeCircleRange.getAttribute("stroke")).toEqual("gold");
    expect(gaugeCircleRange.getAttribute("stroke-dasharray")).toEqual(
      "141.3716694115407, 282.7433388230814"
    );
  });
});
