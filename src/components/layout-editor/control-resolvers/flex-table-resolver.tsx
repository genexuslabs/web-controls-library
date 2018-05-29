import controlResolver from "../layout-editor-control-resolver";

export default function flexTableResolver({ table }, context) {
  const modelRows = Array.isArray(table.row) ? table.row : [table.row];
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
    <div style={getTableStyle(table)} data-gx-le-container>
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
      data-gx-flex-cell
      data-gx-le-drop-area={direction == "Column" ? "vertical" : "horizontal"}
      data-gx-le-cell-id={cell["@id"]}
      data-gx-le-row-id={rowId}
      style={editorCellStyle}
      data-gx-le-selected={context.selectedControlId === cell["@id"]}
    >
      {controlResolver(cell, context)}
    </div>
  );
}
