import { CssClasses, CssTransformedClassesWithoutFocus } from "../interfaces";

// Classes used to implement styles when a control is clicked
export const HIGHLIGHT_EVENT_NAME = "highlight";
export const UNHIGHTLIGHT_EVENT_NAME = "unhighlight";
export const HIGHLIGHT_CLASS_NAME = "gx-highlighted";

// Transforms to implement gx-properties
const transforms = {
  description: "--description",
  evenRow: "--even-row",
  groupCaption: "--group-caption",
  hover: "--hover",
  horizontalLine: "--horizontal-line",
  label: "--label",
  labelContainer: "--label-container",
  labelHighlighted: "--label-highlighted",
  labelPositionLeft: "--label-position-left",
  labelPositionRight: "--label-position-right",
  loading: "--loading",
  oddRow: "--odd-row",
  selectedTabCaption: "--selected-tab-page",
  tabsPosition: "--tabs-position",
  tabsPositionCaption: "--tabs-position-caption",
  title: "--title",
  unselectedTabCaption: "--unselected-tab-page",
  vars: "--vars"
};

// - - - - - - - - -  CACHE  - - - - - - - - -
const classesCache = new Map<string, CssClasses>();
const transformedClassesWoFocusCache = new Map<
  string,
  CssTransformedClassesWithoutFocus
>();

// - - - - - - - -  Transforms  - - - - - - - -
export function tDescription(className: string): string {
  return className + transforms["description"];
}

export function tEvenRow(className: string): string {
  return className + transforms["evenRow"];
}

export function tGroupCaption(className): string {
  return className + transforms["groupCaption"];
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

export function tLoading(className: string): string {
  return className + transforms["loading"];
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

export function tTitle(className: string): string {
  return className + transforms["title"];
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
 * @returns For each class in the `cssClass` param, return one string that match the variable classes of the control.
 */
export function getClasses(cssClass: string): CssClasses {
  // If the cssClass is empty, we return empty classes
  if (!cssClass) {
    return { vars: "" };
  }
  let result: CssClasses = classesCache.get(cssClass);

  // If the value has not yet been calculated
  if (result === undefined) {
    const vars = cssClass
      .split(" ")
      .map(tVars)
      .join(" ");

    // Cache for the corresponding value
    result = { vars };
    classesCache.set(cssClass, result);
  }

  return result;
}

/**
 * @param cssClass Classes of the control
 * @param tClass Function to transform the cssClass param. Useful for gx-grid cells
 * @returns For each class in the `cssClass` param, return two strings that match the variable and transformed classes of the control.
 */
export function getTransformedClassesWithoutFocus(
  cssClass: string,
  tClass: (x: string) => string
): CssTransformedClassesWithoutFocus {
  // If the cssClass is empty, we return empty classes
  if (!cssClass) {
    return { transformedCssClass: "", vars: "" };
  }
  const cacheKey = `${tClass.name}_${cssClass}`;
  let result: CssTransformedClassesWithoutFocus = transformedClassesWoFocusCache.get(
    cacheKey
  );

  // If the value has not yet been calculated
  if (result == undefined) {
    const splittedClasses = cssClass.split(" ").map(tClass);

    const transformedCssClass = splittedClasses.join(" ");
    const vars = splittedClasses.map(tVars).join(" ");

    // Cache for the corresponding value
    result = { transformedCssClass, vars };
    transformedClassesWoFocusCache.set(cacheKey, result);
  }

  return result;
}
