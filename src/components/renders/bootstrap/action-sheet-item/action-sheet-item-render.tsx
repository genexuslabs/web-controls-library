import { h } from "@stencil/core";
import { Renderer } from "../../../common/interfaces";
import { ActionSheetItem } from "../../../action-sheet-item/action-sheet-item";

export class ActionSheetItemRender implements Renderer {
  constructor(private component: ActionSheetItem, handlers: { handleClick }) {
    this.handleClick = handlers.handleClick;
  }
  private handleClick: (event: UIEvent) => void;

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

    actionSheetItem.element.addEventListener("click", this.handleClick);
  }

  render(slots: { default }) {
    return [<gx-bootstrap />, slots.default];
  }
}
