import { h } from "@stencil/core";
import { IRenderer } from "../../../common/interfaces";
import { ActionSheetItem } from "../../../action-sheet-item/action-sheet-item";

export class ActionSheetItemRender implements IRenderer {
  constructor(public component: ActionSheetItem) {}

  componentDidLoad() {
    const actionSheetItem = this.component;
    const classes = ["list-group-item", "list-group-item-action"];

    if (actionSheetItem.actionType === "destructive") {
      classes.push("text-danger");
    }

    if (actionSheetItem.disabled) {
      classes.push("disabled");
    }

    actionSheetItem.element.classList.add(...classes);

    actionSheetItem.element.addEventListener("click", e =>
      actionSheetItem.handleClick(e)
    );
  }

  render(slots: { default }) {
    return [<gx-bootstrap />, slots.default];
  }
}
