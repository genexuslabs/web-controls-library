# gx-query-viewer-element

<!-- Auto Generated Below -->

## Properties

| Property                   | Attribute                       | Description                            | Type                                                             | Default     |
| -------------------------- | ------------------------------- | -------------------------------------- | ---------------------------------------------------------------- | ----------- |
| `aggregation`              | `aggregation`                   | Aggregation fucntion                   | `"Average" \| "Count" \| "Max" \| "Min" \| "Sum"`                | `undefined` |
| `axis`                     | `axis`                          | Which axis, row or column              | `"Columns" \| "Pages" \| "Rows"`                                 | `undefined` |
| `axisOrderType`            | `axis-order-type`               | Axis Order type                        | `"Ascending" \| "Custom" \| "Descending" \| "None"`              | `undefined` |
| `axisOrderValues`          | `axis-order-values`             | Axis order values comma separated      | `string`                                                         | `undefined` |
| `dataField`                | `data-field`                    | Data field                             | `string`                                                         | `undefined` |
| `elementTitle`             | `element-title`                 | Title to show                          | `string`                                                         | `undefined` |
| `expandCollapseType`       | `expand-collapse-type`          | Expand collapse type                   | `"CollapseAllValues" \| "ExpandAllValues" \| "ExpandSomeValues"` | `undefined` |
| `expandCollapseValues`     | `expand-collapse-values`        | Expand collapse values comma separated | `string`                                                         | `undefined` |
| `filterType`               | `filter-type`                   | Type of the filter                     | `"HideAllValues" \| "ShowAllValues" \| "ShowSomeValues"`         | `undefined` |
| `filterValues`             | `filter-values`                 | Filter values comma separated          | `string`                                                         | `undefined` |
| `groupingDayOfWeekTitle`   | `grouping-day-of-week-title`    | Grouping by day of week title          | `string`                                                         | `undefined` |
| `groupingGroupByDayOfWeek` | `grouping-group-by-day-of-week` | Grouping by day of week                | `boolean`                                                        | `undefined` |
| `groupingGroupByMonth`     | `grouping-group-by-month`       | Grouping by month                      | `boolean`                                                        | `undefined` |
| `groupingGroupByQuarter`   | `grouping-group-by-quarter`     | Grouping by Quarter                    | `boolean`                                                        | `undefined` |
| `groupingGroupBySemester`  | `grouping-group-by-semester`    | Grouping by semester                   | `boolean`                                                        | `undefined` |
| `groupingGroupByYear`      | `grouping-group-by-year`        | Grouping by year                       | `boolean`                                                        | `undefined` |
| `groupingHideValue`        | `grouping-hide-value`           | Grouping hide vale                     | `boolean`                                                        | `undefined` |
| `groupingMonthTitle`       | `grouping-month-title`          | Grouping by month title                | `string`                                                         | `undefined` |
| `groupingQuarterTitle`     | `grouping-quarter-title`        | Grouping by Quarter title              | `string`                                                         | `undefined` |
| `groupingSemesterTitle`    | `grouping-semester-title`       | Grouping by Semster title              | `string`                                                         | `undefined` |
| `groupingYearTitle`        | `grouping-year-title`           | Gouping by Year title                  | `string`                                                         | `undefined` |
| `name`                     | `name`                          | Name of the element                    | `string`                                                         | `undefined` |
| `raiseItemClick`           | `raise-item-click`              | Raise item click                       | `boolean`                                                        | `undefined` |
| `type`                     | `type`                          | Type of the element                    | `"Axis" \| "Datum"`                                              | `undefined` |
| `visible`                  | `visible`                       | How to show it                         | `"Always" \| "Never" \| "No" \| "Yes"`                           | `undefined` |

## Events

| Event            | Description | Type               |
| ---------------- | ----------- | ------------------ |
| `elementChanged` |             | `CustomEvent<any>` |

---

_Built with [StencilJS](https://stenciljs.com/)_
