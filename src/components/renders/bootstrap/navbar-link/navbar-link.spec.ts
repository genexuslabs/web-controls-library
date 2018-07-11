import { TestWindow } from "@stencil/core/testing";
import { NavBarLink } from "../../../navbar-link/navbar-link";

describe("gx-navbar-link", () => {
  it("should build", () => {
    expect(new NavBarLink()).toBeTruthy();
  });

  describe("rendering", () => {
    let element: HTMLGxNavbarLinkElement;
    let testWindow;
    beforeEach(async () => {
      testWindow = new TestWindow();
      element = await testWindow.load({
        components: [NavBarLink],
        html: `<gx-navbar-link href="http://www.google.com">Item with link</gx-navbar-link>`
      });
    });

    it("should work without parameters", () => {
      expect(element.textContent.trim()).toEqual("Item with link");
    });

    it("should have its href attribute set", () => {
      expect(element.href).toEqual("http://www.google.com");
    });

    it("should support setting as disabled", async () => {
      element.disabled = true;
      await testWindow.flush();
      expect(element.querySelector("a").classList).toContain("disabled");
    });

    it("should support setting as active", async () => {
      element.active = true;
      await testWindow.flush();
      expect(element.querySelector("a").classList).toContain("active");
    });

    it("should be able to set class of inner a", async () => {
      element.cssClass = "foo-class bar-class";
      await testWindow.flush();
      expect(
        element.querySelector("a").classList.contains("foo-class")
      ).toEqual(true);
    });
  });
});
