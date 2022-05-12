import { CssClasses } from "../interfaces";

const transforms = {
  evenRow: "-gx-even-row",
  groupCaption: "-gx-group-caption",
  highlighted: "-gx-highlighted",
  highlightedFocusWithin: "-gx-highlighted-focus-within",
  hover: "-gx-hover",
  horizontalLine: "-gx-horizontal-line",
  label: "-gx-label",
  labelContainer: "-gx-label-container",
  labelHighlighted: "-gx-label-highlighted",
  labelPositionLeft: "-gx-label-position-left",
  labelPositionRight: "-gx-label-position-right",
  oddRow: "-gx-odd-row",
  selectedTabCaption: "-gx-selected-tab-caption",
  tabsPosition: "-gx-tabs-position",
  tabsPositionCaption: "-gx-tabs-position-caption",
  unselectedTabCaption: "-gx-unselected-tab-caption",
  vars: "-gx-vars"
};

export function tEvenRow(className: string): string {
  return className + transforms["evenRow"];
}

export function tGroupCaption(className): string {
  return className + transforms["groupCaption"];
}

export function tHighlighted(className): string {
  return className + transforms["highlighted"];
}

export function tHighlightedFocusWithin(className: string): string {
  return className + transforms["highlightedFocusWithin"];
}

export function tHover(className: string): string {
  return className + transforms["hover"];
}

export function tHorizontalLine(className: string): string {
  return className + transforms["horizontalLine"];
}

export function tLabel(className: string): string {
  return className + transforms["label"];
}

export function tLabelContainer(className: string): string {
  return className + transforms["labelContainer"];
}

export function tLabelHighlighted(className: string): string {
  return className + transforms["labelHighlighted"];
}

export function tLabelPositionLeft(className: string): string {
  return className + transforms["labelPositionLeft"];
}

export function tLabelPositionRight(className: string): string {
  return className + transforms["labelPositionRight"];
}

export function tOddRow(className: string): string {
  return className + transforms["oddRow"];
}

export function tSelectedTabCaption(className: string): string {
  if (!className) {
    return "";
  }
  return className + transforms["selectedTabCaption"];
}

export function tTabsPosition(className: string): string {
  return className + transforms["tabsPosition"];
}

export function tTabsPositionCaption(className: string): string {
  return className + transforms["tabsPositionCaption"];
}

export function tUnselectedTabCaption(className: string): string {
  if (!className) {
    return "";
  }
  return className + transforms["unselectedTabCaption"];
}

export function tVars(className: string): string {
  return className + transforms["vars"];
}

/**
 * @param cssClass Classes of the control
 * @param highlightOption Function type to be applied in the second return value
 * @param tClass Function to transform the cssClass param. Useful for gx-grid cells
 * @returns For each class in the `cssClass` param, return two string that match the variables and highlighted classes of the control.
 */
export function getClasses(
  cssClass: string,
  highlightOption = 1,
  tClass?: (x: string) => string
): CssClasses {
  // If the cssClass is empty, we return empty classes
  if (!cssClass) {
    return { transformedCssClass: "", highlighted: "", hover: "", vars: "" };
  }
  const splittedClasses =
    tClass == undefined ? cssClass.split(" ") : cssClass.split(" ").map(tClass);

  const transformedCssClass = splittedClasses.join(" ");
  const highlighted =
    highlightOption === 1
      ? splittedClasses.map(tHighlightedFocusWithin).join(" ")
      : "";
  const hover = splittedClasses.map(tHover).join(" ");
  const vars = splittedClasses.map(tVars).join(" ");

  return { transformedCssClass, highlighted, hover, vars };
}
