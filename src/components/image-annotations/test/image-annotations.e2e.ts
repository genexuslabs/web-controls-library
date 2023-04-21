import { newE2EPage, E2EElement, E2EPage } from "@stencil/core/testing";

function MockRedColorDraw() {
  const element = document.querySelector("gx-image-annotations");
  // Get canvas element
  const canvas = element.shadowRoot.getElementById("canvas");
  // Get 2D canvas context
  const ctx = canvas.getContext("2d");
  // set trace color
  ctx.strokeStyle = "red";
  // Draw a line on canvas
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(100, 100);
  ctx.stroke();
  // Get image data
  const imageData = ctx.getImageData(0, 0, 300, 300);
  // Get pixel color in position (50, 50)
  const pixelData = imageData.data;
  const red = pixelData[50 * (300 * 4) + 50 * 4];
  const green = pixelData[50 * (300 * 4) + 50 * 4 + 1];
  const blue = pixelData[50 * (300 * 4) + 50 * 4 + 2];
  // Comprobar que el color utilizado es el correcto
  if (red === 255 && green === 0 && blue === 0) {
    return true;
  }
  return false;
}

describe("gx-image-annotations", () => {
  let element: E2EElement;
  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage();
  });

  it("set trace-color works", async () => {
    const page = await newE2EPage();
    await page.setContent(
      `<gx-image-annotations trace-color="red"></gx-image-annotations>`
    );
    await page.waitForChanges();
    const isDrawingRed = await page.evaluate(MockRedColorDraw);
    expect(isDrawingRed).toBe(true);
  });

  it("renders", async () => {
    page = await newE2EPage();
    await page.setContent("<gx-image-annotations></gx-image-annotations>");

    element = await page.find("gx-image-annotations");

    expect(element).toHaveClass("hydrated");
  });

  it("background image is set by value property", async () => {
    const backgroundImage = "./assets/lighthouse-middle.jpg";
    page = await newE2EPage();
    await page.setContent(
      `<div style="background-color:red; height:300px; width:300px;" ><gx-image-annotations value=${backgroundImage} trace-color="#000000"></gx-image-annotations></div>`
    );
    await page.waitForChanges();

    const results = await page.compareScreenshot();
    expect(results).toMatchScreenshot();
  });

  it("adjust canvas size when screen size changes", async () => {
    await page.setViewport({
      width: 300,
      height: 300,
      isMobile: true
    });
    const backgroundImage = "./assets/lighthouse-middle.jpg";
    page = await newE2EPage();
    await page.setContent(
      `<div style="background-color:red; height:300px; width:300px;" ><gx-image-annotations value=${backgroundImage} trace-color="#000000"></gx-image-annotations></div>`
    );
    await page.waitForChanges();
    const result = await page.compareScreenshot();
    expect(result).toMatchScreenshot();
  });

  it("loadImage method works properly when value property is set to null", async () => {
    const backgroundImage = null;
    page = await newE2EPage();
    await page.setContent(
      `<div style="background-color:red; height:300px; width:300px;" ><gx-image-annotations value=${backgroundImage} trace-color="#000000"></gx-image-annotations></div>`
    );
    const annotationHandle = await page.$("gx-image-annotations");
    const boundingBox = await annotationHandle.boundingBox();
    const x = boundingBox.x + boundingBox.width / 2;
    const y = boundingBox.y + boundingBox.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + 200, y);
    await page.mouse.up();
    await page.waitForChanges();
    const result = await page.compareScreenshot();
    expect(result).toMatchScreenshot();
  });

  it("trigger traceIndexChange event when drawing on canvas", async () => {
    const page = await newE2EPage();
    await page.setContent(`<gx-image-annotations></gx-image-annotations>`);
    element = await page.find("gx-image-annotations");
    await page.waitForChanges();
    const annotationEvent = await page.spyOnEvent("traceIndexChange");
    await element.click();
    expect(annotationEvent).toHaveReceivedEvent();
  });

  it("do not trigger traceIndexChange event when drawing on canvas and disabled property is set", async () => {
    const page = await newE2EPage();
    await page.setContent(
      `<gx-image-annotations disabled="true"></gx-image-annotations>`
    );
    element = await page.find("gx-image-annotations");
    await page.waitForChanges();
    const annotationEvent = await page.spyOnEvent("traceIndexChange");
    await element.click();
    expect(annotationEvent).not.toHaveReceivedEvent();
  });

  it("trigger annotationsChange event when drawing on canvas", async () => {
    const page = await newE2EPage();
    await page.setContent(`<gx-image-annotations></gx-image-annotations>`);
    element = await page.find("gx-image-annotations");
    await page.waitForChanges();
    const annotationEvent = await page.spyOnEvent("annotationsChange");
    await element.click();
    expect(annotationEvent).toHaveReceivedEvent();
  });

  it("do not trigger annotationsChange event when drawing on canvas and disabled property is set", async () => {
    const page = await newE2EPage();
    await page.setContent(
      `<gx-image-annotations disabled="true"></gx-image-annotations>`
    );
    element = await page.find("gx-image-annotations");
    await page.waitForChanges();
    const annotationEvent = await page.spyOnEvent("annotationsChange");
    await element.click();
    await page.waitForChanges();
    expect(annotationEvent).not.toHaveReceivedEvent();
  });

  it("trigger traceIndexChange event when goBack is called", async () => {
    const page = await newE2EPage();
    await page.setContent(`<gx-image-annotations></gx-image-annotations>`);
    element = await page.find("gx-image-annotations");
    await page.waitForChanges();
    const annotationEvent = await page.spyOnEvent("traceIndexChange");
    await element.click();
    await page.waitForChanges();
    const value = await element.getProperty("traceIndex");
    element.setAttribute("trace-index", value - 1);
    await page.waitForChanges();
    expect(annotationEvent).toHaveReceivedEventTimes(3);
  });
  it("drawing using mousedown and touchstart events", async () => {
    const page = await newE2EPage();
    await page.setContent(
      `<gx-image-annotations trace-color="blue"></gx-image-annotations>`
    );
    const annotationHandle = await page.$("gx-image-annotations");
    const boundingBox = await annotationHandle.boundingBox();
    const x = boundingBox.x + boundingBox.width / 2;
    const y = boundingBox.y + boundingBox.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.touchscreen.tap(x + 200, y);
    const results = await page.compareScreenshot();
    expect(results).toMatchScreenshot();
  });
  it("drawing using mousemove event", async () => {
    const page = await newE2EPage();
    await page.setContent(
      `<gx-image-annotations trace-color="green"></gx-image-annotations>`
    );
    const annotationHandle = await page.$("gx-image-annotations");
    const boundingBox = await annotationHandle.boundingBox();
    const x = boundingBox.x + boundingBox.width / 2;
    const y = boundingBox.y + boundingBox.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + 200, y);
    await page.mouse.up();
    const results = await page.compareScreenshot();
    expect(results).toMatchScreenshot();
  });
  it("still drawing after the first draw using mousemove event", async () => {
    const page = await newE2EPage();
    await page.setContent(
      `<gx-image-annotations trace-color="green"></gx-image-annotations>`
    );
    const annotationHandle = await page.$("gx-image-annotations");
    const boundingBox = await annotationHandle.boundingBox();
    const x = boundingBox.x + boundingBox.width / 2;
    const y = boundingBox.y + boundingBox.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + 200, y);
    await page.mouse.up();
    await page.mouse.move(x + 200, y);
    await page.mouse.down();
    await page.mouse.move(x + 400, y + 200);
    await page.mouse.up();
    const results = await page.compareScreenshot();
    expect(results).toMatchScreenshot();
  });
});
