import { runAlignmentTest } from "../../../../../../tests/alignment";
import { Edit } from "../../../../../../tests/templates";

describe("gx-edit", () => {
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
  const SHORT_NUMBER = "1989";

  // + + + + + + + + + + + + + + + +
  //          type="number"
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
        type: "number",
        value: SHORT_NUMBER
      }),
      "Edit",
      "type='number'",
      "Number",
      settings.options
    );

    runAlignmentTest(
      Edit({
        autoGrow: settings.autoGrow,
        disabled: true,
        format: "Text",
        type: "number",
        value: SHORT_NUMBER
      }),
      "Edit",
      "type='number', disabled",
      "Number_Disabled",
      settings.options
    );
  }
});
