import { flush, render } from "@stencil/core/testing";
import { Image } from "./image";

describe("gx-image", () => {
  it("should build", () => {
    expect(new Image()).toBeTruthy();
  });

  describe("rendering", () => {
    let element;
    beforeEach(async () => {
      Image["is"] = "gx-image";
      element = await render({
        components: [Image],
        html: "<gx-image></gx-image>"
      });
    });
  });
});
