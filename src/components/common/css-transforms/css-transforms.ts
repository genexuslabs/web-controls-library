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

/**
 * @param cssClass Classes of the control
 * @param highlightOption Function type to be applied in the second return value
 * @returns For each class in the `cssClass` param, return two string that match the variables and highlighted classes of the control.
 */
export function getClasses(cssClass: string, highlightOption = 2): any {
  // If the cssClass is empty, we return empty classes
  if (!cssClass) {
    return { vars: "", highlighted: "" };
  }
  const splitedClasses = cssClass.split(" ");

  const vars = splitedClasses.map(tVars).join(" ");
  let highlighted: string;

  switch (highlightOption) {
    case 0:
      highlighted = splitedClasses.map(tHighlighted).join(" ");
      break;

    case 1:
      highlighted = splitedClasses.map(tHighlightedActive).join(" ");
      break;

    default:
      highlighted = splitedClasses.map(tHighlightedFocusWithin).join(" ");
      break;
  }
  return { vars, highlighted };
}
