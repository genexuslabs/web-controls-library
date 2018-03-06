# gx-table

A table control for creating grid layouts. It supports events like `click`, `tap` and `swipe`.

Take a look at the [common attributes, events and methods](../common/readme.md).

## Children

Its children must be gx-table-cell custom elements.

## Attributes

### areas-template
Like the `grid-templates-areas` CSS property, this attribute defines a grid template by referencing the names of the areas which are specified with the cells [area attribute](../table-cell/readme.md#area). Repeating the name of a area causes the content to span those cells. A period signifies an empty cell. The syntax itself provides a visualization of the structure of the grid.

### rows-template
Like the `grid-templates-rows` CSS property, this attribute defines the rows of the grid with a space-separated list of values. The values represent the height of each row.

### columns-template
Like the `grid-templates-columns` CSS property, this attribute defines the columns of the grid with a space-separated list of values. The values represent the width of column.
