import { TestWindow } from "@stencil/core/testing";
import { Button } from "../../../button/button";

describe("gx-button", () => {
  it("should build", () => {
    expect(new Button()).toBeTruthy();
  });

  describe("rendering", () => {
    let element;
    let testWindow;
    beforeEach(async () => {
      testWindow = new TestWindow();
      element = await testWindow.load({
        components: [Button],
        html: "<gx-button>Hello world!</gx-button>"
      });
    });

    it("should work without parameters", () => {
      expect(element.textContent.trim()).toEqual("Hello world!");
    });
  });
});
