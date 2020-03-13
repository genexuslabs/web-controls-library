import { h, Host } from "@stencil/core";
import { Renderer } from "../../../common/interfaces";
import { TabCaption } from "../../../tab-caption/tab-caption";
import {
  imagePositionRender,
  imagePositionClass,
  hideMainImageWhenDisabledClass
} from "../../../common/image-position";

export class TabCaptionRender implements Renderer {
  constructor(private component: TabCaption) {
    this.clickHandler = this.clickHandler.bind(this);
  }

  private hasDisabledImage = false;

  componentWillLoad() {
    const element = this.component.element;
    this.hasDisabledImage =
      element.querySelector("[slot='disabled-image']") !== null;
  }

  render(slots) {
    this.component.element.setAttribute(
      "aria-selected",
      (!!this.component.selected).toString()
    );

    return (
      <Host
        role="tab"
        class={{
          "gx-tab-caption--unselected": !this.component.selected,
          [imagePositionClass(this.component.imagePosition)]: true,
          [hideMainImageWhenDisabledClass]:
            !this.component.selected && this.hasDisabledImage
        }}
      >
        <gx-bootstrap />
        <a
          class={{
            active: this.component.selected,
            disabled: this.component.disabled,
            "nav-link": true
          }}
          href="#"
          onClick={!this.component.disabled ? this.clickHandler : null}
        >
          {imagePositionRender(slots)}
        </a>
      </Host>
    );
  }

  private clickHandler(event: UIEvent) {
    event.preventDefault();
    this.component.tabSelect.emit(event);
  }
}
