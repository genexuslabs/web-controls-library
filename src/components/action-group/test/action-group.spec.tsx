import { newSpecPage } from "@stencil/core/testing";
import { GxActionGroup } from "../action-group";

describe("gx-action-group", () => {
  it("renders", async () => {
    const page = await newSpecPage({
      components: [GxActionGroup],
      html: `<gx-action-group></gx-action-group>`
    });
    expect(page.root).toEqualHtml(`
      <gx-action-group>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </gx-action-group>
    `);
  });
});
