# gx-table

A table control for creating grid layouts.

## Children

Its children must be gx-table-cell custom elements.

<!-- Auto Generated Below -->

## Properties

| Property           | Attribute           | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Type                                                                                        | Default      |
| ------------------ | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------ |
| `accessibleRole`   | `accessible-role`   | Specifies the semantics of the control. Specifying the Role allows assistive technologies to give information about how to use the control to the user.                                                                                                                                                                                                                                                                                                                            | `"article" \| "banner" \| "complementary" \| "contentinfo" \| "list" \| "main" \| "region"` | `undefined`  |
| `areasTemplate`    | `areas-template`    | Like the `grid-templates-areas` CSS property, this attribute defines a grid template by referencing the names of the areas which are specified with the cells [area attribute](../table-cell/readme.md#area). Repeating the name of an area causes the content to span those cells. A period signifies an empty cell. The syntax itself provides a visualization of the structure of the grid.                                                                                     | `string`                                                                                    | `null`       |
| `columnsTemplate`  | `columns-template`  | Like the `grid-templates-columns` CSS property, this attribute defines the columns of the grid with a space-separated list of values. The values represent the width of column.                                                                                                                                                                                                                                                                                                    | `string`                                                                                    | `null`       |
| `cssClass`         | `css-class`         | A CSS class to set as the `gx-table` element class.                                                                                                                                                                                                                                                                                                                                                                                                                                | `string`                                                                                    | `undefined`  |
| `disabled`         | `disabled`          | This attribute lets you specify if the element is disabled. If disabled, it will not fire any user interaction related event (for example, click event).                                                                                                                                                                                                                                                                                                                           | `boolean`                                                                                   | `false`      |
| `highlightable`    | `highlightable`     | True to highlight control when an action is fired.                                                                                                                                                                                                                                                                                                                                                                                                                                 | `boolean`                                                                                   | `false`      |
| `invisibleMode`    | `invisible-mode`    | This attribute lets you specify how this element will behave when hidden. \| Value \| Details \| \| ------------ \| --------------------------------------------------------------------------- \| \| `keep-space` \| The element remains in the document flow, and it does occupy space. \| \| `collapse` \| The element is removed form the document flow, and it doesn't occupy space. \|                                                                                       | `"collapse" \| "keep-space"`                                                                | `"collapse"` |
| `overflowBehavior` | `overflow-behavior` | This attribute lets you determine whether the gx-table control has a scroll or not. \| Value \| Details \| \| -------- \| ----------------------------------------------------------------------------------------------------------------- \| \| `scroll` \| The table provides scrollable behavior. When the table height exceeds the space available, a scroll bar is shown. \| \| `clip` \| The table doesn't provide scroll in any case; content is clipped at the bottom. \| | `"clip" \| "scroll"`                                                                        | `"clip"`     |
| `rowsTemplate`     | `rows-template`     | Like the `grid-templates-rows` CSS property, this attribute defines the rows of the grid with a space-separated list of values. The values represent the height of each row.                                                                                                                                                                                                                                                                                                       | `string`                                                                                    | `null`       |

## Events

| Event        | Description                                             | Type               |
| ------------ | ------------------------------------------------------- | ------------------ |
| `swipe`      | Emitted when the element is swiped.                     | `CustomEvent<any>` |
| `swipeDown`  | Emitted when the element is swiped downward direction.  | `CustomEvent<any>` |
| `swipeLeft`  | Emitted when the element is swiped left direction..     | `CustomEvent<any>` |
| `swipeRight` | Emitted when the element is swiped right direction.     | `CustomEvent<any>` |
| `swipeUp`    | Emitted when the element is swiped in upward direction. | `CustomEvent<any>` |

## CSS Custom Properties

| Name                  | Description                                                                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--gx-overflow-style` | Determine if the overflow will be hidden or visible. By default, the gx-table hide its content overflow to ensure that the border-radius property is applied. |

---

_Built with [StencilJS](https://stenciljs.com/)_
