import { newE2EPage, E2EPage } from "@stencil/core/testing";
import { ScreenshotOptions } from "@stencil/core/internal";
import { IMAGE_NAME_SEPARATOR } from "./templates";
import { delay } from "../src/components/common/utils";

const TEST_CONFIG: ScreenshotOptions = {
  clip: { x: 0, y: 0, width: 200, height: 256 },
  pixelmatchThreshold: 0, // 100% accuracy
};

const CELL_CONTAINERS: any[] = ["gx-table-cell", "gx-canvas-cell"];
const CELL_HEIGHTS: any[] = ["110px", "100%"];

const HORIZONTAL_ALIGNS = [
  "", // Default
  'align="left"',
  'align="center"',
  'align="right"',
  // Justify (not implemented)
];
const VERTICAL_ALIGNS = [
  "", // Default
  'valign="top"',
  'valign="middle"',
  'valign="bottom"',
];

const CELL_CONTAINERS_MAP = {
  "gx-table-cell": "Table",
  "gx-canvas-cell": "Canvas",
};
const CELL_HEIGHTS_MAP = {
  "110px": "110px",
  "100%": "100per",
};

const HORIZONTAL_ALIGNS_MAP = {
  "": "Default",
  'align="left"': "Left",
  'align="center"': "Center",
  'align="right"': "Right",
  // Justify (not implemented)
};

const HORIZONTAL_ALIGNS_WITH_NUMBER_MAP = {
  "": "0-Default",
  'align="left"': "1-Left",
  'align="center"': "2-Center",
  'align="right"': "3-Right",
  // Justify (not implemented)
};

const VERTICAL_ALIGNS_MAP = {
  "": "Default",
  'valign="top"': "Top",
  'valign="middle"': "Middle",
  'valign="bottom"': "Bottom",
};

const VERTICAL_ALIGNS_WITH_NUMBER_MAP = {
  "": "0-Default",
  'valign="top"': "1-Top",
  'valign="middle"': "2-Middle",
  'valign="bottom"': "3-Bottom",
};

interface AlignmentTestInnerControlOptions {
  align: string;
  autoGrow: boolean;
  cellContainer: "gx-table-cell" | "gx-canvas-cell";
  cellHeight: "110px" | "100%";
  innerControlName: string;
  innerControlProperties: string;
  imageProperties: string;
  valign: string;
}

interface AlignmentTestOptions {
  autoGrow: boolean[];
  shouldTestAlign: boolean;
  shouldTestVAlign: boolean;
  delayToTakeScreenshot?: number;
}

