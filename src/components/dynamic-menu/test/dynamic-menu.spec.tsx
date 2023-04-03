import { newSpecPage } from "@stencil/core/testing";
import { DynamicMenu } from "../dynamic-menu";

describe("dynamic-menu", () => {
  it("renders", async () => {
    const page = await newSpecPage({
      components: [DynamicMenu],
      html: `<dynamic-menu></dynamic-menu>`,
    });
    expect(page.root).toEqualHtml(`
      <dynamic-menu>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </dynamic-menu>
    `);
  });
});
