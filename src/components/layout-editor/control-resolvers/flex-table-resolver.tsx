import controlResolver from "../layout-editor-control-resolver";

export default function flexTableResolver({ table }, context) {
  const modelRows = table.row
    ? Array.isArray(table.row) ? table.row : [table.row]
    : [];
  const isEmptyTable = modelRows.length === 0;
  const nonEmptyRows = modelRows.filter(
    r => (Array.isArray(r.cell) && r.cell.length) || r.cell
  );
  const rows = nonEmptyRows.map(row => {
    const rowCells = Array.isArray(row.cell) ? row.cell : [row.cell];

    const renderedCells = rowCells.map(cell => {
      return renderCell(cell, row["@id"], context, table["@flexDirection"]);
    });

    return renderedCells;
  });

  return (
    <div
      data-gx-le-control-id={table["@controlName"]}
      style={getTableStyle(table)}
      data-gx-le-container
      data-gx-le-container-empty={isEmptyTable}
      data-gx-le-flex-table
      data-gx-le-flex-table-direction={table["@flexDirection"].toLowerCase()}
    >
      {[...rows]}
    </div>
  );
}

function getTableStyle(table): any {
  return {
    alignItems: table["@alignItems"],
    display: "flex",
    flexDirection: table["@flexDirection"],
    flexWrap: table["@flexWrap"],
    justifyContent: table["@justifyContent"]
  };
}

function renderCell(cell, rowId, context, direction) {
  const editorCellStyle = {
    alignSelf: cell["@alignSelf"],
    flexGrow: cell["@flexGrow"],
    flexShrink: cell["@flexShrink"],
    height: cell["@flexHeight"],
    maxHeight: cell["@maxHeight"],
    maxWidth: cell["@maxWidth"],
    minHeight: cell["@minHeight"],
    minWidth: cell["@minWidth"],
    width: cell["@flexWidth"]
  };

  return (
    <div
      tabindex="0"
      data-gx-flex-cell
      data-gx-le-drop-area={direction === "Column" ? "vertical" : "horizontal"}
      data-gx-le-cell-id={cell["@id"]}
      data-gx-le-row-id={rowId}
      style={editorCellStyle}
      data-gx-le-selected={context.selectedCells.includes(cell["@id"])}
    >
      {controlResolver(cell, context)}
    </div>
  );
}
