import { newE2EPage, E2EElement, E2EPage } from "@stencil/core/testing";

describe("dynamic-menu", () => {
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
    page.setDefaultNavigationTimeout(90000);
    await page.setContent("<dynamic-menu></dynamic-menu>");
    const element = await page.find("dynamic-menu");
    expect(element).toHaveClass("hydrated");
  });

  it("must open by default the popUp set in openItem property", async () => {
    page = await newE2EPage();
    await page.setContent(MOCK_HTML);
    const dynamicMenu = await page.find("dynamic-menu");
    const popUp = await page.find("dynamic-menu-popup#pop1");
    expect(popUp).toHaveClass("hidden");
    dynamicMenu.setAttribute("open-item", "action1");
    await page.waitForChanges();
    expect(popUp).not.toHaveClass("hidden");
  });
  it("trigger dynamicMenuActivated event when menu container is opened or closed ", async () => {
    page = await newE2EPage();
    await page.setContent(MOCK_HTML);
    const opened = await page.spyOnEvent("dynamicMenuActivated");
    await page.evaluate(() =>
      document.querySelector("dynamic-menu-action").click()
    );
    expect(opened).toHaveReceivedEvent();
  });
});
