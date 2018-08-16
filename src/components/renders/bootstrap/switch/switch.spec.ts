import { TestWindow } from "@stencil/core/testing";
import { Switch } from "../../../switch/switch";

describe("gx-switch", () => {
  it("should build", () => {
    expect(new Switch()).toBeTruthy();
  });

  describe("rendering", () => {
    let element: HTMLGxSwitchElement;
    let testWindow;
    beforeEach(async () => {
      testWindow = new TestWindow();
      element = await testWindow.load({
        components: [Switch],
        html: "<gx-switch id='id0'>TEST TEXT</gx-switch>"
      });
    });
    //innerHTML Test(?)
    it("should work without parameters", () => {
      expect(element.textContent.trim()).toEqual("TEST TEXT");
    });
    //Caption Test
    it("should set label caption", async () => {
      element.caption = "TEST TEXT0";
      await testWindow.flush();
      expect(element.querySelector("label").innerHTML).toEqual("TEST TEXT0");
    });
    //Checked Test
    it("should detect if is checked", async () => {
      element.checked = true;
      await testWindow.flush();
      expect(element.querySelector("input").checked).toEqual(true);
    });
    //Disabled Test
    it("should detect if is disabled", async () => {
      element.disabled = true;
      await testWindow.flush();
      expect(element.querySelector("input").disabled).toEqual(true);
    });
    //ID Test
    it("should asign value to 'id' and 'for' attrs", async () => {
      expect(element.getAttribute("id")).toEqual("id0");
      expect(element.querySelector("input").id).toEqual("id0_checkbox");
      expect(element.querySelector("label").getAttribute("for")).toEqual(
        "id0_checkbox"
      );
    });
  });
});
