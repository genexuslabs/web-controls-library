import { TestWindow } from "@stencil/core/testing";
import { Loading } from "./loading";

describe("gx-loading", () => {
  it("should build", () => {
    expect(new Loading()).toBeTruthy();
  });

  describe("rendering", () => {
    let element: HTMLGxLoadingElement;
    let testWindow: TestWindow;

    beforeEach(async () => {
      testWindow = new TestWindow();
      element = await testWindow.load({
        components: [Loading],
        html: `<gx-loading caption="Loading" presented></gx-loading>`
      });
    });

    it("should work without parameters", () => {
      expect(element.textContent.trim()).toEqual("Loading");
    });
  });
});
