import {
  Component,
  Element,
  Event,
  EventEmitter,
  Prop,
  Watch
} from "@stencil/core";
import Dragula from "dragula";
import controlResolver from "./layout-editor-control-resolver";
import {
  findParentCell,
  getCellData,
  getControlId,
  getDropTargetData,
  isEmptyContainerDrop
} from "./layout-editor-helpers";

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
   * Array with the identifiers of the selected control's cells. If empty the whole layout-editor is marked as selected.
   */
  @Prop({ mutable: true })
  selectedCells: string[] = [];

  private selectedControls: string[] = [];

  /**
   * Fired when a control is moved inside the layout editor to a new location
   *
   * An object containing information of the move operation is sent in the `detail` property of the event object
   *
   * Regardless where the control was dropped, the detail object will contain information about the source row and the id of the dropped control:
   *
   * | Property         | Details                                                                                                          |
   * | ---------------- | ---------------------------------------------------------------------------------------------------------------- |
   * | `sourceCellId`   | Identifier of the source cell                                                                                    |
   * | `sourceRowId`    | Identifier of the source row                                                                                     |
   *
   * Depending on where the control was dropped, additional information will be provided and different properties will be set. There are four possible cases:
   *
   * 1. Dropped on an empty container or on a new row that will be the last row of a container
   * 2. Dropped on a new row of a non empty container
   * 3. Dropped on an existing empty cell
   * 4. Dropped on an existing row
   *
   *
   * ###### 1. Dropped on an empty container or on a new row that will be the last row of a container
   *
   * | Property          | Details                                                                                                                                     |
   * | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
   * | `containerId`     | Identifier of the container where the control was dropped                                                                                   |
   *
   * ###### 2. Dropped on a new row of a non empty container
   *
   * | Property          | Details                                                                                                                                     |
   * | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
   * | `beforeRowId`     | Identifier of the row next to the row where the control was dropped. An empty string if dropped in the last row or on an empty container.   |
   *
   * ###### 3. Dropped on an existing empty cell
   *
   * | Property      | Details                                                                                                          |
   * | ------------- | ---------------------------------------------------------------------------------------------------------------- |
   * | `targetCellId`| Identifier of the cell where the control was dropped |
   *
   *  ###### 4. Dropped on an existing row
   *
   * | Property          | Details                                                                                                                                     |
   * | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
   * | `beforeCellId`    | Identifier of the cell that, after the drop operation, ends located after the dropped control. An empty string if dropped as the last cell. |
   * | `targetRowId`     | Identifier of the row where the control was dropped                                                                                         |
   *
   */
  @Event() moveCompleted: EventEmitter;

  /**
   * Fired when a control (that wasn't already inside the layout editor) has been dropped on
   * a valid drop target (for example, a control from a toolbox or an object from the knowledge base navigator)
   *
   * ##### Dragging a control
   *
   * If a control is being dragged, the dataTransfer property of the event must have the following format:
   *
   * `"GX_DASHBOARD_ADDELEMENT,[GeneXus type of control]"`
   *
   * where:
   *
   * * `GX_DASHBOARD_ADDELEMENT` is the type of action
   * * `[GeneXus type of control]` is the type of control that's been added. This value can have any value and will be passed as part of the information sent as part of the event.
   *
   * ##### Dragging a KB object
   *
   * If a KB object is being dragged, the dataTransfer property of the event must contain the name of the KB object.
   *
   * ##### Dropped control information
   *
   * An object containing information of the add operation is sent in the `detail` property of the event object.
   *
   * If a KB object was dropped, the following properties are set:
   *
   * | Property          | Details                                                                                                                                     |
   * | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
   * | `kbObjectName`    | Name of the GeneXus object                                                                                                               |
   *
   * If control was dropped, the following properties are set.
   *
   * | Property          | Details                                                                                                                                     |
   * | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
   * | `elementType`     | The type of the control that's been added and was received as the `[GeneXus type of control]` in the dataTransfer of the drop operation     |
   *
   * Depending on where the control was dropped, additional information will be provided and different properties will be set. There are four possible cases:
   *
   * 1. Dropped on an empty container or in the last row of a container
   * 2. Dropped on a new row of a non empty container
   * 3. Dropped on an existing empty cell
   * 4. Dropped on an existing row
   *
   *
   * ###### 1. Dropped on an empty container or on a new row that will be the last row of a container
   *
   * | Property          | Details                                                                                                                                     |
   * | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
   * | `containerId`     | Identifier of the container where the control was dropped                                                                                   |
   *
   * ###### 2. Dropped on a new row of a non empty container
   *
   * | Property          | Details                                                                                                                                     |
   * | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
   * | `beforeRowId`     | Identifier of the row next to the row where the control was dropped. An empty string if dropped in the last row or on an empty container.   |
   *
   * ###### 3. Dropped on an existing empty cell
   *
   * | Property      | Details                                                                                                          |
   * | ------------- | ---------------------------------------------------------------------------------------------------------------- |
   * | `targetCellId`| Identifier of the cell where the control was dropped |
   *
   *  ###### 4. Dropped on an existing row
   *
   * | Property          | Details                                                                                                                                     |
   * | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
   * | `beforeCelllId`   | Identifier of the cell that, after the drop operation, ends located after the dropped control. An empty string if dropped as the last cell. |
   * | `targetRowId`     | Identifier of the row where the control was dropped                                                                                         |
   *
   *
   */
  @Event() controlAdded: EventEmitter;

  /**
   * Fired when a control has been removed from the layout
   *
   * An object containing information of the add operation is sent in the `detail` property of the event object
   *
   * | Property           | Details                                                                                                                                     |
   * | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
   * | `controlIds`       | Identifier of the removed controls |
   *
   */
  @Event() controlRemoved: EventEmitter;

  /**
   * Fired when the selection has been changed
   *
   * An object containing information of the select operation is sent in the `detail` property of the event object
   *
   * | Property       | Details                               |
   * | -------------- | ------------------------------------- |
   * | `controlIds`   | Identifier of the selected controls   |
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
  private ignoreDragulaDrop = false;

  private ddDroppedEl: HTMLElement;

  // private ignoreFocus = false;

  componentDidLoad() {
    this.initDragAndDrop();

    this.element.addEventListener("keydown", this.handleKeyDown.bind(this));
    this.element.addEventListener("click", this.handleClick.bind(this));
  }

  componentWillUpdate() {
    this.restoreAfterDragDrop();
  }

  private handleKeyDown(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    const { cellId } = getCellData(target);
    if (cellId) {
      switch (event.key) {
        case "Delete":
          this.handleDelete();
          break;
        case " ":
          this.handleSelection(event.target as HTMLElement, event.ctrlKey);
          event.preventDefault();
          break;
      }
    }
  }

  private handleDelete() {
    this.controlRemoved.emit({
      controlIds: this.selectedControls.join(",")
    });
  }

  private initDragAndDrop() {
    this.drake = Dragula(this.getDropAreas(), this.dragulaOptions);

    this.drake.on("shadow", (el, container) => {
      const { dropArea: direction } = getCellData(container);
      // Update dragula's direction dynamically according to the direction
      // stated at the `data-gx-le-drop-area` attribute
      this.dragulaOptions.direction = direction;

      const position =
        container.children.length === 1
          ? "empty"
          : el.nextElementSibling
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

    // Drop of controls that were already part of the layout
    this.drake.on("drop", this.handleMoveElementDrop.bind(this));

    // Drop of controls from outside of the editor (e.g. GeneXus' toolbox)
    this.element.addEventListener(
      "drop",
      this.handleExternalElementDrop.bind(this)
    );

    this.element.addEventListener(
      "dragover",
      this.handleExternalElementOver.bind(this)
    );

    this.element.addEventListener("dragend", () => {
      // End Dragula's drag operation
      this.drake.end();
    });
  }

  private handleMoveElementDrop(droppedEl, target, source) {
    const targetCell: HTMLElement = target as HTMLElement;

    if (this.ignoreDragulaDrop) {
      return;
    }

    if (!targetCell) {
      return;
    }

    if (source.getAttribute("data-gx-le-external") !== null) {
      return;
    }

    this.ddDroppedEl = droppedEl;

    const { rowId: sourceRowId, cellId: sourceCellId } = getCellData(source);

    this.moveCompleted.emit({
      ...this.getEventDataForDropAction(targetCell, droppedEl as HTMLElement),
      sourceCellId,
      sourceRowId
    });
  }

  private handleExternalElementOver(event: DragEvent) {
    function triggerMouseEvent(node, eventType) {
      const clickEvent = new MouseEvent(eventType, {
        altKey: event.altKey,
        bubbles: true,
        button: event.button,
        buttons: event.buttons,
        cancelable: true,
        clientX: event.clientX,
        clientY: event.clientY,
        ctrlKey: event.ctrlKey,
        metaKey: event.metaKey,
        relatedTarget: event.relatedTarget,
        screenX: event.screenX,
        screenY: event.screenY,
        shiftKey: event.shiftKey,
        view: window
      });
      node.dispatchEvent(clickEvent);
    }

    const item = this.element.querySelector(
      "[data-gx-le-external-transit]"
    ) as HTMLElement;

    // Enter Dragula's drag mode programatically
    this.drake.start(item);

    event.preventDefault();

    // Simulate a mousedown and a mousemove to trick Dragula into starting
    // its drag operation with the item being dragged, even though it didn't
    // originally come from a registered Dragula container.
    setTimeout(() => {
      triggerMouseEvent(item, "mousedown");
      setTimeout(() => {
        triggerMouseEvent(document.documentElement, "mousemove");
      }, 100);
    }, 100);
    return false;
  }

  private handleExternalElementDrop(event: DragEvent) {
    let eventData;

    const evtTarget = event.target as HTMLElement;
    const targetCell = findParentCell(evtTarget) || evtTarget;
    const el = targetCell.querySelector("[data-gx-le-external-transit]");

    this.ignoreDragulaDrop = true;
    this.drake.end();
    this.ignoreDragulaDrop = false;

    this.ddDroppedEl = el as HTMLElement;

    if (isEmptyContainerDrop(evtTarget)) {
      if (this.isEditorEmpty()) {
        // Dropped on the outermost table, when it's empty (the editor is empty)
        eventData = {
          containerId: MAIN_TABLE_IDENTIFIER
        };
      } else {
        // Dropped on an empty container
        eventData = {
          containerId: getControlId(evtTarget.parentElement)
        };
      }
    } else {
      eventData = this.getEventDataForDropAction(targetCell, el as HTMLElement);
    }

    const evtDataTransfer = event.dataTransfer.getData("text");
    const evtDataArr = evtDataTransfer ? evtDataTransfer.split(",") : [];

    if (evtDataArr.length === 1) {
      this.controlAdded.emit({
        ...eventData,
        kbObjectName: evtDataArr[0]
      });
    } else if (
      evtDataArr.length === 2 &&
      evtDataArr[0] === "GX_DASHBOARD_ADDELEMENT"
    ) {
      this.controlAdded.emit({
        ...eventData,
        elementType: evtDataArr[1]
      });
    }
  }

  private getEventDataForDropAction(
    targetCell: HTMLElement,
    droppedEl: HTMLElement
  ) {
    let eventData;

    const { placeholderType, nextRowId } = getDropTargetData(targetCell);
    if (placeholderType === "row") {
      if (isEmptyContainerDrop(targetCell)) {
        // Dropped on an empty container
        eventData = {
          containerId: getControlId(targetCell.parentElement)
        };
      } else {
        // Dropped on a new row
        const beforeRowId = nextRowId;
        if (beforeRowId) {
          eventData = {
            beforeRowId
          };
        } else {
          eventData = {
            containerId: getControlId(targetCell.parentElement)
          };
        }
      }
    } else {
      const { rowId: targetRowId } = getCellData(targetCell);
      // Dropped on an existing row
      if (targetCell.children.length === 1) {
        // Dropped on an empty cell
        const { cellId: targetCellId } = getCellData(targetCell);
        eventData = {
          targetCellId
        };
      } else {
        // Dropped on a non-empty cell
        let beforeCellId = null;
        if (droppedEl.nextElementSibling) {
          beforeCellId = getCellData(targetCell).cellId;
        } else {
          if (targetCell.nextElementSibling) {
            const nextElementData = getCellData(
              targetCell.nextElementSibling as HTMLElement
            );
            if (targetRowId === nextElementData.rowId) {
              beforeCellId = nextElementData.cellId;
            }
          }
        }
        eventData = {
          beforeCellId,
          targetRowId
        };
      }
    }
    return eventData;
  }

  private isEditorEmpty() {
    const outmostContainer = this.element.querySelector(
      "[data-gx-le-container]"
    );
    return (
      outmostContainer.getAttribute("data-gx-le-container-empty") === "true"
    );
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
      const isSelected = this.selectedCells.find(id => id === "") === "";
      this.element.setAttribute("data-gx-le-selected", isSelected.toString());
      return (
        <div>
          {controlResolver(this.model.layout, {
            selectedCells: this.selectedCells
          })}
          <gx-layout-editor-placeholder
            data-gx-le-external
            data-gx-le-placeholder="row"
            style={{
              display: "none"
            }}
          >
            <div data-gx-le-external-transit />
          </gx-layout-editor-placeholder>
        </div>
      );
    }
  }

  @Watch("selectedCells")
  watchSelectedCells() {
    this.controlSelected.emit({
      controlIds: this.selectedControls.join(",")
    });
  }

  private handleClick(event: MouseEvent) {
    this.handleSelection(event.target as HTMLElement, event.ctrlKey);
  }

  private handleSelection(target: HTMLElement, add) {
    const selCell = findParentCell(target);
    const sellChildControl = selCell.querySelector("[data-gx-le-control-id]");
    const selChildControlId = sellChildControl
      ? getControlId(sellChildControl as HTMLElement)
      : "";

    if (selCell) {
      const { cellId: selectedCellId } = getCellData(selCell);
      this.updateSelection(
        selectedCellId,
        selChildControlId || selectedCellId,
        add
      );
    } else {
      this.updateSelection("", selChildControlId, add);
    }
  }

  private updateSelection(selectedCellId, controlId, add) {
    if (add) {
      this.selectedControls = [...this.selectedControls, controlId];
      this.selectedCells = [...this.selectedCells, selectedCellId];
    } else {
      this.selectedControls = [controlId];
      this.selectedCells = [selectedCellId];
    }
  }
}

const MAIN_TABLE_IDENTIFIER = "1";
