import { flush, render } from "@stencil/core/testing";
import { Select } from "../../../select/select";

describe("gx-select", () => {
  it("should build", () => {
    expect(new Select()).toBeTruthy();
  });

  describe("rendering", () => {
    let element;
    beforeEach(async () => {
      Select["is"] = "gx-select";
      element = await render({
        components: [Select],
        html: "<gx-select></gx-select>"
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
