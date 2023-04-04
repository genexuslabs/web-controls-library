import { newSpecPage } from "@stencil/core/testing";
import { GxCropperSelection } from "../gx-cropper-selection";

describe("gx-cropper-selection", () => {
  it("renders", async () => {
    const page = await newSpecPage({
      components: [GxCropperSelection],
      html: `<gx-cropper-selection></gx-cropper-selection>`
    });
    expect(page.root).toEqualHtml(`
      <gx-cropper-selection>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </gx-cropper-selection>
    `);
  });
});
