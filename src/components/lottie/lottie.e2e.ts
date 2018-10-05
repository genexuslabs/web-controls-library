import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";
import { animationData } from "./test-animation";

describe("gx-lottie", () => {
  let element: E2EElement;
  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(`<gx-lottie></gx-lottie>`);
    element = await page.find("gx-lottie");
  });

  it("should load an animation", async () => {
    const spy = await element.spyOnEvent("animationLoad");
    await element.setProperty("animationData", animationData);
    await page.waitForChanges();
    expect(spy).toHaveReceivedEvent();
  });
});
