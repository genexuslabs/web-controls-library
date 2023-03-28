import { runAlignmentTest } from "../../../../../../tests/alignment";
import { Edit, LONG_HTML, SHORT_HTML } from "../../../../../../tests/templates";

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

  // + + + + + + + + + + + + + + + +
  //          format="HTML"
  // + + + + + + + + + + + + + + + +
  const tests = [
    { autoGrow: false, options: alignmentTestOptions },
    { autoGrow: true, options: alignmentTestOptionsAutoGrow }
  ];

  for (const settings of tests) {
    runAlignmentTest(
      Edit({
        autoGrow: settings.autoGrow,
        format: "HTML",
        type: undefined,
        value: SHORT_HTML
      }),
      "Edit",
      "short, format='html'",
      "HTML_SHORT",
      settings.options
    );

    runAlignmentTest(
      Edit({
        autoGrow: settings.autoGrow,
        disabled: true,
        format: "HTML",
        type: undefined,
        value: SHORT_HTML
      }),
      "Edit",
      "short, format='html', disabled",
      "HTML_SHORT_Disabled",
      settings.options
    );

    runAlignmentTest(
      Edit({
        autoGrow: settings.autoGrow,
        format: "HTML",
        readonly: true,
        type: undefined,
        value: SHORT_HTML
      }),
      "Edit",
      "short, format='html', readonly",
      "HTML_SHORT_Readonly",
      settings.options
    );

    runAlignmentTest(
      Edit({
        autoGrow: settings.autoGrow,
        disabled: true,
        format: "HTML",
        readonly: true,
        type: undefined,
        value: SHORT_HTML
      }),
      "Edit",
      "short, format='html', readonly, disabled",
      "HTML_SHORT_Readonly_Disabled",
      settings.options
    );

    // LONG
    runAlignmentTest(
      Edit({
        autoGrow: settings.autoGrow,
        format: "HTML",
        type: undefined,
        value: LONG_HTML
      }),
      "Edit",
      "long, format='html'",
      "HTML_LONG",
      settings.options
    );

    // LONG
    runAlignmentTest(
      Edit({
        autoGrow: settings.autoGrow,
        disabled: true,
        format: "HTML",
        type: undefined,
        value: LONG_HTML
      }),
      "Edit",
      "long, format='html', disabled",
      "HTML_LONG_Disabled",
      settings.options
    );

    // LONG
    runAlignmentTest(
      Edit({
        autoGrow: settings.autoGrow,
        format: "HTML",
        readonly: true,
        type: undefined,
        value: LONG_HTML
      }),
      "Edit",
      "long, format='html', readonly",
      "HTML_LONG_Readonly",
      settings.options
    );

    // LONG
    runAlignmentTest(
      Edit({
        autoGrow: settings.autoGrow,
        disabled: true,
        format: "HTML",
        readonly: true,
        type: undefined,
        value: LONG_HTML
      }),
      "Edit",
      "long, format='html', readonly, disabled",
      "HTML_LONG_Readonly_Disabled",
      settings.options
    );
  }
});
