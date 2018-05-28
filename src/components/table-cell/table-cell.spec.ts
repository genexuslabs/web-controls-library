import { TestWindow } from "@stencil/core/testing";
import { TableCell } from "./table-cell";

describe("gx-table-cell", () => {
  it("should build", () => {
    expect(new TableCell()).toBeTruthy();
  });

  describe("rendering", () => {
    let testWindow: TestWindow;
    let element: HTMLGxTableCellElement;
    beforeEach(async () => {
      testWindow = new TestWindow();
      element = await testWindow.load({
        components: [TableCell],
        html: "<gx-table-cell>Cell</gx-table-cell>"
      });
    });

    it("should work without parameters", () => {
      expect(element.textContent.trim()).toEqual("Cell");
    });
  });
});
