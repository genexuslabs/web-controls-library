import {
  IResolverContext,
  controlResolver,
  isCellSelected
} from "../layout-editor-control-resolver";

export default function freestyleGridResolver(
  { grid },
  context: IResolverContext
) {
  return (
    <div
      css-class={grid["@class"]}
      data-gx-le-control-id={grid["@id"]}
      data-gx-le-control-header-bar
      data-gx-le-selected={isCellSelected(grid, context).toString()}
      style={{ "--gx-le-control-header-bar-text": `'${grid.controlType}'` }}
    >
      {controlResolver(grid, context)}
    </div>
  );
}
