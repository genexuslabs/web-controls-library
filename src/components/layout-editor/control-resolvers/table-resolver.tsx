import flexTableResolver from "./flex-table-resolver";
import responsiveTableResolver from "./responsive-table-resolver";
import tabularTableResolver from "./tabular-table-resolver";

const tableResolversMap = {
  Flex: flexTableResolver,
  Responsive: responsiveTableResolver,
  Tabular: tabularTableResolver
};

export default function tableResolver(cell, context) {
  return tableResolversMap[cell.table["@tableType"]](cell, context);
}
