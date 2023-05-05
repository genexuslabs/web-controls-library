import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";
import { runAlignmentTest } from "../../../../../../tests/alignment";
import { RadioGroup } from "../../../../../../tests/templates";
import { runningScreenshotTests } from "../../../../../../tests/utils";

describe("gx-radio-option", () => {
  let element: E2EElement;
  let page: E2EPage;
  const alignmentTestOptions = {
    autoGrow: [false],
    shouldTestAlign: true,
    shouldTestVAlign: true
  };

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(
      "<gx-radio-option caption='Label' value='foo'></gx-radio-option>"
    );
    element = await page.find("gx-radio-option");
  });

  it("should work without parameters", () => {
    expect(element.textContent.trim()).toEqual("Label");
  });

  it("should be able to read value", async () => {
    expect(await element.getProperty("value")).toEqual("foo");
  });

  it("should be able to change value", async () => {
    await element.setProperty("value", "bar");
    await page.waitForChanges();
    expect(await element.getProperty("value")).toEqual("bar");
  });

  it("should keep input and custom element values in sync", async () => {
    await element.setProperty("value", "bar");
    await page.waitForChanges();
    const input = await page.find("input");
    expect(await input.getProperty("value")).toEqual("bar");
  });

  // it("should be able to set class of inner input", async () => {
  //   element.setProperty("cssClass", "foo-class bar-class");
  //   await page.waitForChanges();
  //   expect(await page.find("input")).toHaveClass("foo-class");
  // });

  if (!runningScreenshotTests()) {
    return;
  }

  // - - - - - - - Vertical direction - - - - - - -
  runAlignmentTest(
    RadioGroup({ direction: "vertical" }),
    "RadioGroup",
    "direction='vertical'",
    "Vertical",
    alignmentTestOptions
  );

  runAlignmentTest(
    RadioGroup({ direction: "vertical", readonly: true }),
    "RadioGroup",
    "direction='vertical', readonly",
    "Vertical_Readonly",
    alignmentTestOptions
  );

  runAlignmentTest(
    RadioGroup({ direction: "vertical", disabled: true }),
    "RadioGroup",
    "direction='vertical', disabled",
    "Vertical_Disabled",
    alignmentTestOptions
  );

  runAlignmentTest(
    RadioGroup({ direction: "vertical", disabled: true, readonly: true }),
    "RadioGroup",
    "direction='vertical', readonly, disabled",
    "Vertical_Readonly_Disabled",
    alignmentTestOptions
  );

  // - - - - - - - Horizontal direction - - - - - - -
  runAlignmentTest(
    RadioGroup({ direction: "horizontal" }),
    "RadioGroup",
    "direction='horizontal'",
    "Horizontal",
    alignmentTestOptions
  );

  runAlignmentTest(
    RadioGroup({ direction: "horizontal", readonly: true }),
    "RadioGroup",
    "direction='horizontal', readonly",
    "Horizontal_Readonly",
    alignmentTestOptions
  );

  runAlignmentTest(
    RadioGroup({ direction: "horizontal", disabled: true }),
    "RadioGroup",
    "direction='horizontal', disabled",
    "Horizontal_Disabled",
    alignmentTestOptions
  );

  runAlignmentTest(
    RadioGroup({ direction: "horizontal", disabled: true, readonly: true }),
    "RadioGroup",
    "direction='horizontal', readonly, disabled",
    "Horizontal_Readonly_Disabled",
    alignmentTestOptions
  );
});
