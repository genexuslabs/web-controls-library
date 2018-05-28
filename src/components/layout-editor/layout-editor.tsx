import { Component, Element, Event, EventEmitter, Prop } from "@stencil/core";
import Dragula from "dragula";
import { controlResolver } from "./layout-editor-control-resolver";

@Component({
  shadow: false,
  styleUrl: "layout-editor.scss",
  tag: "gx-layout-editor"
})
export class LayoutEditor {
  @Element() element: HTMLElement;

  @Prop() model: any;

  @Event() moveCompleted: EventEmitter;

  @Event() controlSelected: EventEmitter;

  @Prop({ mutable: true })
  selectedControlId: string;

  private drake: Dragula.Drake;

  private ddDroppedEl: any;

  componentDidLoad() {
    this.initDragAndDrop();
    this.element.addEventListener("click", this.handleClick.bind(this));
  }

  componentWillUpdate() {
    this.restoreAfterDragDrop();
  }

  private initDragAndDrop() {
    this.drake = Dragula(
      Array.from(
        this.element.querySelectorAll(
          "gx-table-cell, gx-layout-editor-placeholder"
        )
      ),
      {
        accepts: (el, target) => {
          return !el.contains(target) && el.parentNode !== target;
        },
        copy: true,
        direction: "horizontal"
      }
    );

    this.drake.on("shadow", (el, container) => {
      const position =
        container.children.length === 1
          ? "empty"
          : el.nextSibling ? "left" : "right";
      container.setAttribute("data-active-target", position);
    });

    this.drake.on("out", (...parms) => {
      const [, container] = parms;
      container.removeAttribute("data-active-target");
    });

    this.drake.on("drag", () => {
      this.element.setAttribute("data-dragging", "");
    });

    this.drake.on("dragend", () => {
      this.element.removeAttribute("data-dragging");
    });

    this.drake.on("drop", (el, target, source) => {
      this.ddDroppedEl = el;
      if (!target) {
        return;
      }

      const controlId = source.getAttribute("data-cell-id");
      const targetRowId = target.getAttribute("data-row-id");
      const sourceRowId = source.getAttribute("data-row-id");

      if (target.getAttribute("data-placeholder") === "row") {
        // Dropped on a new row
        this.moveCompleted.emit({
          beforeRowId: target.getAttribute("data-next-row-id"),
          controlId,
          sourceRowId
        });
      } else {
        // Dropped on an existing row
        if (target.children.length === 1) {
          // Dropped on an empty cell
          this.moveCompleted.emit({
            controlId,
            sourceRowId,
            targetCellId: target.getAttribute("data-cell-id")
          });
        } else {
          // Dropped on a non-empty cell
          this.moveCompleted.emit({
            beforeControlId: el.nextSibling
              ? target.getAttribute("data-cell-id")
              : target.nextSibling
                ? target.nextSibling.getAttribute("data-cell-id")
                : null,
            controlId,
            sourceRowId,
            targetRowId
          });
        }
      }
    });
  }

  private restoreAfterDragDrop() {
    if (this.ddDroppedEl && this.ddDroppedEl.parentNode) {
      this.ddDroppedEl.parentNode.removeChild(this.ddDroppedEl);
    }
    this.ddDroppedEl = null;

    const activeTargets = Array.from(
      this.element.querySelectorAll("[data-active-target]")
    );
    for (const target of activeTargets) {
      target.removeAttribute("data-active-target");
    }
  }

  componentDidUpdate() {
    if (this.drake) {
      this.drake.containers = Array.from(
        this.element.querySelectorAll(
          "gx-table-cell, gx-layout-editor-placeholder"
        )
      );
    }
  }

  componentDidUnload() {
    this.drake.destroy();
  }

  render() {
    if (this.model && this.model.layout) {
      this.element.setAttribute(
        "data-selected",
        (!this.selectedControlId).toString()
      );
      return this.renderTable(this.model.layout.table);
    }
  }

