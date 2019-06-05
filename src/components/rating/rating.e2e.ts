import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";

describe("gx-rating", () => {
  let element: E2EElement;
  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent("<gx-rating></gx-rating>");
    await page.waitForChanges();
    element = await page.find("gx-rating");
  });

  it("should be drawn without attributes and should be in 'rating mode'", async () => {
    expect(element).toBeTruthy();
    expect(await element.find(".svgContainer.rating")).toBeTruthy();
  });

  it("should be in 'score mode' when readonly attribute is true", async () => {
    element.setAttribute("readonly", "true");
    element.setAttribute("max-value", "5");
    element.setAttribute("value", "5");
    await page.waitForChanges();
    const svgContainer = await element.find(".svgContainer.score");
    expect(svgContainer).toBeTruthy();
  });

  it("should have the correct number of stars when showing a score", async () => {
    element.setAttribute("readonly", "true");
    element.setAttribute("max-value", "5");
    element.setAttribute("value", "4");
    await page.waitForChanges();
    let starsShowing = await element.findAll(".score.active");
    expect(starsShowing.length).toEqual(4);
    element.setAttribute("max-value", "50");
    element.setAttribute("value", "28");
    await page.waitForChanges();
    starsShowing = await element.findAll(".score.active");
    expect(starsShowing.length).toEqual(3);
    const inputRange = await element.find("input");
    expect(await inputRange.getProperty("value")).toEqual("28");
  });

  it("should trigger input event when click in a star", async () => {
    const spy = await element.spyOnEvent("input");
    await page.click("svg.rating:nth-child(4)");
    await page.waitForChanges();
    const inputRange = await element.find("input");
    expect(await inputRange.getProperty("value")).toEqual("4");
    expect(spy).toHaveReceivedEvent();
  });

  it("should recieve the correct parameter when click in a star", async () => {
    const spy = await element.spyOnEvent("input");
    await page.click("svg.rating:nth-child(3)");
    await page.waitForChanges();
    const inputRange = await element.find("input");
    expect(await inputRange.getProperty("value")).toEqual("3");
    expect(spy).toHaveReceivedEvent();
    const componentObject = {
      disabled: false,
      input: {},
      invisibleMode: "collapse",
      ratingScore: 3,
      readonly: false,
      value: 0
    };
    expect(spy).toHaveReceivedEventDetail(componentObject);
  });
});
