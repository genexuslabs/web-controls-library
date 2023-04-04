import { newSpecPage } from "@stencil/core/testing";
import { GxCropperImage } from "../gx-cropper-image";

describe("gx-cropper-image", () => {
  it("renders", async () => {
    const page = await newSpecPage({
      components: [GxCropperImage],
      html: `<gx-cropper-image></gx-cropper-image>`
    });
    expect(page.root).toEqualHtml(`
      <gx-cropper-image>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </gx-cropper-image>
    `);
  });
});
