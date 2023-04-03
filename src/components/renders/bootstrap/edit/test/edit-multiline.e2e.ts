import { runAlignmentTest } from "../../../../../../tests/alignment";
import { Edit, LONG_TEXT, SHORT_TEXT } from "../../../../../../tests/templates";
import {
  dummyTest,
  runningScreenshotTests
} from "../../../../../../tests/utils";

describe("gx-edit", () => {
  if (!runningScreenshotTests()) {
    dummyTest();

    return;
  }

  const alignmentTestOptions = {
    autoGrow: [false],
    shouldTestAlign: true,
    shouldTestVAlign: true
  };
  const alignmentTestOptionsAutoGrow = {
    autoGrow: [true],
    shouldTestAlign: true,
    shouldTestVAlign: true
  };

  // + + + + + + + + + + + + + + + +
  //            multiline
  // + + + + + + + + + + + + + + + +
  const tests = [
    { autoGrow: false, options: alignmentTestOptions },
    { autoGrow: true, options: alignmentTestOptionsAutoGrow }
  ];

  // We do not add readonly test, because they are in the edit-text.e2e.ts file
  // and the readonly property only varies its behavior when the format
  // property changes
  for (const settings of tests) {
    runAlignmentTest(
      Edit({
        autoGrow: settings.autoGrow,
        format: "Text",
        multiline: true,
        type: "text",
        value: SHORT_TEXT
      }),
      "Edit",
      "short, multiline",
      "Text_SHORT_Multiline",
      settings.options
    );

    runAlignmentTest(
      Edit({
        autoGrow: settings.autoGrow,
        disabled: true,
        format: "Text",
        multiline: true,
        type: "text",
        value: SHORT_TEXT
      }),
      "Edit",
      "short, multiline, disabled",
      "Text_SHORT_Multiline_Disabled",
      settings.options
    );

    // LONG
    runAlignmentTest(
      Edit({
        autoGrow: settings.autoGrow,
        format: "Text",
        multiline: true,
        type: "text",
        value: LONG_TEXT
      }),
      "Edit",
      "long, multiline",
      "Text_LONG_Multiline",
      settings.options
    );

    // LONG
    runAlignmentTest(
      Edit({
        autoGrow: settings.autoGrow,
        disabled: true,
        format: "Text",
        multiline: true,
        type: "text",
        value: LONG_TEXT
      }),
      "Edit",
      "long, multiline, disabled",
      "Text_LONG_Multiline_Disabled",
      settings.options
    );
  }
});
