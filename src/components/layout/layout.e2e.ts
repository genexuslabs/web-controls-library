import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";

const VERTICAL_TARGETS_BREAKPOINT = 1200;

describe("gx-layout", () => {
  let element: E2EElement;
  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(`
    <gx-layout>
      <div slot="top">Top</div>
      <div slot="right">Right</div>
      <div slot="bottom">Bottom</div>
      <div slot="left">Left</div>
      <div slot>Center</div>
    </gx-layout>`);
    element = await page.find("gx-layout");
  });

  it("should work without parameters", () => {
    expect(element.textContent.trim().replace(/\s/g, "")).toEqual(
      "CenterTopLeftRightBottom"
    );
  });

  it("should set 'hidden' property in hidden targets", async () => {
    const targets = [
      ["topHidden", ".top"],
      ["rightHidden", ".right"],
      ["bottomHidden", ".bottom"],
      ["leftHidden", ".left"]
    ];

    for (const [prop, targetElementSelector] of targets) {
      element.setProperty(prop, true);
      await page.waitForChanges();

      const targetElement = await element.find(targetElementSelector);
      expect(await targetElement.getProperty("hidden")).toBe(true);
    }
  });

  it("should emit left and right hidden change event", async () => {
    const leftHiddenChangeSpy = await element.spyOnEvent("leftHiddenChange");
    const rightHiddenChangeSpy = await element.spyOnEvent("rightHiddenChange");
    element.setProperty("leftHidden", true);
    element.setProperty("rightHidden", true);
    await page.waitForChanges();

    expect(leftHiddenChangeSpy).toHaveReceivedEventDetail(true);
    expect(rightHiddenChangeSpy).toHaveReceivedEventDetail(true);
  });

  it("should emit verticalTargetsBreakpointMatchChange event", async () => {
    await page.setViewport({
      width: VERTICAL_TARGETS_BREAKPOINT + 1,
      height: 768
    });
    await page.waitForChanges();

    const spy = await element.spyOnEvent(
      "verticalTargetsBreakpointMatchChange"
    );

    await page.setViewport({
      width: VERTICAL_TARGETS_BREAKPOINT - 1,
      height: 768
    });
    await page.waitForChanges();

    expect(spy).toHaveReceivedEventDetail({ matches: true });

    await page.setViewport({
      width: VERTICAL_TARGETS_BREAKPOINT + 1,
      height: 768
    });
    await page.waitForChanges();

    expect(spy).toHaveReceivedEventDetail({ matches: false });
  });
});
