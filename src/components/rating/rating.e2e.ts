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

  it("should be drawn w/o attrs", async () => {
    expect(element).toBeTruthy();
    expect(await element.find(".svgContainer.rating")).toBeTruthy();
  });

  it("should be in score mode when readonly attr is true", async () => {
    element.setAttribute("readonly", "true");
    element.setAttribute("max-value", "5");
    element.setAttribute("value", "5");
    await page.waitForChanges();
    expect(await element.find(".svgContainer.score")).toBeTruthy();
  });

  it("should has the correct number of stars when it's showing a rating", async () => {
    element.setAttribute("readonly", "true");
    element.setAttribute("max-value", "5");
    element.setAttribute("value", "4");
    await page.waitForChanges();
    const starsShowing = await element.findAll(".score.active");
    expect(starsShowing.length).toEqual(4);
  });

  it("should trigger input event when click in a star", async () => {
    const spy = await element.spyOnEvent("input");
    await page.click("svg.rating:nth-child(4)");
    await page.waitForChanges();
    const inputRange = await element.find("input");
    expect(await inputRange.getProperty("value")).toEqual("4");
    expect(spy).toHaveReceivedEvent();
  });
});
