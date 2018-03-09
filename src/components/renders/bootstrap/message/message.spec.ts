import { flush, render } from "@stencil/core/testing";
import { Message } from "../../../message/message";

describe("gx-message", () => {
  it("should build", () => {
    expect(new Message()).toBeTruthy();
  });

  describe("rendering", () => {
    let element;
    beforeEach(async () => {
      Message["is"] = "gx-message";
      element = await render({
        components: [Message],
        html: "<gx-message>Hello world!</gx-message>"
      });
    });

    // it("should work without parameters", () => {
    //   expect(element.textContent.trim()).toEqual("Hello world!");
    // });
    //
    // it("should set .anchor-link to child <a> elements", async () => {
    //   const anchor = document.createElement("a");
    //   const alertDiv = element.querySelector(".alert");
    //   alertDiv.appendChild(anchor);
    //   await flush(element);
    //   expect(anchor.classList.item(0)).toEqual("anchor-link");
    // });
    //
    // it("should set .alert-warning when type=warning", async () => {
    //   element.type = "warning";
    //   await flush(element);
    //   const alertDiv = element.querySelector(".alert");
    //   console.log(alertDiv.classList);
    //   expect(alertDiv.classList.contains("alert-warning")).toEqual(true);
    // });
    //
    // it("should set .alert-danger when type=error", async () => {
    //   element.type = "error";
    //   await flush(element);
    //   const alertDiv = element.querySelector(".alert");
    //   expect(alertDiv.classList.contains("alert-danger")).toEqual(true);
    // });
    //
    // it("should set .alert-info when type=info", async () => {
    //   element.type = "info";
    //   await flush(element);
    //   const alertDiv = element.querySelector(".alert");
    //   expect(alertDiv.classList.contains("alert-info")).toEqual(true);
    // });
    //
    // it("should dismiss automatically if duration is specified", async done => {
    //   element.duration = "1000";
    //   await flush(element);
    //   setTimeout(() => {
    //     expect(element.parentNode).toBeNull();
    //     done();
    //   }, 1500);
    // });
    //
    // it("should show a close button", async () => {
    //   element.showCloseButton = true;
    //   await flush(element);
    //   expect(element.querySelector(".close")).toBe(expect.anything());
    // });
    //
    // it("should dismiss if close button is clicked", async done => {
    //   element.showCloseButton = true;
    //   await flush(element);
    //   element.querySelector(".close").click();
    //   setTimeout(() => {
    //     expect(element.parentNode).toBeNull();
    //     done();
    //   }, 500);
    // });
  });
});
