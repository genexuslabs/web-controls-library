import { newSpecPage } from "@stencil/core/testing";
import { GxCropper } from "../gx-cropper";

describe("gx-cropper", () => {
  it("renders", async () => {
    const page = await newSpecPage({
      components: [GxCropper],
      html: `<gx-cropper></gx-cropper>`
    });
    expect(page.root).toEqualHtml(`
      <gx-cropper>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </gx-cropper>
    `);
  });
});
