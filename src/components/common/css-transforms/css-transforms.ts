const transforms = {
  highlighted: "gx-highlighted",
  highlightedActive: "-gx-highlighted-active",
  highlightedFocusWithin: "-gx-highlighted-focus-within",
  label: "-gx-label",
  labelHighlighted: "-gx-label-highlighted",
  vars: "-gx-vars"
};

export function tHighlighted(): string {
  return transforms["highlighted"];
}

export function tHighlightedActive(className: string): string {
  return className + transforms["highlightedActive"];
}

export function tHighlightedFocusWithin(className: string): string {
  return className + transforms["highlightedFocusWithin"];
}

export function tVars(className: string): string {
  return className + transforms["vars"];
}

export function tLabel(className: string): string {
  return className + transforms["label"];
}

export function tLabelHighlighted(className: string): string {
  return className + transforms["labelHighlighted"];
}
