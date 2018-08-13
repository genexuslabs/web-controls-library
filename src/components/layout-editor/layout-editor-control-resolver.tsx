import actionResolver from "./control-resolvers/action-resolver";
import textblockResolver from "./control-resolvers/textblock-resolver";
import imageResolver from "./control-resolvers/image-resolver";
import tableResolver from "./control-resolvers/table-resolver";
import dataResolver from "./control-resolvers/data-resolver";
import componentResolver from "./control-resolvers/component-resolver";

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

export default function controlResolver(control, context) {
  const resolverObj = resolversMap.find(r => !!control[r.type]);
  if (resolverObj) {
    return resolverObj.resolver(control, context);
  }
  return null;
}

interface IResolverMapEntry {
  type: string;
  resolver: (control: any, context?: IResolverContext) => void;
}

interface IResolverContext {
  selectedCells: string[];
}
