import { TestWindow } from "@stencil/core/testing";
import { CheckBox } from "../../../checkbox/checkbox";

describe("gx-checkbox", () => {
  it("should build", () => {
    expect(new CheckBox()).toBeTruthy();
  });

  describe("rendering", () => {
    let testWindow: TestWindow;
    let element: HTMLGxCheckboxElement;
    beforeEach(async () => {
      testWindow = new TestWindow();
      element = await testWindow.load({
        components: [CheckBox],
        html: "<gx-checkbox></gx-checkbox>"
      });
    });

    it("should be able to read value", async () => {
      element.checked = true;
      await testWindow.flush();
      expect(element.checked).toEqual(true);
    });

    it("should be able to change value", async () => {
      element.checked = true;
      await testWindow.flush();
      element.checked = false;
      await testWindow.flush();
      expect(element.checked).toEqual(false);
    });

    it("should keep input and custom element values in sync", async () => {
      element.checked = true;
      await testWindow.flush();
      expect(element.querySelector("input").checked).toEqual(true);
    });

    it("should be able to set class of inner input", async () => {
      element.cssClass = "foo-class bar-class";
      await testWindow.flush();
      expect(
        element.querySelector("input").classList.contains("foo-class")
      ).toEqual(true);
    });
  });
});
