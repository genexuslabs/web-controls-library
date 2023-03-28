import { newE2EPage, E2EElement, E2EPage } from "@stencil/core/testing";
import { cleanMeasureUnit } from "./utils";

describe("gx-grid-image-map", () => {
  let element: E2EElement;
  let page: E2EPage;

  const src = "https://i.ibb.co/pPgZrLt/image-2021-12-01-14-07-01.png";

  beforeEach(async () => {
    page = await newE2EPage();
  });

  it("renders", async () => {
    await page.setContent(
      `<gx-grid-image-map src='${src}'></gx-grid-image-map>`
    );
    await page.waitForChanges();
    element = await page.find("gx-grid-image-map");
    await page.waitForChanges();
    expect(element).toHaveClass("hydrated");
  });

  it("set background image", async () => {
    await page.setContent(
      `<gx-grid-image-map src='${src}'></gx-grid-image-map>`
    );
    await page.waitForChanges();

    const backgroundImage = await page.find(".gx-image-map-container>img");
    await page.waitForChanges();

    // Checks if background is set to img tag
    expect(backgroundImage.outerHTML).toContain(src);
  });

  it("trigger gxZoom event", async () => {
    await page.setContent(
      `<gx-grid-image-map src='${src}'></gx-grid-image-map>`
    );

    const gxZoom = await page.spyOnEvent("gxZoom");

    element = await page.find("gx-grid-image-map");

    element.triggerEvent("wheel");
    await page.waitForChanges();
    expect(gxZoom).toHaveReceivedEvent();
  });

  it("show tooltip when tooltip-text property is set and mouse is over", async () => {
    let tooltip: E2EElement = null;
    await page.setContent(
      `<gx-grid-image-map src='${src}' tooltip-text="Example"></gx-grid-image-map>`
    );
    await page.waitForChanges();
    element = await page.find("gx-grid-image-map");
    await element.hover();
    tooltip = await page.find(".tooltip-text");
    const visible = await tooltip.isVisible();
    expect(visible).toBe(true);
  });

  it("do not show tooltip by default", async () => {
    let tooltip: E2EElement = null;
    await page.setContent(
      `<gx-grid-image-map src='${src}'></gx-grid-image-map>`
    );
    element = await page.find("gx-grid-image-map");
    await element.hover();
    tooltip = await page.find(".tooltip-text");
    expect(tooltip).toBeNull();
  });

  it("remove tooltip after zoom", async () => {
    let tooltip: E2EElement = null;
    await page.setContent(
      `<gx-grid-image-map src='${src}' tooltip-text="Example"></gx-grid-image-map>`
    );
    await page.waitForChanges();
    element = await page.find("gx-grid-image-map");
    tooltip = await page.find(".tooltip-text");
    expect(tooltip).toBeDefined();
    element.triggerEvent("wheel");
    await page.waitForChanges();
    expect(await page.find(".tooltip-text")).toBeFalsy();
  });

  it("gx-grid-image-map stretches to the width of the parent", async () => {
    const parentWidth = 300;

    await page.setContent(
      `<div style="width:${parentWidth}px">
        <gx-grid-image-map src='${src}'>
        </gx-grid-image-map>
      </div>`
    );
    element = await page.find("gx-grid-image-map");
    await page.waitForChanges();

    const componentWidth = Number(
      cleanMeasureUnit((await element.getComputedStyle()).width)
    );

    expect(componentWidth).toEqual(parentWidth);
  });
});
