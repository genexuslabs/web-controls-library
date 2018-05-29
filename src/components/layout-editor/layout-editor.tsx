import { Component, Element, Event, EventEmitter, Prop } from "@stencil/core";
import Dragula from "dragula";
import controlResolver from "./layout-editor-control-resolver";

@Component({
  shadow: false,
  styleUrl: "layout-editor.scss",
  tag: "gx-layout-editor"
})
export class LayoutEditor {
  @Element() element: HTMLElement;

  /**
   * The abstract form model object
   */
  @Prop() model: any;

  /**
   * Identifier of the selected control. If empty the whole layout-editor is marked as selected.
   */
  @Prop({ mutable: true })
  selectedControlId: string;

  /**
   * Fired when a control is moved inside the layout editor to a new location
   *
   * An object containing information of the move operation is sent in the `detail` property of the event object
   *
   * * When the dragged item was dropped on a new row:
   *
   * | Property      | Details                                                                                                          |
   * | ------------- | ---------------------------------------------------------------------------------------------------------------- |
   * | `beforeRowId` | Identifier of the row next to the row where the control was dropped. An empty string if dropped in the last row. |
   * | `controlId`   | Identifier of the source cell                                                                                    |
   * | `sourceRowId` | Identifier of the source row                                                                                     |
   *
   * * When the dragged item was dropped on an existing empty cell:
   *
   * | Property      | Details                                                                                                          |
   * | ------------- | ---------------------------------------------------------------------------------------------------------------- |
   * | `targetCellId`| Identifier of the cell where the control was dropped |
   * | `controlId`   | Identifier of the source cell                                                                                    |
   * | `sourceRowId` | Identifier of the source row                                                                                     |
   *
   * * When the dragged item was dropped on an existing non-empty cell:
   *
   * | Property          | Details                                                                                                                                     |
   * | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
   * | `beforeControlId` | Identifier of the cell that, after the drop operation, ends located after the dropped control. An empty string if dropped as the last cell. |
   * | `targetRowId`     | Identifier of the row where the control was dropped                                                                                         |
   * | `controlId`       | Identifier of the source cell                                                                                                               |
   * | `sourceRowId`     | Identifier of the source row                                                                                                                |
   *
   */
  @Event() moveCompleted: EventEmitter;

  /**
   * Fired when the selection has been changed
   *
   * An object containing information of the select operation is sent in the `detail` property of the event object
   *
   * | Property      | Details                           |
   * | ------------- | --------------------------------- |
   * | `controlId`   | Identifier of the selected cell   |
   *
   */
  @Event() controlSelected: EventEmitter;

  private drake: Dragula.Drake;
  private dragulaOptions = {
    accepts: (el, target) => {
      return !el.contains(target) && el.parentNode !== target;
    },
    copy: true,
    direction: "horizontal"
  };

  private ddDroppedEl: any;

  componentDidLoad() {
    this.initDragAndDrop();
    this.element.addEventListener("click", this.handleClick.bind(this));
  }

  componentWillUpdate() {
    this.restoreAfterDragDrop();
  }

  private initDragAndDrop() {
    this.drake = Dragula(this.getDropAreas(), this.dragulaOptions);

    this.drake.on("shadow", (el, container) => {
      const direction = container.getAttribute("data-gx-le-drop-area");
      // Update dragula's direction dynamically according to the direction
      // stated at the `data-gx-le-drop-area` attribute
      this.dragulaOptions.direction = direction;

      const position =
        container.children.length === 1
          ? "empty"
          : el.nextSibling
            ? direction === "vertical" ? "top" : "left"
            : direction === "vertical" ? "bottom" : "right";
      container.setAttribute("data-gx-le-active-target", position);
    });

    this.drake.on("out", (...parms) => {
      const [, container] = parms;
      container.removeAttribute("data-gx-le-active-target");
    });

    this.drake.on("drag", () => {
      this.element.setAttribute("data-gx-le-dragging", "");
    });

    this.drake.on("dragend", () => {
      this.element.removeAttribute("data-gx-le-dragging");
    });

    this.drake.on("drop", (el, target, source) => {
      this.ddDroppedEl = el;
      if (!target) {
        return;
      }

      const controlId = source.getAttribute("data-gx-le-cell-id");
      const targetRowId = target.getAttribute("data-gx-le-row-id");
      const sourceRowId = source.getAttribute("data-gx-le-row-id");

      if (target.getAttribute("data-gx-le-placeholder") === "row") {
        // Dropped on a new row
        const beforeRowId = target.getAttribute("data-gx-le-next-row-id");
        this.moveCompleted.emit({
          beforeRowId,
          controlId,
          sourceRowId
        });
      } else {
        // Dropped on an existing row
        if (target.children.length === 1) {
          // Dropped on an empty cell
          const targetCellId = target.getAttribute("data-gx-le-cell-id");
          this.moveCompleted.emit({
            controlId,
            sourceRowId,
            targetCellId
          });
        } else {
          // Dropped on a non-empty cell
          const beforeControlId = el.nextSibling
            ? target.getAttribute("data-gx-le-cell-id")
            : target.nextSibling
              ? target.nextSibling.getAttribute("data-gx-le-cell-id")
              : null;
          this.moveCompleted.emit({
            beforeControlId,
            controlId,
            sourceRowId,
            targetRowId
          });
        }
      }
    });
  }

  private getDropAreas() {
    return Array.from(
      this.element.querySelectorAll(
        "[data-gx-le-drop-area], [data-gx-le-placeholder]"
      )
    );
  }

  private restoreAfterDragDrop() {
    if (this.ddDroppedEl && this.ddDroppedEl.parentNode) {
      this.ddDroppedEl.parentNode.removeChild(this.ddDroppedEl);
    }
    this.ddDroppedEl = null;

    const activeTargets = Array.from(
      this.element.querySelectorAll("[data-gx-le-active-target]")
    );
    for (const target of activeTargets) {
      target.removeAttribute("data-gx-le-active-target");
    }
  }

  componentDidUpdate() {
    if (this.drake) {
      this.drake.containers = this.getDropAreas();
    }
  }

  componentDidUnload() {
    this.drake.destroy();
  }

  render() {
    if (this.model && this.model.layout) {
      this.element.setAttribute(
        "data-gx-le-selected",
        (!this.selectedControlId).toString()
      );
      return controlResolver(this.model.layout, {
        selectedControlId: this.selectedControlId
      });
    }
  }

  private handleClick(event: UIEvent) {
    const target: Element = event.target as Element;
    const control: any = this.findTargetControl(target);
    if (control) {
      this.selectedControlId = control.getAttribute("data-gx-le-cell-id");
      this.controlSelected.emit({
        controlId:
          control.getAttribute("data-gx-le-cell-id") ||
          this.model.layout.table["@id"]
      });
    } else {
      this.selectedControlId = "";
    }
  }

  private findTargetControl(el: Element) {
    if (el.hasAttribute("data-gx-le-drop-area")) {
      return el;
    }

    while (el) {
      const parent = el.parentElement;
      if (parent && parent.hasAttribute("data-gx-le-drop-area")) {
        return parent;
      }
      el = parent;
    }
  }
}
