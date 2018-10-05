import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";

describe("gx-table", () => {
  let element: E2EElement;
  let page: E2EPage;

  const cell0 = "cell0";
  const cell1 = "cell1";

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(`<gx-table>
                  <gx-table-cell area="${cell0}">Cell1</gx-table-cell>
                  <gx-table-cell area="${cell1}">Cell2</gx-table-cell>
                </gx-table>`);
    element = await page.find("gx-table");
  });

  it("should work without parameters", () => {
    expect(element.textContent.trim().replace(/\s/g, "")).toEqual("Cell1Cell2");
  });

  it("should show two stacked cells", async () => {
    await element.setProperty("columnsTemplate", "1fr");
    await element.setProperty("rowsTemplate", "200px 200px");
    await element.setProperty("areasTemplate", `'${cell0} ${cell1}'`);
    await page.waitForChanges();
    const computedStyle = await page.evaluate(() => {
      const table = document.querySelector("gx-table");
      return JSON.parse(JSON.stringify(getComputedStyle(table)));
    });
    expect(computedStyle.height).toEqual("400px");
  });
});
