# gx-layout-editor

A WYSIWYG editor for GeneXus abstract forms.

A set of special attributes are used to annotate container web components and its direct child items where it will be able to drag and drop controls.

| Data attribute name        | Details                                                                                                                                                                                                                 |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data-gx-le-container`     | Used to mark an element as a container                                                                                                                                                                                  |
| `data-gx-le-drop-area`     | Used to mark an element as container item that accepts drag&drop of controls                                                                                                                                            |
| `data-gx-le-cell-id`       | Used to store the identifier of a container item. Typically obtained from the abstract form model "@id" property of the row cell                                                                                        |
| `data-gx-le-row-id`        | Used to store the identifier of a container item's row. Typically obtained from the abstract form model "@id" property of the parent row of the cell                                                                    |
| `data-gx-le-selected`      | Used to mark a container item as selected                                                                                                                                                                               |
| `data-gx-le-next-row-id`   | Used to store the identifier of a container item's next row (if it isn't located in the last row). Typically obtained from the abstract form model "@id" property of the row that is next to the parent row of the cell |
| `data-gx-le-active-target` | Used to mark a container item as an active drop target                                                                                                                                                                  |  |
| `data-gx-le-dragging`      | Used to mark the layout editor as in dragging state                                                                                                                                                                     |

## CSS variables

| CSS variable name                          | Details                                                             |
| ------------------------------------------ | ------------------------------------------------------------------- |
| `--gx-le-table-cell-border`                | Container item border                                               |
| `--gx-le-table-min-height`                 | Container minimum height                                            |
| `--gx-le-table-placeholder-width`          | Width of drop placeholder (when a vertical placeholder is shown)    |
| `--gx-le-table-placeholder-height`         | Height of drop placeholder (when a horizontal placeholder is shown) |
| `--gx-le-table-placeholder-color`          | Drop placeholder color                                              |
| `--gx-le-table-selected-cell-border-color` | Selected container item border color                                |
| `--gx-le-table-selected-cell-border-width` | Selected container item border width                                |

<!-- Auto Generated Below -->

## Properties

#### model

any

The abstract form model object

#### selectedControlId

string

Identifier of the selected control. If empty the whole layout-editor is marked as selected.

## Attributes

#### model

any

The abstract form model object

#### selected-control-id

string

Identifier of the selected control. If empty the whole layout-editor is marked as selected.

## Events

#### controlSelected

Fired when the selection has been changed

An object containing information of the select operation is sent in the `detail` property of the event object

| Property    | Details                         |
| ----------- | ------------------------------- |
| `controlId` | Identifier of the selected cell |

#### moveCompleted

Fired when a control is moved inside the layout editor to a new location

An object containing information of the move operation is sent in the `detail` property of the event object

* When the dragged item was dropped on a new row:

| Property      | Details                                                                                                          |
| ------------- | ---------------------------------------------------------------------------------------------------------------- |
| `beforeRowId` | Identifier of the row next to the row where the control was dropped. An empty string if dropped in the last row. |
| `controlId`   | Identifier of the source cell                                                                                    |
| `sourceRowId` | Identifier of the source row                                                                                     |

* When the dragged item was dropped on an existing empty cell:

| Property       | Details                                              |
| -------------- | ---------------------------------------------------- |
| `targetCellId` | Identifier of the cell where the control was dropped |
| `controlId`    | Identifier of the source cell                        |
| `sourceRowId`  | Identifier of the source row                         |

* When the dragged item was dropped on an existing non-empty cell:

| Property          | Details                                                                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `beforeControlId` | Identifier of the cell that, after the drop operation, ends located after the dropped control. An empty string if dropped as the last cell. |
| `targetRowId`     | Identifier of the row where the control was dropped                                                                                         |
| `controlId`       | Identifier of the source cell                                                                                                               |
| `sourceRowId`     | Identifier of the source row                                                                                                                |

---

_Built with [StencilJS](https://stenciljs.com/)_
