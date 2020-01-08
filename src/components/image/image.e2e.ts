import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";

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

  it("should set the inner image class", async () => {
    await element.setAttribute("css-class", "danger");
    await page.waitForChanges();
    const img = await page.find("img");
    const className: string = await img.getProperty("className");
    expect(className.includes("danger")).toBe(true);
  });

  it("should add gx-img-no-auto-grow class", async () => {
    expect(element.classList.contains("gx-img-no-auto-grow")).toBe(false);
    await element.setProperty("autoGrow", false);
    await page.waitForChanges();
    expect(element.classList.contains("gx-img-no-auto-grow")).toBe(true);
  });

  it("should fire click event", async () => {
    const spy = await element.spyOnEvent("click");
    const img = await page.find("img");
    await img.click();
    expect(spy).toHaveReceivedEvent();
  });

  it("should not render when src is empty", async () => {
    let isHidden = await element.getProperty("hidden");
    expect(isHidden).toBe(false);

    await element.setAttribute("src", "");
    await page.waitForChanges();
    isHidden = await element.getProperty("hidden");

    expect(isHidden).toBe(true);
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
