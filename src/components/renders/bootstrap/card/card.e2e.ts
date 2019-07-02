import { newE2EPage } from "@stencil/core/testing";

describe("gx-card", () => {
  it("renders", async () => {
    const page = await newE2EPage();

    await page.setContent(
      `<gx-card>
        <div slot="body">
          This is the card content
        </div>
      </gx-card>`
    );

    const element = await page.find("gx-card");
    expect(element).toHaveClass("hydrated");
    expect(element.textContent.trim()).toEqual("This is the card content");
  });

  it("renders header and footer", async () => {
    const page = await newE2EPage();

    await page.setContent(
      `<gx-card>
        <div slot="header">Header</div>
        <div slot="body">
          This is the card content
        </div>
        <div slot="footer">Footer</div>
      </gx-card>`
    );

    const element = await page.find("gx-card");
    const headerElement = await element.find(".card-header");
    expect(headerElement.textContent).toContain("Header");
    expect(await headerElement.getProperty("hidden")).toBe(false);
    const footerElement = await element.find(".card-footer");
    expect(await footerElement.getProperty("hidden")).toBe(false);
    expect(footerElement.textContent).toContain("Footer");
  });

  it("hides the header and footer", async () => {
    const page = await newE2EPage();

    await page.setContent(
      `<gx-card show-header="false" show-footer="false">
        <div slot="header">Header</div>
        <div slot="body">
          This is the card content
        </div>
        <div slot="footer">Footer</div>
      </gx-card>`
    );

    const element = await page.find("gx-card");
    const headerElement = await element.find(".card-header");
    expect(await headerElement.getProperty("hidden")).toBe(true);
    const footerElement = await element.find(".card-footer");
    expect(await footerElement.getProperty("hidden")).toBe(true);
  });
});
