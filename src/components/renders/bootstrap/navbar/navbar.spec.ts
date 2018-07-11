import { TestWindow } from "@stencil/core/testing";
import { NavBar } from "../../../navbar/navbar";

describe("gx-navbar", () => {
  it("should build", () => {
    expect(new NavBar()).toBeTruthy();
  });

  describe("rendering", () => {
    let element: HTMLGxNavbarElement;
    let testWindow;
    beforeEach(async () => {
      testWindow = new TestWindow();
      element = await testWindow.load({
        components: [NavBar],
        html: `<gx-navbar caption="Foo"></gx-navbar>`
      });
    });

    it("should work without parameters", () => {
      expect(element.textContent.trim()).toEqual("Foo");
    });

    it("should be able to change the caption", async () => {
      element.caption = "Bar";
      await testWindow.flush();
      expect(element.textContent.trim()).toEqual("Bar");
    });

    it("should support setting toggle-button-label attribute", async () => {
      element.toggleButtonLabel = "Foo";
      await testWindow.flush();
      expect(
        element
          .querySelector("button.navbar-toggler")
          .getAttribute("aria-label")
      ).toEqual("Foo");
    });

    it("should be able to set class of inner a", async () => {
      element.cssClass = "foo-class bar-class";
      await testWindow.flush();
      expect(
        element.querySelector("nav").classList.contains("foo-class")
      ).toEqual(true);
    });
  });
});
