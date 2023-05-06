import { newE2EPage } from "@stencil/core/testing";
import { runAlignmentTest } from "../../../../tests/alignment";
import { Button, SHORT_TEXT } from "../../../../tests/templates";
import { runningScreenshotTests } from "../../../../tests/utils";

describe("gx-button", () => {
  const alignmentTestOptions = {
    autoGrow: [false],
    shouldTestAlign: true,
    shouldTestVAlign: true
  };

  it("renders", async () => {
    const page = await newE2EPage();

    await page.setContent("<gx-button>Hello world!</gx-button>");
    const element = await page.find("gx-button");
    expect(element).toHaveClass("hydrated");
    expect(element.textContent.trim()).toEqual("Hello world!");
  });

  // + + + + + + + + + + + + + + + +
  //        WIDTH AND HEIGHT
  // + + + + + + + + + + + + + + + +
  if (!runningScreenshotTests()) {
    return;
  }

  // - - - - - - - - Caption - - - - - - - -
  runAlignmentTest(
    Button({
      caption: SHORT_TEXT,
      disabled: false,
      showMainImage: false,
      showDisabledImage: false,
      width: "100px",
      height: "77px"
    }),
    "Button",
    "caption, w=100, h=77",
    "Caption_Width100px_Height77px",
    alignmentTestOptions
  );

  runAlignmentTest(
    Button({
      caption: SHORT_TEXT,
      disabled: true,
      showMainImage: false,
      showDisabledImage: false,
      width: "100px",
      height: "77px"
    }),
    "Button",
    "caption, w=100, h=77, disabled",
    "Caption_Width100px_Height77px_Disabled",
    alignmentTestOptions
  );

  // - - - - - - - - Image - - - - - - - -
  runAlignmentTest(
    Button({
      caption: "",
      disabled: false,
      showMainImage: true,
      showDisabledImage: true,
      width: "100px",
      height: "77px"
    }),
    "Button",
    "w=100, h=77, images",
    "Width100px_Height77px_Image",
    alignmentTestOptions
  );

  runAlignmentTest(
    Button({
      caption: "",
      disabled: true,
      showMainImage: true,
      showDisabledImage: true,
      width: "100px",
      height: "77px"
    }),
    "Button",
    "w=100, h=77, images, disabled",
    "Width100px_Height77px_Image_Disabled",
    alignmentTestOptions
  );

  // - - - - - - - - Caption and Image - - - - - - - -
  runAlignmentTest(
    Button({
      caption: SHORT_TEXT,
      disabled: false,
      showMainImage: true,
      showDisabledImage: true,
      width: "100px",
      height: "77px"
    }),
    "Button",
    "caption, w=100, h=77, images",
    "Caption_Width100px_Height77px_Image",
    alignmentTestOptions
  );

  runAlignmentTest(
    Button({
      caption: SHORT_TEXT,
      disabled: true,
      showMainImage: true,
      showDisabledImage: true,
      width: "100px",
      height: "77px"
    }),
    "Button",
    "caption, w=100, h=77, images, disabled",
    "Caption_Width100px_Height77px_Image_Disabled",
    alignmentTestOptions
  );
});
