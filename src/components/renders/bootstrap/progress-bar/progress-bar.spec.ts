import { TestWindow } from "@stencil/core/testing";
import { ProgressBar } from "../../../progress-bar/progress-bar";

describe("gx-progress-bar", () => {
  it("should build", () => {
    expect(new ProgressBar()).toBeTruthy();
  });

  describe("rendering", () => {
    let element: HTMLGxProgressBarElement;
    let testWindow;
    beforeEach(async () => {
      testWindow = new TestWindow();
      element = await testWindow.load({
        components: [ProgressBar],
        html: "<gx-progress-bar>Hello world!</gx-progress-bar"
      });
    });

    it("should work without parameters", () => {
      expect(element.textContent.trim()).toEqual("Hello world!");
    });

    it("should set aria attributes", async () => {
      element.value = 30;
      await testWindow.flush();
      expect(
        element.querySelector(".progress-bar").getAttribute("aria-valuenow")
      ).toEqual("30");
    });
  });
});
