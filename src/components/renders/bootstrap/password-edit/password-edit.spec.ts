import { TestWindow } from "@stencil/core/testing";
import { PasswordEdit } from "../../../password-edit/password-edit";

describe("gx-password-edit", () => {
  it("should build", () => {
    expect(new PasswordEdit()).toBeTruthy();
  });

  describe("rendering", () => {
    let element: HTMLGxPasswordEditElement;
    let testWindow: TestWindow;
    beforeEach(async () => {
      testWindow = new TestWindow();
      element = await testWindow.load({
        components: [PasswordEdit],
        html: "<gx-password-edit></gx-password-edit>"
      });
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

    it("should keep inner and custom element values in sync", async () => {
      element.value = "foo";
      await testWindow.flush();
      expect(element.querySelector("gx-edit").value).toEqual("foo");
    });

    // it("should be able to set class of inner input", async () => {
    //   element.cssClass = "foo-class bar-class";
    //   await testWindow.flush();
    //   expect(
    //     element.querySelector("gx-edit").cssClass
    //   ).toEqual("foo-class bar-class");
    // });
  });
});
