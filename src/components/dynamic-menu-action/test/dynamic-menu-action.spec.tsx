import { newSpecPage } from "@stencil/core/testing";
import { DynamicMenuAction } from "../dynamic-menu-action";

describe("dynamic-menu-action", () => {
  it("renders", async () => {
    const page = await newSpecPage({
      components: [DynamicMenuAction],
      html: `<dynamic-menu-action></dynamic-menu-action>`,
    });
    expect(page.root).toEqualHtml(`
      <dynamic-menu-action>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </dynamic-menu-action>
    `);
  });
});
