import { TestWindow } from "@stencil/core/testing";
import { Modal } from "../../../modal/modal";
import { Button } from "../../../button/button";

describe("gx-modal", () => {
  it("should build", () => {
    expect(new Modal()).toBeTruthy();
  });

  describe("rendering", () => {
    let element: HTMLGxModalElement;
    let testWindow: TestWindow;
    beforeEach(async () => {
      testWindow = new TestWindow();
      element = await testWindow.load({
        components: [Modal, Button],
        html: `<gx-modal>
                  <div slot="body">
                    This is the modal content
                  </div>
                  <gx-button slot="primary-action">Confirm</gx-button>
                  <gx-button slot="secondary-action">Cancel</gx-button>
                </gx-modal>`
      });
    });

    it("should work without parameters", () => {
      expect(element.querySelector(".modal-body").textContent.trim()).toEqual(
        "This is the modal content"
      );
    });

    it("should render primary actions", async () => {
      expect(
        element.querySelector<HTMLGxButtonElement>("[slot='primary-action']")
          .cssClass
      ).toContain("btn-primary");
    });

    it("should render secondary actions", async () => {
      expect(
        element.querySelector<HTMLGxButtonElement>("[slot='secondary-action']")
          .cssClass
      ).toContain("btn-secondary");
    });
  });

  describe("behavior", () => {
    let element: HTMLGxModalElement;
    let testWindow: TestWindow;
    beforeEach(async () => {
      testWindow = new TestWindow();
      element = await testWindow.load({
        components: [Modal, Button],
        html: `<gx-modal auto-close="true" opened="true">
                  <div slot="body">
                    This is the modal content
                  </div>
                  <gx-button slot="primary-action">Confirm</gx-button>
                  <gx-button slot="secondary-action">Cancel</gx-button>
                </gx-modal>`
      });
    });

    it("should close the modal when an action button is pressed", async () => {
      element.addEventListener("onClose", () => {
        expect(element.opened).toBe(false);
      });

      element
        .querySelector<HTMLGxButtonElement>("[slot='primary-action']")
        .click();
    });

    it("should close the modal when opened=false", async () => {
      element.addEventListener("onClose", () => {
        expect(element.opened).toBe(false);
      });

      element.opened = false;
    });

    it("should close the modal when clicking outside the modal", async () => {
      element.addEventListener("onClose", () => {
        expect(element.opened).toBe(false);
      });

      testWindow.document.body.click();
    });
  });
});
