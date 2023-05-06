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

  // it("should be drawn without attributes and should have the main div with 'rating' class", async () => {
  //   expect(element).toBeTruthy();
  //   expect(await element.find(".rating")).toBeTruthy();
  // });

  // it("should have the main div with 'score' class when readonly attribute is true", async () => {
  //   element.setAttribute("readonly", "true");
  //   element.setAttribute("max-value", "5");
  //   element.setAttribute("value", "5");
  //   await page.waitForChanges();
  //   const svgContainer = await element.find(".score");
  //   expect(svgContainer).toBeTruthy();
  // });

  // it("should have the correct number of stars when showing a score", async () => {
  //   element.setAttribute("max-value", "5");
  //   element.setAttribute("value", "4");
  //   await page.waitForChanges();
  //   console.log(page);

  //   let starsShowing = await page.findAll(selectedStarSelector);
  //   console.log(starsShowing);

  //   expect(starsShowing.length).toEqual(4);

  //   element.setAttribute("max-value", "50");
  //   element.setAttribute("value", "28");
  //   await page.waitForChanges();
  //   starsShowing = await element.findAll(selectedStarSelector);
  //   expect(starsShowing.length).toEqual(3);

  //   const inputRange = await element.find("input");
  //   expect(await inputRange.getProperty("value")).toEqual("28");
  // });

  // it("should trigger input event when click in a star", async () => {
  //   const spy = await element.spyOnEvent("input");
  //   await page.click(`${selectedStarSelector}:nth-child(4)`);
  //   await page.waitForChanges();

  //   const inputRange = await element.find("input");
  //   expect(await inputRange.getProperty("value")).toEqual("4");
  //   expect(spy).toHaveReceivedEvent();
  // });

  // it("should recieve the correct parameter when click in a star", async () => {
  //   const spy = await element.spyOnEvent("input");
  //   await page.click("svg.rating:nth-child(3)");
  //   await page.waitForChanges();
  //   const inputRange = await element.find("input");
  //   expect(await inputRange.getProperty("value")).toEqual("3");
  //   expect(spy).toHaveReceivedEvent();
  //   const componentObject = {
  //     input: {},
  //     inputId: "gx-inputRange-auto-id-0",
  //     invisibleMode: "collapse",
  //     readonly: false,
  //     starShape: {
  //       $elm$: { "s-hn": "gx-rating" },
  //       $attrs$: { points: "50,0 15,95 100,35 0,35 85,95" },
  //       $children$: null,
  //       $tag$: "polygon"
  //     },
  //     svgViewport: { viewBox: "0 0 100 100" },
  //     value: 3
  //   };
  //   expect(spy).toHaveReceivedEventDetail(componentObject);
  // });

  it("should retun the correct input Id when it is not defined in the control", async () => {
    element.setAttribute("Id", "idTest");
    await page.waitForChanges();
    const inputId = await element.callMethod("getNativeInputId");
    expect(inputId).toEqual("gx-rating-auto-id-0");
  });

  it("should retun the correct input Id when it is defined in the control", async () => {
    page = await newE2EPage();
    await page.setContent("<gx-rating id='idTest'></gx-rating>");
    await page.waitForChanges();
    element = await page.find("gx-rating");
    const inputId = await element.callMethod("getNativeInputId");
    expect(inputId).toEqual("idTest_rating");
  });
});
