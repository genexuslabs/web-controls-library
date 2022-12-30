import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";

describe("gx-navbar", () => {
  let element: E2EElement;
  let page: E2EPage;
  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(
      `<gx-navbar 
        caption="Foo" 
        show-back-button="true" 
        back-button-label="BACK" 
        single-line="false"
      ></gx-navbar>`
    );
    element = await page.find("gx-navbar");
  });

  it("should render", () => {
    expect(element).toHaveClass("hydrated");
  });

  it("should fire the back button event", async () => {
    const spyOnBackButtonClick = await element.spyOnEvent("backButtonClick");

    await page.waitForChanges();

    const backButtonElement = await page.find(
      "gx-navbar >>> .gx-navbar-back-button"
    );

    await backButtonElement.press("Enter");

    await page.waitForChanges();

    expect(spyOnBackButtonClick).toHaveReceivedEvent();
  });
});
