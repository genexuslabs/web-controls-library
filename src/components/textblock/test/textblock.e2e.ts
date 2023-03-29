import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";
import { runAlignmentTest } from "../../../../tests/alignment";
import {
  LINE_CLAMP_DELAY,
  LONG_TEXT,
  MEDIUM_TEXT,
  SHORT_HTML,
  TextBlock
} from "../../../../tests/templates";
import { runningScreenshotTests } from "../../../../tests/utils";

describe("gx-textblock", () => {
  let element: E2EElement;
  let page: E2EPage;

  const alignmentTestOptions = {
    autoGrow: [false],
    shouldTestAlign: true,
    shouldTestVAlign: true
  };
  const alignmentTestOptionsDelay = {
    autoGrow: [false],
    shouldTestAlign: true,
    shouldTestVAlign: true,
    delayToTakeScreenshot: LINE_CLAMP_DELAY
  };

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent("<gx-textblock>Hello world!</gx-textblock>");
    element = await page.find("gx-textblock");
  });

  it("should work without parameters", () => {
    expect(element.textContent.trim()).toEqual("Hello world!");
  });

  if (!runningScreenshotTests()) {
    return;
  }

  // - - - - - - - - AutoGrow = FALSE - - - - - - - -
  runAlignmentTest(
    TextBlock({ autoGrow: false, caption: SHORT_HTML, format: "HTML" }),
    "TextBlock",
    'short, format="HTML"',
    "HTML_SHORT",
    alignmentTestOptions
  );

  runAlignmentTest(
    TextBlock({ autoGrow: false, caption: SHORT_HTML, format: "HTML" }),
    "TextBlock",
    'short, format="HTML", disabled',
    "HTML_SHORT_Disabled",
    alignmentTestOptions
  );

  runAlignmentTest(
    TextBlock({ autoGrow: false, caption: MEDIUM_TEXT, format: "Text" }),
    "TextBlock",
    'short, format="Text"',
    "Text_MEDIUM",
    alignmentTestOptions
  );

  runAlignmentTest(
    TextBlock({ autoGrow: false, caption: MEDIUM_TEXT, format: "Text" }),
    "TextBlock",
    'short, format="Text", disabled',
    "Text_MEDIUM_Disabled",
    alignmentTestOptions
  );

  runAlignmentTest(
    TextBlock({ autoGrow: false, caption: LONG_TEXT, format: "Text" }),
    "TextBlock",
    'long, format="Text"',
    "Text_LONG",
    alignmentTestOptionsDelay
  );

  runAlignmentTest(
    TextBlock({ autoGrow: false, caption: LONG_TEXT, format: "Text" }),
    "TextBlock",
    'long, format="Text", disabled',
    "Text_LONG_Disabled",
    alignmentTestOptionsDelay
  );
});
