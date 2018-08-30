import { TestWindow } from "@stencil/core/testing";
import { Group } from "../group/group";

describe("gx-group", () => {
  it("should build", () => {
    expect(new Group()).toBeTruthy();
  });

  describe("rendering", () => {
    let element: HTMLGxGroupElement;
    let testWindow;
    beforeEach(async () => {
      testWindow = new TestWindow();
      element = await testWindow.load({
        components: [Group],
        html: "<gx-group>TEST TEXT</gx-group>"
      });
    });

    it("should work without parameters", () => {
      expect(element.textContent.trim()).toEqual("TEST TEXT");
    });

    it("should set legend caption", async () => {
      element.caption = "TEST TEXT";
      await testWindow.flush();
      expect(element.querySelector("legend").innerHTML).toEqual("TEST TEXT");
    });
  });
});
