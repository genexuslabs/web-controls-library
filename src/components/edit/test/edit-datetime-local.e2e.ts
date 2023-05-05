import { runAlignmentTest } from "../../../../tests/alignment";
import { Edit } from "../../../../tests/templates";
import { dummyTest, runningScreenshotTests } from "../../../../tests/utils";

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
  const SHORT_DATE = "1900-10-10T10:11:12";

  // + + + + + + + + + + + + + + + +
  //      type="datetime-local"
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
        type: "datetime-local",
        value: SHORT_DATE
      }),
      "Edit",
      "type='datetime-local'",
      "DatetimeLocal",
      settings.options
    );

    runAlignmentTest(
      Edit({
        autoGrow: settings.autoGrow,
        disabled: true,
        format: "Text",
        type: "datetime-local",
        value: SHORT_DATE
      }),
      "Edit",
      "type='datetime-local', disabled",
      "DatetimeLocal_Disabled",
      settings.options
    );

    runAlignmentTest(
      Edit({
        autoGrow: settings.autoGrow,
        format: "Text",
        readonly: true,
        type: "datetime-local",
        value: SHORT_DATE
      }),
      "Edit",
      "type='datetime-local', readonly",
      "DatetimeLocal_Readonly",
      settings.options
    );

    runAlignmentTest(
      Edit({
        autoGrow: settings.autoGrow,
        disabled: true,
        format: "Text",
        readonly: true,
        type: "datetime-local",
        value: SHORT_DATE
      }),
      "Edit",
      "type='datetime-local', readonly, disabled",
      "DatetimeLocal_Readonly_Disabled",
      settings.options
    );
  }
});
