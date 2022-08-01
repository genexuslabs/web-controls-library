import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";

describe("gx-message", () => {
  let element: E2EElement;
  let page: E2EPage;
  beforeEach(async () => {
    page = await newE2EPage();
  });

  it("should work without parameters", async () => {
    await page.setContent("<gx-message>Hello world!</gx-message>");
    element = await page.find("gx-message");
    expect(element.textContent.trim()).toEqual("Hello world!");
  });

  it("should set .anchor-link to child <a> elements", async () => {
    await page.setContent("<gx-message><a>anchor</a></gx-message>");
    element = await page.find("gx-message");
    const anchor = await page.find("a");
    expect(anchor).toHaveClass("alert-link");
  });

  it("should set .alert-warning when type=warning", async () => {
    await page.setContent(
      "<gx-message type='warning'>Hello world!</gx-message>"
    );
    const alertDiv = await page.find(".alert");
    expect(alertDiv).toHaveClass("alert-warning");
  });

  it("should set .alert-danger when type=error", async () => {
    await page.setContent("<gx-message type='error'>Hello world!</gx-message>");
    const alertDiv = await page.find(".alert");
    expect(alertDiv).toHaveClass("alert-danger");
  });

  it("should set .alert-info when type=info", async () => {
    await page.setContent("<gx-message>Hello world!</gx-message>");
    element = await page.find("gx-message");
    await element.setProperty("type", "info");
    await page.waitForChanges();
    const alertDiv = await page.find(".alert");
    expect(alertDiv).toHaveClass("alert-info");
  });

  it("should dismiss automatically if duration is specified", async () => {
    await page.setContent(
      "<gx-message duration='200'>Hello world!</gx-message>"
    );
    const delay = ms => new Promise(res => setTimeout(res, ms));
    await delay(1000); // Wait 1 second

    expect(await page.find("gx-message")).toBeFalsy();
  });

  it("should show a close button", async () => {
    await page.setContent(
      "<gx-message show-close-button='true'>Hello world!</gx-message>"
    );
    element = await page.find("gx-message");
    expect(await page.find(".close")).toBeDefined();
  });

  it("should dismiss if close button is clicked", async () => {
    await page.setContent(
      "<gx-message show-close-button='true'>Hello world!</gx-message>"
    );
    element = await page.find("gx-message");
    const closeButton = await page.find(".close");
    await closeButton.click();
    await page.waitForChanges();
    expect(await page.find("gx-message")).toBeFalsy();
  });
});
