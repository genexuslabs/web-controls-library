import { E2EPage, newE2EPage } from "@stencil/core/testing";

describe("gx-action-sheet-item", () => {
  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(`
    <gx-action-sheet opened="true" close-button-label="Cancel">
      <gx-action-sheet-item action-type="destructive">Delete</gx-action-sheet-item>
      <gx-action-sheet-item>Share</gx-action-sheet-item>
      <gx-action-sheet-item disabled>Play</gx-action-sheet-item>
      <gx-action-sheet-item>Favorite</gx-action-sheet-item>
    </gx-action-sheet>
    `);
  });

  it("should render disabled actions", async () => {
    const disabledAction = await page.find("gx-action-sheet-item[disabled]");
    expect(disabledAction.className.indexOf("disabled")).toBeGreaterThan(-1);
  });

  it("should render destructive actions", async () => {
    const destructiveAction = await page.find(
      "gx-action-sheet-item[action-type='destructive']"
    );
    expect(destructiveAction.className.indexOf("danger")).toBeGreaterThan(-1);
  });
});
