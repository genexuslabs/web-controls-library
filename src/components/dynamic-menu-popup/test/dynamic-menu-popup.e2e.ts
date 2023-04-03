import { newE2EPage, E2EElement, E2EPage } from "@stencil/core/testing";

describe("dynamic-menu-popup", () => {
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
    const page = await newE2EPage();
    await page.setContent("<dynamic-menu-popup></dynamic-menu-popup>");

    const element = await page.find("dynamic-menu-popup");
    expect(element).toHaveClass("hydrated");
  });
  it("check that opened property change when dynamic-menu-popup is opened", async () => {
    page = await newE2EPage();
    await page.setContent(MOCK_HTML);
    const popUp = await page.find("dynamic-menu-popup#pop1");
    expect(await popUp.getProperty("opened")).toBe(false);
    await page.evaluate(() =>
      document.querySelector("dynamic-menu-action").click()
    );
    await page.waitForChanges();
    expect(await popUp.getProperty("opened")).toBe(true);
  });
});
