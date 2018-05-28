import { TestWindow } from "@stencil/core/testing";
import { RadioOption } from "../../../radio-option/radio-option";

describe("gx-radio-option", () => {
  it("should build", () => {
    expect(new RadioOption()).toBeTruthy();
  });

  describe("rendering", () => {
    let element: HTMLGxRadioOptionElement;
    let testWindow: TestWindow;
    beforeEach(async () => {
      testWindow = new TestWindow();
      element = await testWindow.load({
        components: [RadioOption],
        html: '<gx-radio-option caption="Label"></gx-radio-option>'
      });
    });

    it("should work without parameters", () => {
      expect(element.textContent.trim()).toEqual("Label");
    });

    it("should be able to read value", async () => {
      element.value = "foo";
      await testWindow.flush(), expect(element.value).toEqual("foo");
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

    it("should be able to set class of inner input", async () => {
      element.cssClass = "foo-class bar-class";
      await testWindow.flush();
      expect(
        element.querySelector("input").classList.contains("foo-class")
      ).toEqual(true);
    });
  });
});
