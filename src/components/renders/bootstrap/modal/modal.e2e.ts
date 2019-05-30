import { E2EElement, E2EPage, newE2EPage } from "@stencil/core/testing";

describe("gx-modal", () => {
  describe("rendering", () => {
    let element: E2EElement;
    let page: E2EPage;
    beforeEach(async () => {
      page = await newE2EPage();
      await page.setContent(
        `<gx-modal>
            <div slot="body">
              This is the modal content
            </div>
            <gx-button slot="primary-action">Confirm</gx-button>
            <gx-button slot="secondary-action">Cancel</gx-button>
          </gx-modal>`
      );
      element = await page.find("gx-modal");
    });

    it("should work without parameters", async () => {
      await page.waitForChanges();
      const body = await element.find(".modal-body");
      expect(body).toEqual("This is the modal content");
    });

    it("should render primary actions", async () => {
      const button = await page.find("[slot='primary-action']");
      const cssClassValue = await button.getProperty("cssClass");
      expect(cssClassValue.trim()).toEqual("btn-primary");
    });

    it("should render secondary actions", async () => {
      const button = await page.find("[slot='secondary-action']");
      const cssClassValue = await button.getProperty("cssClass");
      expect(cssClassValue.trim()).toContain("btn-secondary");
    });
  });

  // describe("behavior", () => {
  //   let element;
  //   let page: E2EPage;
  //   beforeEach(async () => {
  //     page = await newE2EPage();
  //     element = await page.setContent(
  //       `<gx-modal auto-close="true" opened="true">
  //           <div slot="body">
  //             This is the modal content
  //           </div>
  //           <gx-button slot="primary-action">Confirm</gx-button>
  //           <gx-button slot="secondary-action">Cancel</gx-button>
  //         </gx-modal>`
  //     );
  //   });

  //   it("should close the modal when an action button is pressed", async () => {
  //     element.addEventListener("onClose", () => {
  //       expect(element.opened).toBe(false);
  //     });

  //     element.querySelector("[slot='primary-action']").click();
  //   });

  //   it("should close the modal when opened=false", async () => {
  //     element.addEventListener("onClose", () => {
  //       expect(element.opened).toBe(false);
  //     });

  //     element.opened = false;
  //   });

  //   it("should close the modal when clicking outside the modal", async () => {
  //     element.addEventListener("onClose", () => {
  //       expect(element.opened).toBe(false);
  //     });

  //     page.click("body");
  //   });
  // });
});
