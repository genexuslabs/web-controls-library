# gx-table-cell

A cell of a [gx-table](../table/readme.md) control, for creating grid layouts.

<!-- Auto Generated Below -->

## Properties

| Property          | Attribute           | Description                                                                                                                                                                                    | Type                            | Default     |
| ----------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- | ----------- |
| `align`           | `align`             | Defines the horizontal alignment of the content of the cell.                                                                                                                                   | `"center" \| "left" \| "right"` | `undefined` |
| `area`            | `area`              | Like the `grid-area` CSS property, this attribute gives a name to the item, so it can be used from the [areas-template attributes](../table/readme.md#areas-template) of the gx-table element. | `string`                        | `null`      |
| `maxHeight`       | `max-height`        | This attribute defines the maximum height of the cell.                                                                                                                                         | `string`                        | `null`      |
| `minHeight`       | `min-height`        | This attribute defines the minimum height of the cell when its contents are visible. Ignored if its content has `invisible-mode` = `collapse` and is hidden.                                   | `string`                        | `undefined` |
| `showContentFade` | `show-content-fade` | True to add a fading overlay on the right and bottom area of the cell to signify that the content is longer than the space allows.                                                             | `boolean`                       | `false`     |
| `valign`          | `valign`            | Defines the vertical alignment of the content of the cell.                                                                                                                                     | `"bottom" \| "middle" \| "top"` | `undefined` |

---

_Built with [StencilJS](https://stenciljs.com/)_