  private renderTable(table) {
    const nonEmptyRows = table.row.filter(
      r => (Array.isArray(r.cell) && r.cell.length) || r.cell
    );
    const maxCols = nonEmptyRows.reduce(
      (acc, row) =>
        Math.max(acc, Array.isArray(row.cell) ? row.cell.length : 1),
      0
    );
    let rowsCount = 0;
    const rows = nonEmptyRows.map((row, i) => {
      rowsCount++;
      const rowCells = Array.isArray(row.cell) ? row.cell : [row.cell];

      let colStart = 0;
      const renderedCells = rowCells.map(cell => {
        colStart += parseInt(cell["@colSpan"], 10);
        return this.renderCell(cell, row["@id"], i, colStart);
      });

      return renderedCells;
    });

    return (
      <gx-table {...this.getTableStyle(rowsCount, maxCols)}>
        {[...rows, ...this.renderEmptyRows(nonEmptyRows, maxCols)]}
      </gx-table>
    );
  }

  private renderEmptyRows(nonEmptyRows, maxCols) {
    const emptyRowFn = (i, nextRow) => {
      const emptyCellStyle = {
        gridColumn: `1 / span ${maxCols}`,
        gridRow: `${i * 2 + 1} / span 1`
      };
      return (
        <gx-layout-editor-placeholder
          data-placeholder="row"
          style={emptyCellStyle}
          data-next-row-id={nextRow ? nextRow["@id"] : ""}
        />
      );
    };

    return [
      emptyRowFn(0, nonEmptyRows[0]),
      nonEmptyRows.map((...parms) => {
        const [, i] = parms;
        return emptyRowFn(
          i + 1,
          nonEmptyRows.length > i ? nonEmptyRows[i + 1] : null
        );
      })
    ];
  }

  private renderCell(cell, rowId, rowIndex, colStart) {
    const content = cell.table
      ? this.renderTable(cell.table)
      : controlResolver(cell);
    const editorCellStyle = {
      gridColumn: `${colStart} / span ${cell["@colSpan"]}`,
      gridRow: ` ${(rowIndex + 1) * 2} / span ${(parseInt(
        cell["@rowSpan"],
        10
      ) -
        1) *
        2 +
        1}`
    };

    return (
      <gx-table-cell
        data-cell-id={cell["@id"]}
        data-row-id={rowId}
        style={editorCellStyle}
        data-selected={this.selectedControlId === cell["@id"]}
      >
        {content}
      </gx-table-cell>
    );
  }

  private intercalateArray(arr, item) {
    return arr.reduce(
      (acc, o, i) =>
        o
          ? acc.concat(
              o,
              typeof item === "function" ? item.call(this, i) : item
            )
          : acc,
      [item]
    );
  }

  private getTableStyle(rowsCount, colsCount) {
    const baseRowsTemplate = new Array(rowsCount).fill("1fr", 0, rowsCount);
    const baseColsTemplate = new Array(colsCount).fill("1fr", 0, colsCount);

    return {
      "columns-template": baseColsTemplate.join(" "),
      "rows-template": this.intercalateArray(
        baseRowsTemplate,
        "var(--gx-le-table-placeholder-height)"
      ).join(" ")
    };
  }

  private handleClick(event: UIEvent) {
    const target: Element = event.target as Element;
    const control: any = this.findTargetControl(target);
    if (control) {
      this.selectedControlId = control.getAttribute("data-cell-id");
      this.controlSelected.emit({
        controlId:
          control.getAttribute("data-cell-id") || this.model.layout.table["@id"]
      });
    } else {
      this.selectedControlId = "";
    }
  }

  private findTargetControl(el: Element) {
    const tagName = el.tagName.toLowerCase();
    if (tagName === "gx-table-cell") {
      return el;
    }

    while (el) {
      const parent = el.parentElement;
      if (parent && parent.matches("gx-table-cell")) {
        return parent;
      }
      el = parent;
    }
  }
}
