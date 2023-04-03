import { newSpecPage } from "@stencil/core/testing";
import { DynamicMenuPopup } from "../dynamic-menu-popup";

describe("dynamic-menu-popup", () => {
  it("renders", async () => {
    const page = await newSpecPage({
      components: [DynamicMenuPopup],
      html: `<dynamic-menu-popup></dynamic-menu-popup>`,
    });
    expect(page.root).toEqualHtml(`
      <dynamic-menu-popup>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </dynamic-menu-popup>
    `);
  });
});
