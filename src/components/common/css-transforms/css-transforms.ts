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
  horizontalLine: "--horizontal-line",
  label: "--label",
  labelContainer: "--label-container",
  labelHighlighted: "--label-highlighted",
  labelWidth: "--label-width",
  loading: "--loading",
  oddRow: "--odd-row",
  selectedTabCaption: "--selected-tab-page",
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
export const tDescription = (className: string): string =>
  className + transforms["description"];

export const tEvenRow = (className: string): string =>
  className + transforms["evenRow"];

export const tGroupCaption = (className: string): string =>
  className + transforms["groupCaption"];

export const tHorizontalLine = (className: string): string =>
  className + transforms["horizontalLine"];

export const tLabel = (className: string): string =>
  className + transforms["label"];

export const tLabelContainer = (className: string): string =>
  className + transforms["labelContainer"];

export const tLabelHighlighted = (className: string): string =>
  className + transforms["labelHighlighted"];

export const tLabelWidth = (className: string): string =>
  className + transforms["labelWidth"];

export const tLoading = (className: string): string =>
  className + transforms["loading"];

export const tOddRow = (className: string): string =>
  className + transforms["oddRow"];

export const tSelectedTabCaption = (className: string): string =>
  !className ? "" : className + transforms["selectedTabCaption"];

export const tTitle = (className: string): string =>
  className + transforms["title"];

export const tUnselectedTabCaption = (className: string): string =>
  !className ? "" : className + transforms["unselectedTabCaption"];

export const tVars = (className: string): string =>
  className + transforms["vars"];

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
    const vars = cssClass.split(" ").map(tVars).join(" ");

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
  let result: CssTransformedClassesWithoutFocus =
    transformedClassesWoFocusCache.get(cacheKey);

  // If the value has not yet been calculated
  if (!result) {
    const splittedClasses = cssClass.split(" ").map(tClass);

    const transformedCssClass = splittedClasses.join(" ");
    const vars = splittedClasses.map(tVars).join(" ");

    // Cache for the corresponding value
    result = { transformedCssClass, vars };
    transformedClassesWoFocusCache.set(cacheKey, result);
  }

  return result;
}
