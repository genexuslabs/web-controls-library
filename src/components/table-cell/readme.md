# gx-table-cell

A cell of a [gx-table](../table/readme.md) control, for creating grid layouts.

<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description                                                                                                                                                                                                                                                                                                                                                                                         | Type                            | Default     |
| -------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- | ----------- |
| `align`        | `align`         | Defines the horizontal aligmnent of the content of the cell.                                                                                                                                                                                                                                                                                                                                        | `"center" \| "left" \| "right"` | `"left"`    |
| `area`         | `area`          | Like the `grid-area` CSS property, this attribute gives a name to the item, so it can be used from the [areas-template attributes](../table/readme.md#areas-template) of the gx-table element.                                                                                                                                                                                                      | `string`                        | `undefined` |
| `maxHeight`    | `max-height`    | This attribute defines the maximum height of the cell.                                                                                                                                                                                                                                                                                                                                              | `string`                        | `undefined` |
| `minHeight`    | `min-height`    | This attribute defines the minimum height of the cell when its contents are visible. Ignored if its content has `invisible-mode` = `collapse` and is hidden.                                                                                                                                                                                                                                        | `string`                        | `undefined` |
| `overflowMode` | `overflow-mode` | This attribute defines how the control behaves when the content overflows.  \| Value    \| Details                                                     \| \| -------- \| ----------------------------------------------------------- \| \| `scroll` \| The overflowin content is hidden, but scrollbars are shown  \| \| `clip`   \| The overflowing content is hidden, without scrollbars       \| | `"clip" \| "scroll"`            | `undefined` |
| `valign`       | `valign`        | Defines the vertical aligmnent of the content of the cell.                                                                                                                                                                                                                                                                                                                                          | `"bottom" \| "medium" \| "top"` | `"top"`     |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
