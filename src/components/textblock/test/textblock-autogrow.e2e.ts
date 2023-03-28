import { runAlignmentTest } from "../../../../tests/alignment";
import {
  LONG_TEXT,
  MEDIUM_TEXT,
  SHORT_HTML,
  TextBlock
} from "../../../../tests/templates";

describe("gx-textblock", () => {
  const alignmentTestOptionsAutoGrow = {
    autoGrow: [true],
    shouldTestAlign: true,
    shouldTestVAlign: true
  };

  // - - - - - - - - AutoGrow = TRUE - - - - - - - -
  runAlignmentTest(
    TextBlock({ autoGrow: true, caption: SHORT_HTML, format: "HTML" }),
    "TextBlock",
    "short, format='HTML'",
    "HTML_SHORT",
    alignmentTestOptionsAutoGrow
  );

  runAlignmentTest(
    TextBlock({ autoGrow: true, caption: SHORT_HTML, format: "HTML" }),
    "TextBlock",
    "short, format='HTML', disabled",
    "HTML_SHORT_Disabled",
    alignmentTestOptionsAutoGrow
  );

  runAlignmentTest(
    TextBlock({ autoGrow: true, caption: MEDIUM_TEXT, format: "Text" }),
    "TextBlock",
    "short, format='Text'",
    "Text_MEDIUM",
    alignmentTestOptionsAutoGrow
  );

  runAlignmentTest(
    TextBlock({ autoGrow: true, caption: MEDIUM_TEXT, format: "Text" }),
    "TextBlock",
    "short, format='Text', disabled",
    "Text_MEDIUM_Disabled",
    alignmentTestOptionsAutoGrow
  );

  runAlignmentTest(
    TextBlock({ autoGrow: true, caption: LONG_TEXT, format: "Text" }),
    "TextBlock",
    "long, format='Text'",
    "Text_LONG",
    alignmentTestOptionsAutoGrow
  );

  runAlignmentTest(
    TextBlock({ autoGrow: true, caption: LONG_TEXT, format: "Text" }),
    "TextBlock",
    "long, format='Text', disabled",
    "Text_LONG_Disabled",
    alignmentTestOptionsAutoGrow
  );
});
