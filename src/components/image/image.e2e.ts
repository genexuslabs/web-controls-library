import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";

const testImage1 =
  "data:image/x-icon;base64,AAABAAEAICAQAAEABADoAgAAFgAAACgAAAAgAAAAQAAAAAEABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYGyAAISAgAA4gMQAFKUkAATVlAABFhQAAUJgAAFamAABhuQAFZ8MACGzIAA1xzAATd9QAHYHbAAAAAAAAAAAAERERERERERERERERERERERERERERERERERERERERERERERFDERERERERERA0EREREREQWDAREREREREEpBERERERESq1IRERERECbHIREREREREFy2MREREQOLtRERERERERFKu4QhERJKu5QRERERERERKKqrUhE2yqpyEREREREREQXKqsgzi6qrURERERERERETuqqrqqqqmUEREREREREREouqqqqqqrchERERERERERBcqqqqqqrFERERERERERERO6qqqqqqkxERERERERERAmqqqqqqqqUhEREREREREEnKqqqqqqqshCERERERECbMqqqqqqqqqstSEREREQSdqqqqqqqqqqqr2EAREQJsyqqqqqqqqqqqqqzFIRJd3d3d3duqqqq93d3d3cUjdlVVVVVYuqqshVVVVVVnMRARERERBdqqvVARERERARERERERERO7u8kxEREREREREREREREQjbvXIREREREREREREREREF271RERERERERERERERERE8zKMRERERERERERERERERCN1yEREREREREREREREREQXdURERERERERERERERERET2zEREREREREREREREREREKghERERERERERERERERERFnERERERERERERERERERERMxEREREREREREREREREREREREREREREREAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==";
const testImage1Width = 32;

const testImage2 =
  "data:image/png;base64,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";
const testImage2Width = 558;

describe("gx-image", () => {
  let element: E2EElement;
  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(
      "<gx-image src='img.png' alt='Alternate text'></gx-image>"
    );
    element = await page.find("gx-image");
  });

  it("inner img should have alternate text", async () => {
    const img = await element.find("img");
    expect(await img.getProperty("alt")).toEqual(
      await element.getProperty("alt")
    );
  });

  it("should add gx-img-no-auto-grow class", async () => {
    expect(element.classList.contains("gx-img-no-auto-grow")).toBe(false);
    await element.setProperty("autoGrow", false);
    await page.waitForChanges();
    expect(element.classList.contains("gx-img-no-auto-grow")).toBe(true);
  });

  it("should set the width to match the intrinsic width of the image when autoGrow=false", async () => {
    await element.setProperty("autoGrow", false);
    await element.setProperty("src", testImage1);
    await page.waitForChanges();
    expect(await element.getProperty("width")).toEqual(`${testImage1Width}px`);

    await element.setProperty("src", testImage2);
    await page.waitForChanges();
    expect(await element.getProperty("width")).toEqual(`${testImage2Width}px`);
  });

  it("should fire click event", async () => {
    const spy = await element.spyOnEvent("click");
    const img = await page.find("img");
    await img.click();
    expect(spy).toHaveReceivedEvent();
  });
});

describe("gx-image lazy loading", () => {
  let element: E2EElement;
  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(
      "<gx-image src='img.png' alt='Alternate text' style='position: absolute; top: -3000px; left: -3000px;'></gx-image>"
    );
    element = await page.find("gx-image");
  });

  it("should load the image", async () => {
    await element.setAttribute("lazy-load", false);
    await page.waitForChanges();
    const img = await page.find("img");
    const className: string = await img.getProperty("className");
    expect(className.includes("gx-lazyload")).toBe(false);
    expect(await img.getAttribute("src")).toBe("img.png");
    expect(await element.classList.contains("gx-img-lazyloading")).toBe(false);
  });

  it("should lazy load the image", async () => {
    const img = await element.find("img");
    const className: string = await img.getProperty("className");
    expect(className.includes("gx-lazyload")).toBe(true);
    expect(await img.getAttribute("src")).toBeNull();
    expect(await img.getAttribute("data-src")).toBe("img.png");
    expect(await element.classList.contains("gx-img-lazyloading")).toBe(true);
  });
});
