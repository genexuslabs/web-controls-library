import { newE2EPage } from "@stencil/core/testing";

describe("gx-button", () => {
  it("renders", async () => {
    const page = await newE2EPage();

    await page.setContent("<gx-button>Hello world!</gx-button>");
    const element = await page.find("gx-button");
    expect(element).toHaveClass("hydrated");
    expect(element.textContent.trim()).toEqual("Hello world!");
  });
});
