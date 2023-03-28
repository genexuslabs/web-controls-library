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
    expect(await element.find(".line-gauge-container")).toBeTruthy();
  });

  /////////////////// Values test ///////////////////////
  it("should set the default and the minimum value", async () => {
    await page.setContent(`
      <gx-gauge show-value="true" show-min-max="true"></gx-gauge>
    `);
    await page.waitForChanges();
    element = await page.find("gx-gauge");

    const minValueDisplayer = await element.find("span.min-value");
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
    const gaugeCurrentValue = await page.find(
      ".line-gauge-container .current-value"
    );
    expect(await element.getProperty("value")).toEqual(currentValueTest);
    expect(gaugeCurrentValue.textContent).toEqual(`${currentValueTest}`);
  });

  it("should set the passed maximum value", async () => {
    const maxValueTest = 100;
    await page.setContent(`
      <gx-gauge type="line" min-value="0" value="5" max-value="${maxValueTest}" show-value="true" show-min-max="true">
      </gx-gauge>
    `);
    await page.waitForChanges();
    element = await page.find("gx-gauge");
    const maxValueDisplayer = await element.find(
      ".min-max-values-container .max-value"
    );
    expect(await element.getProperty("maxValue")).toEqual(maxValueTest);
    expect(maxValueDisplayer.textContent).toEqual(`${maxValueTest}`);
  });

  it("should calculate the total ranges values and show the sum as the maximum value", async () => {
    await page.setContent(`
      <gx-gauge type="line" show-value="true" show-min-max="true">
        <gx-gauge-range amount="50" color="rgba(256, 116, 86, 1)" name="Problem"></gx-gauge-range>
        <gx-gauge-range amount="25" color="rgba(256, 216, 106, 1)" name="Warning"></gx-gauge-range>
        <gx-gauge-range amount="25" color="rgba(166, 216, 116, 1)" name="Good" ></gx-gauge-range>
      </gx-gauge>
    `);
    await page.waitForChanges();
    element = await page.find("gx-gauge");
    const maxValueDisplayer = await element.find(
      ".min-max-values-container .max-value"
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
    expect(await element.find(".line-gauge-container")).toBeTruthy();

    element.setProperty("type", "circle");
    await page.waitForChanges();

    expect(await element.find("svg")).toBeTruthy();
    expect(await element.find("svg circle")).toBeTruthy();
  });

  it("should display the name of range (in the line gauge type)", async () => {
    await page.setContent(`
      <gx-gauge type="line" min-value="0" value="10" show-value="true">
        <gx-gauge-range amount="10" name="Gold" color="gold" ></gx-gauge-range>
      </gx-gauge>
    `);
    await page.waitForChanges();
    element = await page.find("gx-gauge");
    expect(await element.find("div.line-gauge-container")).toBeTruthy();
    const rangesAndNamesContainer = await page.find(
      "div.ranges-and-labels-container"
    );
    const rangeLabel = await rangesAndNamesContainer.find(".range-label");
    expect(rangeLabel.textContent).toEqual("Gold");
  });

  it("should properly set a indicator (in circle gauge type)", async () => {
    await page.setContent(
      "<gx-gauge type='circle' min-value='-100' max-value='100' value='0' show-value='true'></gx-gauge>"
    );
    await page.waitForChanges();
    element = await page.find("gx-gauge");

    const delay = ms => new Promise(res => setTimeout(res, ms));
    await delay(1000); // Wait one second to let the label be positioned

    expect(await element.find("svg")).toBeTruthy();
    expect(await element.find("svg circle")).toBeTruthy();
    const indicatorContainer = await element.find(
      "div.svg-and-indicator-container"
    );
    expect(indicatorContainer).toBeTruthy();

    const indicator = await indicatorContainer.find("div.indicator-container");
    expect(indicator).toBeTruthy();

    /* The rotation matrix in 2 dimensions spaces is defined as it follows:
        R(x) =  (cos(x)  sin(x))
                (-sin(x) cos(x))
      Remark that: det(R(x)) = cos(x).cos(x) + sin(x).sin(x) = 1. 
    
      In this case, to rotate 270deg (Math.PI * 1.5), the rotation values are
        R(Math.PI * 1.5) =  ( cos(Math.PI * 1.5) sin(Math.PI * 1.5)) == (0 -1)
                            (-sin(Math.PI * 1.5) cos(Math.PI * 1.5)) == (1  0)
      In floating point, -1.83697e-16 is pretty much zero.
    */
    expect((await indicator.getComputedStyle()).transform).toEqual(
      "matrix(-1.83697e-16, -1, 1, -1.83697e-16, 0, 0)"
    );
  });

  it("should correctly draw the range (in circle gauge type)", async () => {
    // improve this test to check if the range is corrctly drawn (position, length, etc)
    await page.setContent(`
		<gx-gauge type="circle" min-value="0" value="5" max-value='10' show-value="true">
			<gx-gauge-range amount="5" name="Gold" color="gold" ></gx-gauge-range>
		</gx-gauge>
      `);
    await page.waitForChanges();
    element = await page.find("gx-gauge");
    await page.waitForChanges();

    expect(await element.find("svg")).toBeTruthy();
    expect(await element.find("svg circle")).toBeTruthy();
    const indicatorContainer = await element.find(
      "div.svg-and-indicator-container"
    );
    expect(indicatorContainer).toBeTruthy();
    const indicator = await indicatorContainer.find("div.indicator-container");
    expect(indicator).toBeTruthy();

    const gaugeCircleRange = await page.find(
      "div.svg-and-indicator-container svg circle.circle-range"
    );
    expect(gaugeCircleRange).toBeTruthy();
    expect(gaugeCircleRange.getAttribute("stroke")).toEqual("gold");
    expect(gaugeCircleRange.getAttribute("stroke-dasharray")).toEqual(
      "141.3716694115407, 282.7433388230814"
    );
  });
});
