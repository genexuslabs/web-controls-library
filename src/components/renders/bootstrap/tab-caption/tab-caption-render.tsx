import { h } from "@stencil/core";
import { IRenderer } from "../../../common/interfaces";
import { TabCaption } from "../../../tab-caption/tab-caption";

export class TabCaptionRender implements IRenderer {
  constructor(public component: TabCaption) {}

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
        onClick={!this.component.disabled ? this.clickHandler.bind(this) : null}
      >
        {slots.default}
      </a>
    ];
  }

  private clickHandler(event: UIEvent) {
    event.preventDefault();
    this.component.onTabSelect.emit(event);
  }
}
