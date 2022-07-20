# gx-grid-paged

This component is a multi-section container. Each section can be horizontal or vertically swiped.
It uses the Swiper.js as The most modern mobile touch slider and framework with hardware accelerated transitions.
http://www.idangero.us/swiper/

<!-- Auto Generated Below -->

## Properties

| Property        | Attribute         | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Type                         | Default      |
| --------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ------------ |
| `autoGrow`      | `auto-grow`       | This attribute defines if the control size will grow automatically, to adjust to its content size. If set to `false`, it won't grow automatically and it will show scrollbars if the content overflows.                                                                                                                                                                                                                                                                                            | `boolean`                    | `undefined`  |
| `columns`       | `columns`         | Number of items per column (items visible at the same time on slider's container).                                                                                                                                                                                                                                                                                                                                                                                                                 | `"auto" \| number`           | `undefined`  |
| `cssClass`      | `css-class`       | A CSS class to set as the `gx-grid-horizontal` element class.                                                                                                                                                                                                                                                                                                                                                                                                                                      | `string`                     | `undefined`  |
| `currentPage`   | `current-page`    | 1-Indexed number of currently active page                                                                                                                                                                                                                                                                                                                                                                                                                                                          | `number`                     | `1`          |
| `direction`     | `direction`       | Items layout direction: Could be 'horizontal' or 'vertical' (for vertical slider).                                                                                                                                                                                                                                                                                                                                                                                                                 | `"horizontal" \| "vertical"` | `undefined`  |
| `highlightable` | `highlightable`   | True to highlight control when an action is fired.                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `boolean`                    | `false`      |
| `invisibleMode` | `invisible-mode`  | This attribute lets you specify how this element will behave when hidden. \| Value \| Details \| \| ------------ \| --------------------------------------------------------------------------- \| \| `keep-space` \| The element remains in the document flow, and it does occupy space. \| \| `collapse` \| The element is removed form the document flow, and it doesn't occupy space. \|                                                                                                       | `"collapse" \| "keep-space"` | `"collapse"` |
| `itemsPerGroup` | `items-per-group` | Set numbers of items to define and enable group sliding. Useful to use with rowsPerPage > 1                                                                                                                                                                                                                                                                                                                                                                                                        | `1`                          | `1`          |
| `loadingState`  | `loading-state`   | Grid loading state. It's purpose is to know whether the grid loading animation or the grid empty placeholder should be shown. \| Value \| Details \| \| ------------ \| ---------------------------------------------------------------------------------------------- \| \| `loading` \| The grid is waiting the server for the grid data. Grid loading mask will be shown. \| \| `loaded` \| The grid data has been loaded. If the grid has no records, the empty place holder will be shown. \| | `"loaded" \| "loading"`      | `undefined`  |
| `logLevel`      | `log-level`       | Logging level. For troubleshooting component update and initialization.                                                                                                                                                                                                                                                                                                                                                                                                                            | `"debug" \| "off"`           | `"debug"`    |
| `options`       | --                | Advanced options to pass to the swiper instance. See http://idangero.us/swiper/api/ for valid options                                                                                                                                                                                                                                                                                                                                                                                              | `SwiperOptions`              | `{}`         |
| `orientation`   | `orientation`     | Specifies the orientation mode.                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `"landscape" \| "portrait"`  | `"portrait"` |
| `pager`         | `pager`           | If `true`, show the pagination buttons.                                                                                                                                                                                                                                                                                                                                                                                                                                                            | `boolean`                    | `true`       |
| `recordCount`   | `record-count`    | Grid current row count. This property is used in order to be able to re-render the Grid every time the Grid data changes. If not specified, then grid empty and loading placeholders will not work correctly.                                                                                                                                                                                                                                                                                      | `number`                     | `null`       |
| `rows`          | `rows`            | Specifies the number of rows that will be displayed in the portrait mode.                                                                                                                                                                                                                                                                                                                                                                                                                          | `number`                     | `1`          |
| `rowsLandscape` | `rows-landscape`  | Specifies the number of rows that will be displayed in the landscape mode.                                                                                                                                                                                                                                                                                                                                                                                                                         | `number`                     | `1`          |
| `scrollbar`     | `scrollbar`       | If `true`, show the scrollbar.                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | `boolean`                    | `false`      |
| `snapToGrid`    | `snap-to-grid`    | Set to false to enable slides in free mode position.                                                                                                                                                                                                                                                                                                                                                                                                                                               | `boolean`                    | `true`       |

## Events

| Event                        | Description                                                                                            | Type                  |
| ---------------------------- | ------------------------------------------------------------------------------------------------------ | --------------------- |
| `gxGridClick`                | Emitted when the user taps/clicks on the slide's container.                                            | `CustomEvent<any>`    |
| `gxGridDidChange`            | Emitted after the active slide has changed.                                                            | `CustomEvent<number>` |
| `gxGridDidLoad`              | Emitted after Swiper initialization                                                                    | `CustomEvent<void>`   |
| `gxGridDoubleClick`          | Emitted when the user double taps on the slide's container.                                            | `CustomEvent<any>`    |
| `gxGridDrag`                 | Emitted when the slider is actively being moved.                                                       | `CustomEvent<any>`    |
| `gxGridNextEnd`              | Emitted when the next slide has ended.                                                                 | `CustomEvent<any>`    |
| `gxGridNextStart`            | Emitted when the next slide has started.                                                               | `CustomEvent<any>`    |
| `gxGridPrevEnd`              | Emitted when the previous slide has ended.                                                             | `CustomEvent<any>`    |
| `gxGridPrevStart`            | Emitted when the previous slide has started.                                                           | `CustomEvent<any>`    |
| `gxGridReachEnd`             | Emitted when the slider is at the last slide.                                                          | `CustomEvent<void>`   |
| `gxGridReachStart`           | Emitted when the slider is at its initial position.                                                    | `CustomEvent<any>`    |
| `gxGridTouchEnd`             | Emitted when the user releases the touch.                                                              | `CustomEvent<any>`    |
| `gxGridTouchStart`           | Emitted when the user first touches the slider.                                                        | `CustomEvent<any>`    |
| `gxGridTransitionEnd`        | Emitted when the slide transition has ended.                                                           | `CustomEvent<any>`    |
| `gxGridTransitionStart`      | Emitted when the slide transition has started.                                                         | `CustomEvent<any>`    |
| `gxGridWillChange`           | Emitted before the active slide has changed.                                                           | `CustomEvent<any>`    |
| `gxInfiniteThresholdReached` | This Handler will be called every time grid threshold is reached. Needed for infinite scrolling grids. | `CustomEvent<void>`   |

## Methods

### `getActiveIndex() => Promise<number>`

Get the index of the current active slide.

#### Returns

Type: `Promise<number>`

### `getPreviousIndex() => Promise<number>`

Get the index of the previous slide.

#### Returns

Type: `Promise<number>`

### `isLast() => Promise<boolean>`

Get whether or not the current slide is the last slide.

#### Returns

Type: `Promise<boolean>`

### `isStart() => Promise<boolean>`

Get whether or not the current slide is the first slide.

#### Returns

Type: `Promise<boolean>`

### `length() => Promise<number>`

Get the total number of slides.

#### Returns

Type: `Promise<number>`

### `slideNext(speed?: number, runCallbacks?: boolean) => Promise<void>`

Transition to the next slide.

#### Returns

Type: `Promise<void>`

### `slidePrev(speed?: number, runCallbacks?: boolean) => Promise<void>`

Transition to the previous slide.

#### Returns

Type: `Promise<void>`

### `slideTo(index: number, speed?: number, runCallbacks?: boolean) => Promise<void>`

Transition to the specified slide.

#### Returns

Type: `Promise<void>`

### `startAutoplay() => Promise<void>`

Start auto play.

#### Returns

Type: `Promise<void>`

### `stopAutoplay() => Promise<void>`

Stop auto play.

#### Returns

Type: `Promise<void>`

### `toggleLockSwipeToNext(lock: boolean) => Promise<void>`

Lock or unlock the ability to slide to the next slide.

#### Returns

Type: `Promise<void>`

### `toggleLockSwipeToPrev(lock: boolean) => Promise<void>`

Lock or unlock the ability to slide to the previous slide.

#### Returns

Type: `Promise<void>`

### `toggleLockSwipes(lock: boolean) => Promise<void>`

Lock or unlock the ability to slide to the next or previous slide.

#### Returns

Type: `Promise<void>`

### `update() => Promise<void>`

Update the underlying slider implementation. Call this if you've added or removed
child slides.

#### Returns

Type: `Promise<void>`

### `updateAutoHeight(speed?: number) => Promise<void>`

Force swiper to update its height (when autoHeight is enabled) for the duration
equal to 'speed' parameter.

#### Returns

Type: `Promise<void>`

---

_Built with [StencilJS](https://stenciljs.com/)_