function testAlignment(
  innerControl: string,
  options: AlignmentTestInnerControlOptions,
  delayToTakeScreenshot = 0
) {
  const autoGrowName = options.autoGrow ? "True" : "False";

  // @ts-expect-error
  const hAlignsMap = HORIZONTAL_ALIGNS_MAP[options.align];
  // @ts-expect-error
  const vAlignsMap = VERTICAL_ALIGNS_MAP[options.valign];
  // @ts-expect-error
  const hAlignsWithNumberMap = HORIZONTAL_ALIGNS_WITH_NUMBER_MAP[options.align];
  // @ts-expect-error
  const vAlignsWithNumberMap = VERTICAL_ALIGNS_WITH_NUMBER_MAP[options.valign];

  const testUniqueName = `should align correctly in ${
    CELL_CONTAINERS_MAP[options.cellContainer]
  } (Height: ${
    CELL_HEIGHTS_MAP[options.cellHeight]
  }, AutoGrow: ${autoGrowName}, Align: ${hAlignsMap}, Valign: ${vAlignsMap}) when it has ${
    options.innerControlProperties
  }`;

  const testImageName = `${IMAGE_NAME_SEPARATOR}${
    options.innerControlName
  }_Alignment_${options.imageProperties}_${
    CELL_CONTAINERS_MAP[options.cellContainer]
  }_${
    CELL_HEIGHTS_MAP[options.cellHeight]
  }_${autoGrowName}_${hAlignsWithNumberMap}_${vAlignsWithNumberMap}`;

  // - - - - - - - - - -  Conversions  - - - - - - - - - - - -
  const rowsTemplateInTable = () => {
    let properties = "";

    if (options.autoGrow && options.cellHeight === "110px") {
      properties = 'rows-template="min-content"';
    }

    if (!options.autoGrow && options.cellHeight === "110px") {
      properties = 'rows-template="minmax(min-content, 110px)"';
    }

    if (options.cellHeight === "100%") {
      properties = 'rows-template="minmax(min-content, 1fr)"';
    }

    return properties;
  };

  const heightAndAutoGrowPropertiesInCell = () => {
    let properties = "";

    if (options.cellContainer === "gx-table-cell") {
      if (options.cellHeight === "110px") {
        properties += 'min-height="110px"';
      }

      if (options.cellHeight === "110px" && !options.autoGrow) {
        properties += ' max-height="110px"';
      }

      if (options.autoGrow) {
        properties += " auto-grow";
      }
    }

    if (options.cellContainer === "gx-canvas-cell") {
      properties += 'min-height="' + options.cellHeight + '"';

      if (!options.autoGrow) {
        properties += ' max-height="' + options.cellHeight + '"';
      }
    }
    return properties;
  };

  // - - - - - - - - - - Configuration - - - - - - - - - - - -
  const style = `
    <style>
      body {
        min-height: 100vh;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        margin: 0;
        font-size: 10px;
      }

      [hidden] {
        display: none !important;
      }

      *, *::after, *::before {
        box-sizing: border-box;
      }

      .TableFancyTransparent_3 {
        border: 1px solid;
        width: 198px;
        padding: 0;
        margin: 1px;
      }

      .AttributeAlignment {
        border: 2px solid;
        border-radius: 8px;
        color: #000;
        padding: 2px;
        margin: 2px;
        font-size: 13px;
      }
      .AttributeAlignment--vars {
        --placeholder-text-color: #000;
      }

      .TestDescription {
        column-gap: 1px;
        row-gap: 1px;
        width: 194px;
        height: 97px;
        border: 1px solid;
        margin-inline-start: 3px;
      }

      .cell {
        background-color: #000;
        color: #fff;
      }
    </style>`;

  const testDescriptionElement = `
    <gx-table
      css-class="TestDescription"
      areas-template="'cell00 cell00 cell00 cell00 cell00 cell00' 'cell10 cell10 cell10 cell10 cell10 cell10' 'cell20 cell20 cell21 cell21 cell22 cell22' 'cell30 cell30 cell31 cell31 cell32 cell32' 'cell40 cell40 cell40 cell41 cell41 cell41' 'cell50 cell50 cell50 cell51 cell51 cell51'"
      columns-template="32px 31px 31px 31px 31px 31px"
      rows-template="15px 15px 15px 15px 15px 15px"
    >
      <gx-table-cell area="cell00" align="center" valign="middle" class="cell">
        ${options.innerControlName}
      </gx-table-cell>
      <gx-table-cell area="cell10" align="center" valign="middle">
        ${options.innerControlProperties}
      </gx-table-cell>
      <gx-table-cell area="cell20" align="center" valign="middle" class="cell">
        Container
      </gx-table-cell>
      <gx-table-cell area="cell21" align="center" valign="middle" class="cell">
        Cell height
      </gx-table-cell>
      <gx-table-cell area="cell22" align="center" valign="middle" class="cell">
        Auto Grow
      </gx-table-cell>
      <gx-table-cell area="cell30" align="center" valign="middle">
        ${CELL_CONTAINERS_MAP[options.cellContainer]}
      </gx-table-cell>
      <gx-table-cell area="cell31" align="center" valign="middle">
        ${options.cellHeight}
      </gx-table-cell>
      <gx-table-cell area="cell32" align="center" valign="middle">
        ${autoGrowName}
      </gx-table-cell>
      <gx-table-cell area="cell40" align="center" valign="middle" class="cell">
        Align
      </gx-table-cell>
      <gx-table-cell area="cell41" align="center" valign="middle" class="cell">
        Valign
      </gx-table-cell>
      <gx-table-cell area="cell50" align="center" valign="middle">
        ${
          // @ts-expect-error
          HORIZONTAL_ALIGNS_MAP[options.align]
        }
      </gx-table-cell>
      <gx-table-cell area="cell51" align="center" valign="middle">
        ${
          // @ts-expect-error
          VERTICAL_ALIGNS_MAP[options.valign]
        }
      </gx-table-cell>
    </gx-table>`;

  const tableElement = (align: string, valign: string) => {
    if (options.cellContainer == "gx-table-cell") {
      return `
        <gx-table
          css-class="TableFancyTransparent_3"
          areas-template="'cell00'"
          columns-template="196px"
          ${rowsTemplateInTable()}
          style="min-height: 112px"
          invisible-mode="keep-space"
        >
          <gx-table-cell 
            area="cell00"
            overflow-mode="clip"
            ${heightAndAutoGrowPropertiesInCell()}
            ${align}
            ${valign}
          >
            ${innerControl}
          </gx-table-cell>
        </gx-table>`;
    }

    // options.cellContainer == "gx-canvas-cell"
    return `
        <gx-canvas
          css-class="TableFancyTransparent_3"
          width="198px"
          min-height="112px"
          invisible-mode="keep-space"
          layout-is-ready
        >
          <gx-canvas-cell
            width="196px"
            ${heightAndAutoGrowPropertiesInCell()}
            ${align}
            ${valign}
          >
            ${innerControl}
          </gx-canvas-cell>
        </gx-canvas>`;
  };

  it(testUniqueName, async () => {
    const page: E2EPage = await newE2EPage();

    const pageContent =
      style +
      testDescriptionElement +
      tableElement(options.align, options.valign);
    await page.setContent(pageContent);

    if (delayToTakeScreenshot != 0) {
      await delay(delayToTakeScreenshot);
    }

    const results = await page.compareScreenshot(testImageName, TEST_CONFIG);
    expect(results).toMatchScreenshot();
  });
}

export function runAlignmentTest(
  innerControl: string,
  innerControlName: string,
  innerControlProperties: string,
  imageProperties: string,
  testOptions: AlignmentTestOptions
) {
  const aligns = testOptions.shouldTestAlign ? HORIZONTAL_ALIGNS : [""];
  const vAligns = testOptions.shouldTestVAlign ? VERTICAL_ALIGNS : [""];
  const delay = testOptions.delayToTakeScreenshot || 0;

  // Generate tests
  for (const cellContainer of CELL_CONTAINERS) {
    for (const cellHeight of CELL_HEIGHTS) {
      for (const autoGrow of testOptions.autoGrow) {
        for (const align of aligns) {
          for (const valign of vAligns) {
            const options: AlignmentTestInnerControlOptions = {
              align,
              autoGrow,
              cellContainer,
              cellHeight,
              innerControlName,
              innerControlProperties,
              imageProperties,
              valign,
            };

            testAlignment(innerControl, options, delay);
          }
        }
      }
    }
  }
}
