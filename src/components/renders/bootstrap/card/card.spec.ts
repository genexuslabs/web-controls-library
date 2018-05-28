import { TestWindow } from "@stencil/core/testing";
import { Card } from "../../../card/card";

describe("gx-card", () => {
  it("should build", () => {
    expect(new Card()).toBeTruthy();
  });

  describe("rendering", () => {
    let element;
    let testWindow;
    beforeEach(async () => {
      testWindow = new TestWindow();
      element = await testWindow.load({
        components: [Card],
        html: `<gx-card>
                  <div slot="body">
                    This is the card content
                  </div>
                </gx-card>`
      });
    });

    it("should work without parameters", () => {
      expect(element.textContent.trim()).toEqual("This is the card content");
    });
  });
});
