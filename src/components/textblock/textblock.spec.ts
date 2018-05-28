import { TestWindow } from "@stencil/core/testing";
import { TextBlock } from "./textblock";

describe("gx-textblock", () => {
  it("should build", () => {
    expect(new TextBlock()).toBeTruthy();
  });

  describe("rendering", () => {
    let element;
    let testWindow;
    beforeEach(async () => {
      testWindow = new TestWindow();
      element = await testWindow.load({
        components: [TextBlock],
        html: "<gx-textblock>Hello world!</gx-textblock>"
      });
    });

    it("should work without parameters", () => {
      expect(element.textContent.trim()).toEqual("Hello world!");
    });
  });
});
