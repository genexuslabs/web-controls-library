import { flush, render } from "@stencil/core/testing";
import { TableCell } from "./table-cell";

describe("gx-table-cell", () => {
  it("should build", () => {
    expect(new TableCell()).toBeTruthy();
  });

  describe("rendering", () => {
    let element;
    beforeEach(async () => {
      TableCell["is"] = "gx-table-cell";
      element = await render({
        components: [TableCell],
        html: "<gx-table-cell></gx-table-cell>"
      });
    });

    // it('should work without parameters', () => {
    //   expect(element.textContent.trim()).toEqual('');
    // });
  });
});
