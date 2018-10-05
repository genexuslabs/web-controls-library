import { newE2EPage } from "@stencil/core/testing";

describe("gx-edit", () => {
  let element;
  let page;
  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent("<gx-edit></gx-edit>");
    element = await page.find("gx-edit");
  });

  it("should be able to read value", async () => {
    element.value = "foo";
    await page.waitForChanges();
    expect(element.value).toEqual("foo");
  });

  it("should be able to change value", async () => {
    element.value = "foo";
    await page.waitForChanges();
    element.value = "bar";
    await page.waitForChanges();
    expect(element.value).toEqual("bar");
  });

  // it("should keep input and custom element values in sync", async () => {
  //   element.value = "foo";
  //   await page.waitForChanges();
  //   expect(element.querySelector("input").value).toEqual("foo");
  // });
});
