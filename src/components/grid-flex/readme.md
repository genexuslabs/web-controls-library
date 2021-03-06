# gx-grid-flex

A container for including a repetitive elements list based on Flex layout
It provides 3 slots:

- 'grid-content' slot: This slot holds the grid's content
- 'grid-content-empty' slot: This slot will be shown only when the grid is empty.
- 'grid-loading-content': This slot will be shown while the grid is being loaded. Include the loading indicator markup here.

When the grid is empty, a CSS Class named 'gx-grid-empty' is added to the host element.
When the grid is loading, a CSS Class named 'gx-grid-loading' is added to the host element.

## Example

<gx-grid-flex>
    <div slot="grid-content">
        <div class="item">ROW1</div>
        <div class="item">ROW2</div>
    </div>
</gx-grid-flex>

<!-- Auto Generated Below -->

## Properties

| Property        | Attribute        | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Type                         | Default      |
| --------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ------------ |
| `autoGrow`      | `auto-grow`      | This attribute defines if the control size will grow automatically, to adjust to its content size. If set to `false`, it won't grow automatically and it will show scrollbars if the content overflows.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | `boolean`                    | `false`      |
| `flexDirection` | `flex-direction` | This establishes the main-axis, thus defining the direction flex items are placed in the flex container. Flexbox is (aside from optional wrapping) a single-direction layout concept. Think of flex items as primarily laying out either in horizontal rows or vertical columns. \| Value \| Details \| \| ------------ \| ---------------------------------------------------------------------------------------------- \| \| `row` \| The flex container's main-axis is defined to be the same as the text direction. The main-start and main-end points are the same as the content direction. \| \| `column` \| The flex container's main-axis is the same as the block-axis. The main-start and main-end points are the same as the before and after points of the writing-mode. \| | `"column" \| "row"`          | `"row"`      |
| `invisibleMode` | `invisible-mode` | This attribute lets you specify how this element will behave when hidden. \| Value \| Details \| \| ------------ \| --------------------------------------------------------------------------- \| \| `keep-space` \| The element remains in the document flow, and it does occupy space. \| \| `collapse` \| The element is removed form the document flow, and it doesn't occupy space. \|                                                                                                                                                                                                                                                                                                                                                                                              | `"collapse" \| "keep-space"` | `"collapse"` |
| `loadingState`  | `loading-state`  | Grid loading State. It's purpose is to know rather the Grid Loading animation or the Grid Empty placeholder should be shown. \| Value \| Details \| \| ------------ \| ---------------------------------------------------------------------------------------------- \| \| `loading` \| The grid is waiting the server for the grid data. Grid loading mask will be shown. \| \| `loaded` \| The grid data has been loaded. If the grid has no records, the empty place holder will be shown. \|                                                                                                                                                                                                                                                                                         | `"loaded" \| "loading"`      | `undefined`  |
| `recordCount`   | `record-count`   | Grid current row count. This property is used in order to be able to re-render the Grid every time the Grid data changes. If not specified, then grid empty and loading placeholders may not work correctly.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | `number`                     | `undefined`  |
| `threshold`     | `threshold`      | The threshold distance from the bottom of the content to call the `infinite` output event when scrolled. The threshold value can be either a percent, or in pixels. For example, use the value of `10%` for the `infinite` output event to get called when the user has scrolled 10% from the bottom of the page. Use the value `100px` when the scroll is within 100 pixels from the bottom of the page.                                                                                                                                                                                                                                                                                                                                                                                 | `string`                     | `"150px"`    |

## Events

| Event                        | Description                                                                                            | Type                |
| ---------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------- |
| `gxInfiniteThresholdReached` | This Handler will be called every time grid threshold is reached. Needed for infinite scrolling grids. | `CustomEvent<void>` |

## Methods

### `complete() => Promise<void>`

#### Returns

Type: `Promise<void>`

## CSS Custom Properties

| Name                             | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--gx-grid-flex-align-content`   | This aligns a flex container’s lines within when there is extra space in the cross-axis, similar to how justify-content aligns individual items within the main-axis.                                                                                                                                                                                                                                                                                                                              |
| `--gx-grid-flex-align-items`     | This defines the default behavior for how flex items are laid out along the cross axis on the current line. Think of it as the justify-content version for the cross-axis (perpendicular to the main-axis).                                                                                                                                                                                                                                                                                        |
| `--gx-grid-flex-justify-content` | This defines the alignment along the main axis. It helps distribute extra free space leftover when either all the flex items on a line are inflexible, or are flexible but have reached their maximum size. It also exerts some control over the alignment of items when they overflow the line.                                                                                                                                                                                                   |
| `--gx-grid-flex-wrap`            | By default, flex items will all try to fit onto one line. You can change that and allow the items to wrap as needed with this property. \| Value \| Details \| \| ------------ \| ---------------------------------------------------------------------------------------------- \| \| `nowrap` \| all flex items will be on one line \| `wrap` \| flex items will wrap onto multiple lines, from top to bottom. \| `wrap-reverse` \| flex items will wrap onto multiple lines from bottom to top. |

---

_Built with [StencilJS](https://stenciljs.com/)_
