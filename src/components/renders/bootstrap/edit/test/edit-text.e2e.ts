import { runAlignmentTest } from "../../../../../../tests/alignment";
import {
  Edit,
  LINE_CLAMP_DELAY,
  LONG_TEXT,
  MEDIUM_TEXT,
  SHORT_TEXT
} from "../../../../../../tests/templates";

describe("gx-edit", () => {
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
  const alignmentTestOptionsAutoGrow = {
    autoGrow: [true],
    shouldTestAlign: true,
    shouldTestVAlign: true
  };

  // + + + + + + + + + + + + + + + +
  //           type="text"
  // + + + + + + + + + + + + + + + +
  const tests = [
    { autoGrow: false, options: alignmentTestOptions },
    { autoGrow: true, options: alignmentTestOptionsAutoGrow }
  ];

  for (const settings of tests) {
    runAlignmentTest(
      Edit({
        autoGrow: settings.autoGrow,
        format: "Text",
        type: "text",
        value: SHORT_TEXT
      }),
      "Edit",
      "short, type='text'",
      "Text_SHORT",
      settings.options
    );

    runAlignmentTest(
      Edit({
        autoGrow: settings.autoGrow,
        disabled: true,
        format: "Text",
        type: "text",
        value: SHORT_TEXT
      }),
      "Edit",
      "short, type='text', disabled",
      "Text_SHORT_Disabled",
      settings.options
    );

    runAlignmentTest(
      Edit({
        autoGrow: settings.autoGrow,
        format: "Text",
        readonly: true,
        type: "text",
        value: MEDIUM_TEXT
      }),
      "Edit",
      "short, type='text', readonly",
      "Text_MEDIUM_Readonly",
      settings.options
    );

    runAlignmentTest(
      Edit({
        autoGrow: settings.autoGrow,
        disabled: true,
        format: "Text",
        readonly: true,
        type: "text",
        value: MEDIUM_TEXT
      }),
      "Edit",
      "short, type='text', readonly, disabled",
      "Text_MEDIUM_Readonly_Disabled",
      settings.options
    );
  }

  // LONG
  runAlignmentTest(
    Edit({
      autoGrow: false,
      format: "Text",
      readonly: true,
      type: "text",
      value: LONG_TEXT
    }),
    "Edit",
    "long, type='text', readonly",
    "Text_LONG_Readonly",
    alignmentTestOptionsDelay
  );

  // LONG
  runAlignmentTest(
    Edit({
      autoGrow: false,
      disabled: true,
      format: "Text",
      readonly: true,
      type: "text",
      value: LONG_TEXT
    }),
    "Edit",
    "long, type='text', readonly, disabled",
    "Text_LONG_Readonly_Disabled",
    alignmentTestOptionsDelay
  );

  // LONG
  runAlignmentTest(
    Edit({
      autoGrow: true,
      format: "Text",
      readonly: true,
      type: "text",
      value: LONG_TEXT
    }),
    "Edit",
    "long, type='text', readonly",
    "Text_LONG_Readonly",
    alignmentTestOptionsAutoGrow
  );

  // LONG
  runAlignmentTest(
    Edit({
      autoGrow: true,
      disabled: true,
      format: "Text",
      readonly: true,
      type: "text",
      value: LONG_TEXT
    }),
    "Edit",
    "long, type='text', readonly, disabled",
    "Text_LONG_Readonly_Disabled",
    alignmentTestOptionsAutoGrow
  );
});
