import { newSpecPage } from "@stencil/core/testing";
import { GxBarcodeScanner } from "../gx-barcode-scanner";

describe("gx-barcode-scanner", () => {
  it("renders", async () => {
    const page = await newSpecPage({
      components: [GxBarcodeScanner],
      html: `<gx-barcode-scanner></gx-barcode-scanner>`
    });
    expect(page.root).toEqualHtml(`
      <gx-barcode-scanner>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </gx-barcode-scanner>
    `);
  });
});
