import { flush, render } from "@stencil/core/testing";
import { CheckBox } from "../../../checkbox/checkbox";

describe("gx-checkbox", () => {
  it("should build", () => {
    expect(new CheckBox()).toBeTruthy();
  });

  describe("rendering", () => {
    let element;
    beforeEach(async () => {
      CheckBox["is"] = "gx-checkbox";
      element = await render({
        components: [CheckBox],
        html: "<gx-checkbox></gx-checkbox>"
      });
    });

    // it("should be able to read value", async () => {
    //   element.value = "foo";
    //   await flush(element), expect(element.value).toEqual("foo");
    // });
    //
    // it("should be able to change value", async () => {
    //   element.value = "foo";
    //   await flush(element);
    //   element.value = "bar";
    //   await flush(element);
    //   expect(element.value).toEqual("bar");
    // });

    // it("should keep input and custom element values in sync", async () => {
    //   element.value = "foo";
    //   await flush(element);
    //   expect(element.querySelector("input").value).toEqual("foo");
    // });

    // it("should be able to set class of inner input", async () => {
    //   element.cssClass = "foo-class bar-class";
    //   await flush(element);
    //   expect(
    //     element.querySelector("input").classList.contains("foo-class")
    //   ).toEqual(true);
    // });
  });
});
