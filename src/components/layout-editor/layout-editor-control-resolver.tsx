import actionResolver from "./control-resolvers/action-resolver";
import componentResolver from "./control-resolvers/component-resolver";
import dataResolver from "./control-resolvers/data-resolver";
import defaultResolver from "./control-resolvers/default-resolver";
import freestyleGridResolver from "./control-resolvers/freestyle-grid-resolver";
import imageResolver from "./control-resolvers/image-resolver";
import tableResolver from "./control-resolvers/table-resolver";
import textblockResolver from "./control-resolvers/textblock-resolver";

const resolversMap: IResolverMapEntry[] = [
  {
    resolver: actionResolver,
    type: "action"
  },
  {
    resolver: componentResolver,
    type: "component"
  },
  {
    resolver: dataResolver,
    type: "data"
  },
  {
    resolver: freestyleGridResolver,
    type: "grid"
  },
  {
    resolver: imageResolver,
    type: "image"
  },
  {
    resolver: textblockResolver,
    type: "textblock"
  },
  {
    resolver: tableResolver,
    type: "table"
  }
];

export function controlResolver(control, context: IResolverContext) {
  if (control.childControlType) {
    const resolverObj = findResolverByType(control.childControlType);

    if (resolverObj) {
      return resolverObj.resolver(control, context);
    } else {
      return defaultResolver(control);
    }
  }
  return null;
}

function findResolverByType(type: string): IResolverMapEntry {
  return resolversMap.find(r => r.type === type);
}

export function isCellSelected(cell, context: IResolverContext): boolean {
  const controlToVerify = findChildControl(cell) || cell;
  for (const selControl of context.selectedControls) {
    if (selControl === controlToVerify["@id"]) {
      return true;
    }
  }

  return false;
}

function findChildControl(cell): any {
  const resolver = findResolverByType(cell.childControlType);
  if (!resolver) {
    return null;
  }
  return cell[resolver.type];
}

interface IResolverMapEntry {
  type: string;
  resolver: (control: any, context?: IResolverContext) => void;
}

export interface IResolverContext {
  selectedControls: string[];
}
