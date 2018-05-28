import { TestWindow } from "@stencil/core/testing";
import { Select } from "../../../select/select";
import { SelectOption } from "../../../select-option/select-option";

describe("gx-select", () => {
  it("should build", () => {
    expect(new Select()).toBeTruthy();
  });

  describe("rendering", () => {
    let element: HTMLGxSelectElement;
    let testWindow: TestWindow;
    beforeEach(async () => {
      testWindow = new TestWindow();
      element = await testWindow.load({
        components: [Select, SelectOption],
        html: `<gx-select>
                <gx-select-option value="1">One</gx-select-option>
                <gx-select-option value="2">Two</gx-select-option>
                <gx-select-option value="3">Three</gx-select-option>
                <gx-select-option value="4">Four</gx-select-option>
                <gx-select-option value="5" disabled>Five</gx-select-option>
              </gx-select>`
      });
    });

    it("should be able to read value", async () => {
      element.value = "2";
      await testWindow.flush(), expect(element.value).toEqual("2");
    });

    it("should be able to change value", async () => {
      element.value = "2";
      await testWindow.flush();
      element.value = "3";
      await testWindow.flush();
      expect(element.value).toEqual("3");
    });

    it("should keep input and custom element values in sync", async () => {
      element.value = "2";
      await testWindow.flush();
      expect(element.querySelector("select").value).toEqual("2");
    });

    it("should be able to set class of inner input", async () => {
      element.cssClass = "foo-class bar-class";
      await testWindow.flush();
      expect(
        element.querySelector("select").classList.contains("foo-class")
      ).toEqual(true);
    });
  });
});
