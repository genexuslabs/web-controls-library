import { newSpecPage } from "@stencil/core/testing";
import { GxActionGroupItem } from "../gx-action-group-item";

describe("gx-action-group-item", () => {
  it("renders", async () => {
    const page = await newSpecPage({
      components: [GxActionGroupItem],
      html: `<gx-action-group-item></gx-action-group-item>`
    });
    expect(page.root).toEqualHtml(`
      <gx-action-group-item>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </gx-action-group-item>
    `);
  });
});
