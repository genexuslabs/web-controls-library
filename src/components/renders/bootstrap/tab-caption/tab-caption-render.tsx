import { h } from "@stencil/core";
import { Renderer } from "../../../common/interfaces";
import { TabCaption } from "../../../tab-caption/tab-caption";

export class TabCaptionRender implements Renderer {
  constructor(private component: TabCaption) {
    this.clickHandler = this.clickHandler.bind(this);
  }

  render(slots) {
    this.component.element.setAttribute(
      "aria-selected",
      (!!this.component.selected).toString()
    );

    return [
      <gx-bootstrap />,
      <a
        class={{
          active: this.component.selected,
          disabled: this.component.disabled,
          "nav-link": true
        }}
        href="#"
        onClick={!this.component.disabled ? this.clickHandler : null}
      >
        {slots.default}
      </a>
    ];
  }

  private clickHandler(event: UIEvent) {
    event.preventDefault();
    this.component.tabSelect.emit(event);
  }
}
