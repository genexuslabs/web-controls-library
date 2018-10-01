# gx-table

A table control for creating grid layouts.

## Children

Its children must be gx-table-cell custom elements.

<!-- Auto Generated Below -->

## Properties

| Property          | Attribute          | Description                                                                                                                                                                                                                                                                                                                                                                                    | Type      |
| ----------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `areasTemplate`   | `areas-template`   | Like the `grid-templates-areas` CSS property, this attribute defines a grid template by referencing the names of the areas which are specified with the cells [area attribute](../table-cell/readme.md#area). Repeating the name of an area causes the content to span those cells. A period signifies an empty cell. The syntax itself provides a visualization of the structure of the grid. | `string`  |
| `columnsTemplate` | `columns-template` | Like the `grid-templates-columns` CSS property, this attribute defines the columns of the grid with a space-separated list of values. The values represent the width of column.                                                                                                                                                                                                                | `string`  |
| `disabled`        | `disabled`         | This attribute lets you specify if the element is disabled. If disabled, it will not fire any user interaction related event (for example, click event).                                                                                                                                                                                                                                       | `boolean` |
| `invisibleMode`   | `invisible-mode`   | This attribute lets you specify how this element will behave when hidden.                                                                                                                                                                                                                                                                                                                      | Value     | Details |  | ------------ | --------------------------------------------------------------------------- |  | `keep-space` | The element remains in the document flow, and it does occupy space. |  | `collapse` | The element is removed form the document flow, and it doesn't occupy space. |  | `"collapse"`, `"keep-space"` |
| `rowsTemplate`    | `rows-template`    | Like the `grid-templates-rows` CSS property, this attribute defines the rows of the grid with a space-separated list of values. The values represent the height of each row.                                                                                                                                                                                                                   | `string`  |

## Events

| Event     | Description                          |
| --------- | ------------------------------------ |
| `onClick` | Emitted when the element is clicked. |

---

_Built with [StencilJS](https://stenciljs.com/)_
