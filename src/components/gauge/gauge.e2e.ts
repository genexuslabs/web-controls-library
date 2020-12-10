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
      <gx-gauge type="circle"></gx-gauge>
    `);
    await page.waitForChanges();
    element = await page.find("gx-gauge");
    await page.waitForChanges();
    const svg = await element.find("svg");
    const svgCircle = await element.find("svg circle");
    await page.waitForChanges();
    expect(svg).toBeTruthy();
    expect(svgCircle).toBeTruthy();
  });

  /////////////////// Values test ///////////////////////
  it("should automatically set the default minimum value", async () => {
    await page.setContent(`
      <gx-gauge show-value="true"></gx-gauge>
    `);
    await page.waitForChanges();
    element = await page.find("gx-gauge");
    const minValueDisplayer = await element.find("span.minValue");
    expect(await element.getProperty("minValue")).toEqual(0);
    expect(minValueDisplayer.innerHTML).toEqual("0<span></span>");
  });

  it("should set the passed minimum value", async () => {
    const minValueTest = -100;
    await page.setContent(`
      <gx-gauge show-value="true" min-value="${minValueTest}"></gx-gauge>
    `);
    await page.waitForChanges();
    element = await page.find("gx-gauge");
    const minValueDisplayer = await element.find(
      "div.minMaxDisplay span.minValue"
    );
    expect(await element.getProperty("minValue")).toEqual(minValueTest);
    expect(minValueDisplayer.innerHTML).toEqual(`${minValueTest}<span></span>`);
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
    expect(gaugeCurrentValue.innerHTML).toEqual(`${currentValueTest}`);
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
    expect(maxValueDisplayer.innerHTML).toEqual(`${maxValueTest}<span></span>`);
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
    expect(maxValueDisplayer.innerHTML).toEqual(`${100}<span></span>`);
  });

  /////////////////// Layout test ///////////////////////

  it("should display the name of range", async () => {
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
    expect(rangeName.innerHTML).toEqual("Gold");
  });

  //   it("should set thickness value", async () => {
  //     await page.setContent(
  //       "<gx-gauge type='circle' min-value='0' value='25' thickness='20'></gx-gauge>"
  //     );
  //     await page.waitForChanges();
  //     element = await page.find("gx-gauge");
  //     await page.waitForChanges();
  //     expect(await element.find("svg")).toBeTruthy();
  //     expect(await element.getProperty("thickness")).toEqual(20);
  //   });

  //   it("should set a marker in linear gauge", async () => {
  //     await page.setContent(`
  //       <gx-gauge type='line' min-value='0' value='25' show-value='true' style-shadow='false'>
  //         <gx-gauge-range color='rgba(116, 16, 216, 1)' amount='100' name='Violet'></gx-gauge-range>
  //       </gx-gauge>
  //     `);
  //     await page.waitForChanges();
  //     element = await page.find("gx-gauge");
  //     await page.waitForChanges();
  //     expect(await element.find(".gaugeContainerLine")).toBeTruthy();
  //     expect(await element.find("span.marker")).toBeTruthy();
  //     expect(await element.find(".minMaxDisplay")).toBeTruthy();
  //   });

  //   it("should set a marker in circular gauge", async () => {
  //     await page.setContent(`
  //       <gx-gauge type='circle' min-value='0' value='25' show-value='true' style-shadow='false'>
  //         <gx-gauge-range color='rgba(116, 16, 216, 1)' amount='100' name='Violet'></gx-gauge-range>
  //       </gx-gauge>
  //     `);
  //     await page.waitForChanges();
  //     element = await page.find("gx-gauge");
  //     await page.waitForChanges();
  //     expect(await element.find("svg")).toBeTruthy();
  //     expect(await element.find("span.marker")).toBeTruthy();
  //   });

  //   it("should set the range name in linear gauge", async () => {
  //     await page.setContent(`
  //       <gx-gauge type='line' min-value='0' value='25' show-value='true' style-shadow='false'>
  //         <gx-gauge-range color='rgba(116, 16, 216, 1)' amount='100' name='Violet'></gx-gauge-range>
  //       </gx-gauge>
  //     `);
  //     await page.waitForChanges();
  //     element = await page.find("gx-gauge");
  //     const rangeNameDiv = await element.find("span.rangeName");
  //     await page.waitForChanges();
  //     expect(await element.find(".gaugeContainerLine")).toBeTruthy();
  //     expect(rangeNameDiv).toBeTruthy();
  //     expect(rangeNameDiv.innerHTML).toEqual("Violet");
  //     expect(await element.find(".minMaxDisplay")).toBeTruthy();
  //   });
  //   /////////////////// gx-range tests ///////////////////////
  //   it("should correctly draw the range in linear gauge", async () => {
  //     await page.setContent(
  //       `<gx-gauge type='line' min-value='0' value='25' show-value='true' style-shadow='false' thickness='50'>
  //         <gx-gauge-range amount='100' name='Violet' color="purple"></gx-gauge-range>
  //       </gx-gauge>`
  //     );
  //     await page.waitForChanges();
  //     element = await page.find("gx-gauge");
  //     await page.waitForChanges();
  //     const rangeContainer = await element.find("div.rangesContainer");
  //     await page.waitForChanges();
  //     const ranges = await rangeContainer.find("div.range");
  //     await page.waitForChanges();
  //     expect(rangeContainer).toBeTruthy();
  //     expect(ranges).toBeTruthy();
  //   });

  //   it("should correctly draw the range in circular gauge", async () => {
  //     await page.setContent(`
  //       <gx-gauge type='circle' min-value='0' value='25' show-value='true' style-shadow='false' thickness='50'>
  //         <gx-gauge-range color='rgba(116, 16, 216, 1)' amount='100' name='Violet'></gx-gauge-range>
  //       </gx-gauge>"
  //     `);
  //     await page.waitForChanges();
  //     element = await page.find("gx-gauge");
  //     await page.waitForChanges();
  //     const range = await element.find("svg circle");
  //     await page.waitForChanges();
  //     expect(await element.find("svg")).toBeTruthy();
  //     expect(range.getAttribute("stroke")).toEqual("rgba(116, 16, 216, 1)");
  //   });
});
