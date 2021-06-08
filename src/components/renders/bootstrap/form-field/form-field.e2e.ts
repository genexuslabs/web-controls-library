import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";

describe("gx-form-field", () => {
  let element: E2EElement;
  let page: E2EPage;
  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(
      `<gx-form-field label-caption="Label">
        <gx-edit id="edit" value="Hello world!" area="field"></gx-edit>
       </gx-form-field>`
    );
    element = await page.find("gx-form-field");
  });

  it("should render the label", async () => {
    const labelElement = await element.find("label");
    expect(labelElement).toBeTruthy();
    expect(labelElement.textContent.trim()).toEqual("Label");
  });

  it("should should use flex column for laying out label and field", async () => {
    const positions = [
      ["top", true],
      ["bottom", false],
      ["left", false],
      ["right", false]
    ];

    const groupElement = await element.find(".form-group");
    for (const [position, hasFlexColumn] of positions) {
      element.setAttribute("label-position", position);
      await page.waitForChanges();
      if (hasFlexColumn) {
        expect(groupElement).toHaveClass("flex-column");
      } else {
        expect(groupElement).not.toHaveClass("flex-column");
      }
    }
  });
  // it("should link the label and the input field", async () => {
  //   const label = await page.find("label");
  //   const input = await page.find("input");
  //   await page.waitForChanges();
  //   expect(await label.getProperty("htmlFor")).toEqual(
  //     await input.getProperty("id")
  //   );
  // });
});
