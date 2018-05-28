import { TestWindow } from "@stencil/core/testing";
import { Message } from "../../../message/message";

describe("gx-message", () => {
  it("should build", () => {
    expect(new Message()).toBeTruthy();
  });

  describe("rendering", () => {
    let testWindow: TestWindow;
    let element: HTMLGxMessageElement;
    beforeEach(async () => {
      testWindow = new TestWindow();
      element = await testWindow.load({
        components: [Message],
        html: "<gx-message>Hello world!</gx-message>"
      });
    });

    it("should work without parameters", () => {
      expect(element.textContent.trim()).toEqual("Hello world!");
    });

    // it("should set .anchor-link to child <a> elements", async () => {
    //   const anchor = document.createElement("a");
    //   const alertDiv = element.querySelector(".alert");
    //   alertDiv.appendChild(anchor);
    //   await testWindow.flush();
    //   expect(anchor.classList.item(0)).toEqual("anchor-link");
    // });

    it("should set .alert-warning when type=warning", async () => {
      element.type = "warning";
      await testWindow.flush();
      const alertDiv = element.querySelector(".alert");
      expect(alertDiv.classList.contains("alert-warning")).toEqual(true);
    });

    it("should set .alert-danger when type=error", async () => {
      element.type = "error";
      await testWindow.flush();
      const alertDiv = element.querySelector(".alert");
      expect(alertDiv.classList.contains("alert-danger")).toEqual(true);
    });

    it("should set .alert-info when type=info", async () => {
      element.type = "info";
      await testWindow.flush();
      const alertDiv = element.querySelector(".alert");
      expect(alertDiv.classList.contains("alert-info")).toEqual(true);
    });

    // it("should dismiss automatically if duration is specified", async done => {
    //   element.duration = 200;
    //   await testWindow.flush();
    //   setTimeout(() => {
    //     expect(element.parentNode).toBeNull();
    //     done();
    //   }, 300);
    // });

    it("should show a close button", async () => {
      element.showCloseButton = true;
      await testWindow.flush();
      expect(element.querySelector(".close")).toEqual(expect.anything());
    });

    // it("should dismiss if close button is clicked", async done => {
    //   element.showCloseButton = true;
    //   await testWindow.flush();
    //   const closeButton = element.querySelector(".close") as HTMLButtonElement;
    //   closeButton.click();
    //   setTimeout(() => {
    //     expect(element.parentNode).toBeNull();
    //     done();
    //   }, 200);
    // });
  });
});
