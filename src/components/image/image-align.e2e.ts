import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";

const testImage1 =
  "data:image/x-icon;base64,AAABAAEAICAQAAEABADoAgAAFgAAACgAAAAgAAAAQAAAAAEABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYGyAAISAgAA4gMQAFKUkAATVlAABFhQAAUJgAAFamAABhuQAFZ8MACGzIAA1xzAATd9QAHYHbAAAAAAAAAAAAERERERERERERERERERERERERERERERERERERERERERERERFDERERERERERA0EREREREQWDAREREREREEpBERERERESq1IRERERECbHIREREREREFy2MREREQOLtRERERERERFKu4QhERJKu5QRERERERERKKqrUhE2yqpyEREREREREQXKqsgzi6qrURERERERERETuqqrqqqqmUEREREREREREouqqqqqqrchERERERERERBcqqqqqqrFERERERERERERO6qqqqqqkxERERERERERAmqqqqqqqqUhEREREREREEnKqqqqqqqshCERERERECbMqqqqqqqqqstSEREREQSdqqqqqqqqqqqr2EAREQJsyqqqqqqqqqqqqqzFIRJd3d3d3duqqqq93d3d3cUjdlVVVVVYuqqshVVVVVVnMRARERERBdqqvVARERERARERERERERO7u8kxEREREREREREREREQjbvXIREREREREREREREREF271RERERERERERERERERE8zKMRERERERERERERERERCN1yEREREREREREREREREQXdURERERERERERERERERET2zEREREREREREREREREREKghERERERERERERERERERFnERERERERERERERERERERMxEREREREREREREREREREREREREREREREAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==";

describe("gx-image alignment", () => {
  let tableCellElement: E2EElement;
  let imageElement: E2EElement;
  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(`
  <gx-table
    areas-template="'cell00' "
    columns-template="100px"
    rows-template="164px"
    invisible-mode="keep-space"
  >
    <gx-table-cell
      area="cell00"
      overflow-mode="scroll"
      style="border: 1px solid black;"
    >
      <gx-image
        auto-grow="false"
        src="${testImage1}"
        alt="ctrlImage4"
        invisible-mode="keep-space"
        style="--image-scale-type: none;"
      >
      </gx-image>
    </gx-table-cell>
  </gx-table>
`);
    tableCellElement = await page.find("gx-table-cell");
    imageElement = await page.find("gx-image");
  });

  // it\("default alignment", async () => {
  //   const results = await page.compareScreenshot();
  //   expect(results).toMatchScreenshot();
  // });

  // it("correctly aligns", async () => {
  //   const hAlignValues = ["left", "center", "right"];
  //   const vAlignValues = ["top", "middle", "bottom"];

  //   for (const hAlign of hAlignValues) {
  //     for (const vAlign of vAlignValues) {
  //       tableCellElement.setAttribute("align", hAlign);
  //       tableCellElement.setAttribute("valign", vAlign);
  //       await page.waitForChanges();

  //       const results = await page.compareScreenshot(
  //         `halign: '${hAlign}' - valign: '${vAlign}'`
  //       );
  //       expect(results).toMatchScreenshot();
  //     }
  //   }
  // });

  it("unsets justify-self when width is specified", async () => {
    tableCellElement.setAttribute("align", "center");
    await page.waitForChanges();
    imageElement.setProperty("width", "40px");
    await page.waitForChanges();
    const computedStyle = await imageElement.getComputedStyle();
    expect(computedStyle.justifySelf).toBe("auto");
  });

  it("align-self is always set even when height is specified", async () => {
    tableCellElement.setAttribute("valign", "middle");
    imageElement.setProperty("height", "40px");
    await page.waitForChanges();
    const computedStyle = await imageElement.getComputedStyle();
    expect(computedStyle.alignSelf).toBe("stretch");
  });
});
