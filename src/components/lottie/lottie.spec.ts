import { TestWindow } from "@stencil/core/testing";
import { Lottie } from "./lottie";
//import { animationData } from "./test-animation.spec";

describe("gx-lottie", () => {
  it("should build", () => {
    expect(new Lottie()).toBeTruthy();
  });

  describe("rendering", () => {
    let element: HTMLGxLottieElement;
    let testWindow: TestWindow;

    beforeEach(async () => {
      testWindow = new TestWindow();
      element = await testWindow.load({
        components: [Lottie],
        html: `<gx-lottie></gx-lottie>`
      });
    });

    // it("should load an animation", async (done) => {
    //   element.animationData = animationData;
    //   testWindow.document.addEventListener("animationLoad", () => {
    //     expect(true).toBeFalsy();
    //     done();
    //   });
    //   await testWindow.flush();
    // });
  });
});
