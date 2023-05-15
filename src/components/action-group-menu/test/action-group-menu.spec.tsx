import { newSpecPage } from "@stencil/core/testing";
import { GxActionGroupMenu } from "../gx-action-group-menu";

describe("gx-action-group-menu", () => {
  it("renders", async () => {
    const page = await newSpecPage({
      components: [GxActionGroupMenu],
      html: `<gx-action-group-menu></gx-action-group-menu>`
    });
    expect(page.root).toEqualHtml(`
      <gx-action-group-menu>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </gx-action-group-menu>
    `);
  });
});
