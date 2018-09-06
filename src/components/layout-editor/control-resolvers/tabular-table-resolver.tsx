import {
  IResolverContext,
  controlResolver,
  isCellSelected
} from "../layout-editor-control-resolver";

export default function tabularTableResolver(
  { table },
  context: IResolverContext
) {
  const modelRows = table.row
    ? Array.isArray(table.row) ? table.row : [table.row]
    : [];

  const isEmptyTable = modelRows.length === 0;
  const nonEmptyRows = modelRows.filter(
    r => (Array.isArray(r.cell) && r.cell.length) || r.cell
  );
  const maxCols = nonEmptyRows.reduce(
    (acc, row) => Math.max(acc, Array.isArray(row.cell) ? row.cell.length : 1),
    0
  );
  let rowsCount = 0;
  const rows = nonEmptyRows.map((row, i) => {
    rowsCount++;
    const rowCells = Array.isArray(row.cell) ? row.cell : [row.cell];

    let colStart = 0;
    const renderedCells = rowCells.map(cell => {
      colStart += parseInt(getCellColSpan(cell), 10);
      return renderCell(cell, row["@id"], i, colStart, context);
    });

    return renderedCells;
  });

  return (
    <gx-table
      {...getTableStyle(rowsCount, maxCols)}
      data-gx-le-container
      data-gx-le-container-empty={isEmptyTable.toString()}
      data-gx-le-control-id={table["@id"]}
    >
      {[...rows, ...renderEmptyRows(nonEmptyRows, maxCols)]}
    </gx-table>
  );
}

function getTableStyle(rowsCount, colsCount) {
  const baseRowsTemplate = new Array(rowsCount).fill("auto", 0, rowsCount);
  const baseColsTemplate = new Array(colsCount).fill("1fr", 0, colsCount);

  return {
    "columns-template": baseColsTemplate.join(" "),
    "rows-template": intercalateArray(
      baseRowsTemplate,
      "var(--gx-le-table-cell-gap)"
    ).join(" ")
  };
}

function renderEmptyRows(nonEmptyRows, maxCols) {
  const emptyRowFn = (i, nextRow) => {
    const emptyCellStyle = {
      "grid-column": `1 / span ${maxCols}`,
      "grid-row": `${i * 2 + 1} / span 1`
    };
    return (
      <gx-layout-editor-placeholder
        data-gx-le-placeholder="row"
        style={emptyCellStyle}
        data-gx-le-next-row-id={nextRow ? nextRow["@id"] : ""}
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

function renderCell(cell, rowId, rowIndex, colStart, context) {
  const rowSpan = (parseInt(getCellRowSpan(cell), 10) - 1) * 2 + 1;
  const colSpan = getCellColSpan(cell);
  const rowStart = (rowIndex + 1) * 2;

  return (
    <gx-table-cell
      tabindex="0"
      key={cell["@id"]}
      data-gx-le-cell-id={cell["@id"]}
      data-gx-le-drop-area="horizontal"
      data-gx-le-row-id={rowId}
      style={{
        "--gx-le-control-type-name":
          cell.controlType && `"${cell.controlType}"`,
        "grid-column": `${colStart} / span ${colSpan}`,
        "grid-row": ` ${rowStart} / span ${rowSpan}`
      }}
      data-gx-le-selected={isCellSelected(cell, context).toString()}
    >
      {controlResolver(cell, context)}
    </gx-table-cell>
  );
}

function intercalateArray(arr, item) {
  return arr.reduce((acc, o) => (o ? acc.concat(o, item) : acc), [item]);
}

function getCellRowSpan(cell) {
  return cell["@rowSpan"] || "1";
}

function getCellColSpan(cell) {
  return cell["@colSpan"] || "1";
}
