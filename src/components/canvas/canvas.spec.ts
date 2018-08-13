import { TestWindow } from "@stencil/core/testing";
import { Canvas } from "./canvas";
import { CanvasCell } from "../canvas-cell/canvas-cell";

describe("gx-canvas", () => {
  it("should build", () => {
    expect(new Canvas()).toBeTruthy();
  });

  describe("rendering", () => {
    let element: HTMLElement;
    let testWindow: TestWindow;

    beforeEach(async () => {
      testWindow = new TestWindow();
      element = await testWindow.load({
        components: [Canvas, CanvasCell],
        html: `<gx-canvas><gx-canvas-cell>Content</gx-canvas-cell></gx-canvas>`
      });
    });

    it("should work without parameters", () => {
      expect(element.textContent.trim()).toEqual("Content");
    });
  });
});
