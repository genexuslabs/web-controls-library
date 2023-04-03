import { MockHTMLElement } from "@stencil/core/mock-doc";
import { newE2EPage, E2EElement, E2EPage } from "@stencil/core/testing";

describe("dynamic-menu-action", () => {
  const MOCK_HTML = `<menu-container>
  <div slot="containeritems" style="display: flex; flex-direction: row; justify-content: center; align-items: center">
    <label style="margin-right: 10px" onclick="openMenu('action1')">Cualquier Lugar</label>
    <label style="margin-right: 10px" onclick="openMenu('action2')">Cualquier Semana</label>
    <label style="margin-right: 10px" onclick="openMenu('action4')">¿Cuantos?</label>
  </div>

  <dynamic-menu css-class="gx-dynamic-menu" slot="menucontent">
    <dynamic-menu-action item-title="Destino" action-id="action1" popup-id="pop1" slot="menuitems" css-class="gx-dynamic-menu-action">
      <div slot="data"></div>
    </dynamic-menu-action>
    <dynamic-menu-action item-title="Llegada" item-subtitle="¿Cuando?" action-id="action2" popup-id="pop2" slot="menuitems"> </dynamic-menu-action>
    <dynamic-menu-popup id="pop1" slot="menupopup">
      <div slot="data">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed metus mauris, condimentum et posuere eu, suscipit</div>
    </dynamic-menu-popup>

    <dynamic-menu-popup id="pop2" slot="menupopup">
      <div slot="data">Popup para fecha</div>
    </dynamic-menu-popup>
  </dynamic-menu>
</menu-container>`;

  let element: E2EElement;
  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage();
  });

  it("renders", async () => {
    page = await newE2EPage();
    await page.setContent("<dynamic-menu-action></dynamic-menu-action>");

    element = await page.find("dynamic-menu-action");
    expect(element).toHaveClass("hydrated");
  });
  it("change active property when clicked", async () => {
    page = await newE2EPage();
    await page.setContent(MOCK_HTML);
    element = await page.find("dynamic-menu-action");
    expect(await element.getProperty("active")).toBe(false);
    await page.evaluate(() =>
      document.querySelector("dynamic-menu-action").click()
    );
    await page.waitForChanges();
    expect(await element.getProperty("active")).toBe(true);
  });
  it("open the popUp with the same id that dynamic-menu-action when active property is set to true due click", async () => {
    page = await newE2EPage();
    await page.setContent(MOCK_HTML);
    const popUp = await page.find("dynamic-menu-popup#pop1");
    expect(popUp).toHaveClass("hidden");
    await page.evaluate(() =>
      document.querySelector("dynamic-menu-action").click()
    );
    await page.waitForChanges();
    expect(popUp).not.toHaveClass("hidden");
  });
  it("trigger menuActionActivated when dynamic-menu-action is clicked", async () => {
    page = await newE2EPage();
    await page.setContent(MOCK_HTML);
    const spymenuActionActivated = await page.spyOnEvent(
      "menuActionActivated",
      "document"
    );
    await page.evaluate(() =>
      document.querySelector("dynamic-menu-action").click()
    );
    await page.waitForChanges();
    expect(spymenuActionActivated).toHaveReceivedEvent();
  });
  it("trigger menuActionKeyDown when a key is pressed on dynamic-menu-action", async () => {
    page = await newE2EPage();
    await page.setContent(MOCK_HTML);
    const menuActionKeyDown = await page.spyOnEvent(
      "menuActionKeyDown",
      "document"
    );
    await page.evaluate(() =>
      document
        .querySelector("dynamic-menu-action")
        .dispatchEvent(new Event("keydown"))
    );
    await page.waitForChanges();
    expect(menuActionKeyDown).toHaveReceivedEvent();
  });
});
