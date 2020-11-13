# gx-grid-fs

A container for including a repetitive elements list.
It provides 3 slots:

- `'grid-content'` slot: This slot holds the grid's content
- 'grid-content-empty' slot: This slot will be shown only when the grid is empty.
- 'grid-loading-content': This slot will be shown while the grid is being loaded. Include the loading indicator markup here.

When the grid is empty, a CSS Class named 'gx-grid-empty' is added to the host element.
When the grid is loading, a CSS Class named 'gx-grid-loading' is added to the host element.

<!-- Auto Generated Below -->

## Properties

| Property         | Attribute          | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Type                           | Default      |
| ---------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | ------------ |
| `autoGrow`       | `auto-grow`        | This attribute defines if the control size will grow automatically, to adjust to its content size. If set to `false`, it won't grow automatically and it will show scrollbars if the content overflows.                                                                                                                                                                                                                                                                                           | `boolean`                      | `false`      |
| `direction`      | `direction`        | Specifies the direction of the flexible items.                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `"horizontal" \| "vertical"`   | `"vertical"` |
| `invisibleMode`  | `invisible-mode`   | This attribute lets you specify how this element will behave when hidden. \| Value \| Details \| \| ------------ \| --------------------------------------------------------------------------- \| \| `keep-space` \| The element remains in the document flow, and it does occupy space. \| \| `collapse` \| The element is removed form the document flow, and it doesn't occupy space. \|                                                                                                      | `"collapse" \| "keep-space"`   | `"collapse"` |
| `itemLayoutMode` | `item-layout-mode` | Grid Item Layout Mode: Single, Multiple by quantity, multiple by size.                                                                                                                                                                                                                                                                                                                                                                                                                            | `"mbyq" \| "mbys" \| "single"` | `"single"`   |
| `loadingState`   | `loading-state`    | Grid loading State. It's purpose is to know rather the Grid Loading animation or the Grid Empty placeholder should be shown. \| Value \| Details \| \| ------------ \| ---------------------------------------------------------------------------------------------- \| \| `loading` \| The grid is waiting the server for the grid data. Grid loading mask will be shown. \| \| `loaded` \| The grid data has been loaded. If the grid has no records, the empty place holder will be shown. \| | `"loaded" \| "loading"`        | `undefined`  |
| `recordCount`    | `record-count`     | Grid current row count. This property is used in order to be able to re-render the Grid every time the Grid data changes. If not specified, then grid empty and loading placeholders may not work correctly.                                                                                                                                                                                                                                                                                      | `number`                       | `undefined`  |
| `snapToGrid`     | `snap-to-grid`     | Scroll snapping allows to lock the viewport to certain elements or locations after a user has finished scrolling                                                                                                                                                                                                                                                                                                                                                                                  | `boolean`                      | `false`      |
| `threshold`      | `threshold`        | The threshold distance from the bottom of the content to call the `infinite` output event when scrolled. The threshold value can be either a percent, or in pixels. For example, use the value of `10%` for the `infinite` output event to get called when the user has scrolled 10% from the bottom of the page. Use the value `100px` when the scroll is within 100 pixels from the bottom of the page.                                                                                         | `string`                       | `"150px"`    |

## Events

| Event                        | Description                                                                                            | Type                |
| ---------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------- |
| `gxInfiniteThresholdReached` | This Handler will be called every time grid threshold is reached. Needed for infinite scrolling grids. | `CustomEvent<void>` |

## Methods

### `complete() => Promise<void>`

#### Returns

Type: `Promise<void>`

## CSS Custom Properties

| Name                      | Description                                                                                                                                                                                                                                    |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--gx-grid-flex-items`    | Number of Columns or Rows to be shown in the Main axis direction.                                                                                                                                                                              |
| `--gx-grid-flex-max-size` | This attribute value is used to determine the number of columns in a Smart Grid with Multiple by Size in Items Layout Mode and Vertical scroll direction. The width of the grid items cannot be greater than this maximum. 0 means no maximum. |
| `--gx-grid-flex-min-size` | This attribute value is used to determine the number of columns in a Smart Grid with Multiple by Size in Items Layout Mode. The grid will fit as many columns as possible with at least this width, 0 means to use all width.                  |

---

_Built with [StencilJS](https://stenciljs.com/)_
