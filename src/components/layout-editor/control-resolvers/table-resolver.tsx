import flexTableResolver from "./flex-table-resolver";
import tabularTableResolver from "./tabular-table-resolver";

const tableResolversMap = {
  Flex: flexTableResolver,
  Responsive: tabularTableResolver,
  Tabular: tabularTableResolver
};

export default function tableResolver(cell, context) {
  return tableResolversMap[cell.table["@tableType"]](cell, context);
}
