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
});
