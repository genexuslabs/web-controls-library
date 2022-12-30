import { newE2EPage, E2EElement, E2EPage } from "@stencil/core/testing";
import { cleanMeasureUnit } from "../../grid-image-map/test/utils";

describe("gx-grid-image-map-item", () => {
  let element: E2EElement;
  let page: E2EPage;

  const src = "https://i.ibb.co/pPgZrLt/image-2021-12-01-14-07-01.png";

  beforeEach(async () => {
    page = await newE2EPage();
  });

  it("renders", async () => {
    await page.setContent("<gx-grid-image-map-item></gx-grid-image-map-item>");

    const element = await page.find("gx-grid-image-map-item");
    expect(element).toHaveClass("hydrated");
  });

  it("trigger gxClick event", async () => {
    await page.setContent(
      `<gx-grid-image-map src=${src}g'>
        <div slot='grid-content'>
          <gx-grid-image-map-item
            slot='grid-content'
            top='30'
            left='20'
            min-height='200'
            width='100'
            height='100'
            rotation='0deg'
            long-pressable
            highlightable
          >
            <img src='https://picsum.photos/100/200' />
          </gx-grid-image-map-item>
        </div>
      </gx-grid-image-map>`
    );

    const gxClick = await page.spyOnEvent("gxClick", "document");

    element = await page.find("gx-grid-image-map-item");

    element.triggerEvent("click");

    await page.waitForChanges();

    expect(gxClick).toHaveReceivedEvent();
  });

  it("trigger longpress event", async () => {
    await page.setContent(
      `<gx-grid-image-map src='${src}'>
        <div slot='grid-content'>
          <gx-grid-image-map-item
            slot='grid-content'
            top='30'
            left='20'
            min-height='200'
            width='100'
            height='100'
            rotation='0deg'
            long-pressable
            highlightable
          >
            <img src='https://picsum.photos/100/200' />
          </gx-grid-image-map-item>
        </div>
      </gx-grid-image-map>`
    );

    const lonpress = await page.spyOnEvent("longPress", "document");

    element = await page.find("gx-grid-image-map-item");

    element.triggerEvent("mousedown");
    await page.waitForChanges();
    setTimeout(() => {
      expect(lonpress).toHaveReceivedEvent();
    }, 4000);
  });

  it.skip("takes height property as min-height when its assigned", async () => {
    //Set height smallest than min-height
    const height = "100";

    await page.setContent(
      `<gx-grid-image-map src='${src}'>
          <div slot='grid-content'>
            <gx-grid-image-map-item 
              slot='grid-content'
              top='30'
              left='20'
              width='100'
              height=${height}
              rotation='0deg'
              long-pressable
              highlightable
            >
              <img src='https://picsum.photos/100/200' />
            </gx-grid-image-map-item>
          </div>
        </gx-grid-image-map>`
    );

    element = await page.find("gx-grid-image-map-item");
    const realHeight = cleanMeasureUnit(
      (await element.getComputedStyle()).minHeight
    );

    await page.waitForChanges();

    expect(realHeight).toEqual(height);
  });

  it.skip("takes content height when auto-grow property is set", async () => {
    const height = "100";

    await page.setContent(
      `<gx-grid-image-map src='${src}'>
        <div slot='grid-content'>
          <gx-grid-image-map-item
            slot='grid-content'
            top='30' left='20'
            width='100'
            height=${height}
            rotation='0deg'
            long-pressable
            highlightable
          >
            <img src='https://picsum.photos/100/200' />
            <div auto-grow style="height:300px"></div>
          </gx-grid-image-map-item>
        </div>
      </gx-grid-image-map>`
    );
    element = await page.find("gx-grid-image-map-item");
    const realHeight = cleanMeasureUnit(
      (await element.getComputedStyle()).minHeight
    );
    await page.waitForChanges();
    expect(Number(realHeight)).toBeGreaterThan(Number(height));
  });
});
