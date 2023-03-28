import { runAlignmentTest } from "../../../../tests/alignment";
import { Button, SHORT_TEXT } from "../../../../tests/templates";

describe("gx-button", () => {
  const alignmentTestOptionsValign = {
    autoGrow: [false],
    shouldTestAlign: false,
    shouldTestVAlign: true
  };

  // + + + + + + + + + + + + + + + +
  //             HEIGHT
  // + + + + + + + + + + + + + + + +
  // - - - - - - - - Caption - - - - - - - -
  runAlignmentTest(
    Button({
      caption: SHORT_TEXT,
      disabled: false,
      showMainImage: false,
      showDisabledImage: false,
      height: "77px"
    }),
    "Button",
    "caption, h=77",
    "Caption_Height77px",
    alignmentTestOptionsValign
  );

  runAlignmentTest(
    Button({
      caption: SHORT_TEXT,
      disabled: true,
      showMainImage: false,
      showDisabledImage: false,
      height: "77px"
    }),
    "Button",
    "caption, h=77, disabled",
    "Caption_Height77px_Disabled",
    alignmentTestOptionsValign
  );

  // - - - - - - - - Image - - - - - - - -
  runAlignmentTest(
    Button({
      caption: "",
      disabled: false,
      showMainImage: true,
      showDisabledImage: true,
      height: "77px"
    }),
    "Button",
    "h=77, images",
    "Height77px_Image",
    alignmentTestOptionsValign
  );

  runAlignmentTest(
    Button({
      caption: "",
      disabled: true,
      showMainImage: true,
      showDisabledImage: true,
      height: "77px"
    }),
    "Button",
    "h=77, images, disabled",
    "Height77px_Image_Disabled",
    alignmentTestOptionsValign
  );

  // - - - - - - - - Caption and Image - - - - - - - -
  runAlignmentTest(
    Button({
      caption: SHORT_TEXT,
      disabled: false,
      showMainImage: true,
      showDisabledImage: true,
      height: "77px"
    }),
    "Button",
    "caption, h=77, images",
    "Caption_Height77px_Image",
    alignmentTestOptionsValign
  );

  runAlignmentTest(
    Button({
      caption: SHORT_TEXT,
      disabled: true,
      showMainImage: true,
      showDisabledImage: true,
      height: "77px"
    }),
    "Button",
    "caption, h=77, images, disabled",
    "Caption_Height77px_Image_Disabled",
    alignmentTestOptionsValign
  );
});
