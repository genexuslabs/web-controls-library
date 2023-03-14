/**
 * | Value            | Details                                                                                |
 * | ---------------- | -------------------------------------------------------------------------------------- |
 * | `column`         | Controls are displayed vertically, as a column (from top to bottom).                   |
 * | `column-reverse` | Controls are displayed vertically, as a column, in reverse order (from bottom to top). |
 * | `row`            | Controls are displayed horizontally, as a row (from left to right).                    |
 * | `row-reverse`    | Controls are displayed horizontally, as a row, in reverse order (from right to left).  |
 */
export type FlexDirection = "column" | "column-reverse" | "row" | "row-reverse";

/**
 * | Value          | Details                                                       |
 * | -------------- | ------------------------------------------------------------- |
 * | `nowrap`       | All flex items will be on one line                            |
 * | `wrap`         | Flex items will wrap onto multiple lines, from top to bottom. |
 * | `wrap-reverse` | Flex items will wrap onto multiple lines from bottom to top.  |
 */
export type FlexWrap = "nowrap" | "wrap" | "wrap-reverse";

export type ScrollDirection = "vertical" | "horizontal";
