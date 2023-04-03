import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";

const CLOSE_BUTTON_LABEL = "Close me!";

describe("gx-action-sheet", () => {
  let element: E2EElement;
  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(`
    <gx-action-sheet opened="true" close-button-label="${CLOSE_BUTTON_LABEL}">
      <gx-action-sheet-item action-type="destructive">Delete</gx-action-sheet-item>
      <gx-action-sheet-item>Share</gx-action-sheet-item>
      <gx-action-sheet-item disabled>Play</gx-action-sheet-item>
      <gx-action-sheet-item>Favorite</gx-action-sheet-item>
    </gx-action-sheet>
    `);
    element = await page.find("gx-action-sheet");
  });

  it("should render all actions", async () => {
    const actions = await element.findAll("gx-action-sheet-item");
    expect(actions.length).toBe(5);

    expect(actions[0].textContent).toBe("Delete");
    expect(actions[1].textContent).toBe("Share");
    expect(actions[2].textContent).toBe("Play");
    expect(actions[3].textContent).toBe("Favorite");
  });

  it("should set the close action label", async () => {
    const closeItem = await element.find(".gx-action-sheet-close-item");
    expect(closeItem.textContent).toBe(CLOSE_BUTTON_LABEL);
  });

  it("should fire the onClose and onOpen events", async () => {
    const spyOnClose = await element.spyOnEvent("close");
    const modal = await element.find("gx-modal");
    await modal.setProperty("opened", false);
    await page.waitForChanges();

    expect(spyOnClose).toHaveReceivedEvent();

    const spyOnOpen = await element.spyOnEvent("open");
    await modal.setProperty("opened", true);
    await page.waitForChanges();

    expect(spyOnOpen).toHaveReceivedEvent();
  });
});
