import { TestWindow } from "@stencil/core/testing";
import { Edit } from "../../../edit/edit";

describe("gx-edit", () => {
  it("should build", () => {
    expect(new Edit()).toBeTruthy();
  });

  describe("rendering", () => {
    let element;
    let testWindow: TestWindow;
    beforeEach(async () => {
      testWindow = new TestWindow();
      element = await testWindow.load({
        components: [Edit],
        html: "<gx-edit></gx-edit>"
      });
    });

    it("should be able to read value", async () => {
      element.value = "foo";
      await testWindow.flush();
      expect(element.value).toEqual("foo");
    });

    it("should be able to change value", async () => {
      element.value = "foo";
      await testWindow.flush();
      element.value = "bar";
      await testWindow.flush();
      expect(element.value).toEqual("bar");
    });

    it("should keep input and custom element values in sync", async () => {
      element.value = "foo";
      await testWindow.flush();
      expect(element.querySelector("input").value).toEqual("foo");
    });
  });
});
