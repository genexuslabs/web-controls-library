const transforms = {
  groupCaption: "-gx-group-caption",
  highlighted: "-gx-highlighted",
  highlightedActive: "-gx-highlighted-active",
  highlightedFocusWithin: "-gx-highlighted-focus-within",
  hover: "-gx-hover",
  label: "-gx-label",
  labelHighlighted: "-gx-label-highlighted",
  vars: "-gx-vars"
};

export function tGroupCaption(className): string {
  return className + transforms["groupCaption"];
}

export function tHighlighted(className): string {
  return className + transforms["highlighted"];
}

export function tHighlightedActive(className: string): string {
  return className + transforms["highlightedActive"];
}

export function tHighlightedFocusWithin(className: string): string {
  return className + transforms["highlightedFocusWithin"];
}

export function tHover(className: string): string {
  return className + transforms["hover"];
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
export function getClasses(cssClass: string, highlightOption = 1): any {
  // If the cssClass is empty, we return empty classes
  if (!cssClass) {
    return { vars: "", highlighted: "", hover: "" };
  }
  const splitedClasses = cssClass.split(" ");

  const vars = splitedClasses.map(tVars).join(" ");
  const hover = splitedClasses.map(tHover).join(" ");
  let highlighted: string;

  switch (highlightOption) {
    case 0:
      highlighted = splitedClasses.map(tHighlightedActive).join(" ");
      break;

    case 1:
      highlighted = splitedClasses.map(tHighlightedFocusWithin).join(" ");
      break;

    default:
      highlighted = "";
  }
  return { vars, highlighted, hover };
}
