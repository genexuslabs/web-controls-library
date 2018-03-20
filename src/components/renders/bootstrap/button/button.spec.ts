import { render } from "@stencil/core/testing";
import { Button } from "../../../button/button";

describe("gx-button", () => {
  it("should build", () => {
    expect(new Button()).toBeTruthy();
  });

  describe("rendering", () => {
    let element;
    beforeEach(async () => {
      Button["is"] = "gx-button";
      element = await render({
        components: [Button],
        html: "<gx-button>Hello world!</gx-button>"
      });
    });

    it("should work without parameters", () => {
      expect(element.textContent.trim()).toEqual("Hello world!");
    });
  });
});
