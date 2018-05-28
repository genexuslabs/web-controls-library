import { TestWindow } from "@stencil/core/testing";
import { FormField } from "../../../form-field/form-field";
import { Edit } from "../../../edit/edit";

describe("gx-form-field", () => {
  it("should build", () => {
    expect(new FormField()).toBeTruthy();
  });

  describe("rendering", () => {
    let testWindow: TestWindow;
    let element: HTMLGxFormFieldElement;
    beforeEach(async () => {
      testWindow = new TestWindow();
      element = await testWindow.load({
        components: [FormField, Edit],
        html: `<gx-form-field label-caption="Label">
                  <gx-edit id="edit" value="Hello world!" area="field"></gx-edit>
                </gx-form-field>`
      });
    });

    it("should render the label", () => {
      expect(element.textContent.trim()).toEqual("Label");
    });

    it("should link the label and the input field", () => {
      expect(element.querySelector("label").htmlFor).toEqual(
        element.querySelector("input").id
      );
    });
  });
});
