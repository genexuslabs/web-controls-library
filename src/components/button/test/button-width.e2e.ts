import { runAlignmentTest } from "../../../../tests/alignment";
import { Button, SHORT_TEXT } from "../../../../tests/templates";

describe("gx-button", () => {
  const alignmentTestOptionsAlign = {
    autoGrow: [false],
    shouldTestAlign: true,
    shouldTestVAlign: false
  };

  // + + + + + + + + + + + + + + + +
  //              WIDTH
  // + + + + + + + + + + + + + + + +
  // - - - - - - - - Caption - - - - - - - -
  runAlignmentTest(
    Button({
      caption: SHORT_TEXT,
      disabled: false,
      showMainImage: false,
      showDisabledImage: false,
      width: "100px"
    }),
    "Button",
    "caption, w=100",
    "Caption_Width100px",
    alignmentTestOptionsAlign
  );

  runAlignmentTest(
    Button({
      caption: SHORT_TEXT,
      disabled: true,
      showMainImage: false,
      showDisabledImage: false,
      width: "100px"
    }),
    "Button",
    "caption, w=100, disabled",
    "Caption_Width100px_Disabled",
    alignmentTestOptionsAlign
  );

  // - - - - - - - - Image - - - - - - - -
  runAlignmentTest(
    Button({
      caption: "",
      disabled: false,
      showMainImage: true,
      showDisabledImage: true,
      width: "100px"
    }),
    "Button",
    "w=100, images",
    "Width100px_Image",
    alignmentTestOptionsAlign
  );

  runAlignmentTest(
    Button({
      caption: "",
      disabled: true,
      showMainImage: true,
      showDisabledImage: true,
      width: "100px"
    }),
    "Button",
    "w=100, images, disabled",
    "Width100px_Image_Disabled",
    alignmentTestOptionsAlign
  );

  // - - - - - - - - Caption and Image - - - - - - - -
  runAlignmentTest(
    Button({
      caption: SHORT_TEXT,
      disabled: false,
      showMainImage: true,
      showDisabledImage: true,
      width: "100px"
    }),
    "Button",
    "caption, w=100, images",
    "Caption_Width100px_Image",
    alignmentTestOptionsAlign
  );

  runAlignmentTest(
    Button({
      caption: SHORT_TEXT,
      disabled: true,
      showMainImage: true,
      showDisabledImage: true,
      width: "100px"
    }),
    "Button",
    "caption, w=100, images, disabled",
    "Caption_Width100px_Image_Disabled",
    alignmentTestOptionsAlign
  );
});
