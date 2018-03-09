import { flush, render } from "@stencil/core/testing";
import { FormField } from "../../../form-field/form-field";

describe("gx-form-field", () => {
  it("should build", () => {
    expect(new FormField()).toBeTruthy();
  });

  describe("rendering", () => {
    let element;
    beforeEach(async () => {
      FormField["is"] = "gx-form-field";
      element = await render({
        components: [FormField],
        html: "<gx-form-field></gx-form-field>"
      });
    });
  });
});
