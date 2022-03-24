const transforms = {
  formField: "-gx-form-field",
  highlighted: "gx-highlighted",
  highlightedActive: "-gx-highlighted-active",
  highlightedFocusWithin: "-gx-highlighted-focus-within",
  vars: "-gx-vars"
};

export function tFormField(className: string): string {
  return className + transforms["formField"];
}

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
