import { flush, render } from "@stencil/core/testing";
import { Card } from "../../../card/card";

describe("gx-card", () => {
  it("should build", () => {
    expect(new Card()).toBeTruthy();
  });

  describe("rendering", () => {
    let element;
    beforeEach(async () => {
      Card["is"] = "gx-card";
      element = await render({
        components: [Card],
        html: "<gx-card>Hello world!</gx-card>"
      });
    });
  });
});
