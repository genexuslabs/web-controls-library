import { newSpecPage } from "@stencil/core/testing";
import { GxImageAnnotations } from "../gx-image-annotations";

describe("gx-image-annotations", () => {
  it("renders", async () => {
    const page = await newSpecPage({
      components: [GxImageAnnotations],
      html: `<gx-image-annotations></gx-image-annotations>`
    });

    expect(page.root).toEqualHtml(`
      <gx-image-annotations>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </gx-image-annotations>
    `);
  });
});
