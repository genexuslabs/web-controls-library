import actionResolver from "./control-resolvers/action-resolver";
import textblockResolver from "./control-resolvers/textblock-resolver";
import imageResolver from "./control-resolvers/image-resolver";

const resolversMap: IResolverMapEntry[] = [
  {
    resolver: actionResolver,
    type: "action"
  },
  {
    resolver: imageResolver,
    type: "image"
  },
  {
    resolver: textblockResolver,
    type: "textblock"
  }
];

export function controlResolver(control) {
  const resolverObj = resolversMap.find(r => !!control[r.type]);
  if (resolverObj) {
    return resolverObj.resolver(control);
  }

  return null;
}

interface IResolverMapEntry {
  type: string;
  resolver: (control: any) => void;
}
