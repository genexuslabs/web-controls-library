# gx-grid-smart

This component is a multi-section container. Each section can be horizontal or vertically swiped.
It uses the Swiper.js as The most modern mobile touch slider and framework with hardware accelerated transitions.
http://www.idangero.us/swiper/

<!-- Auto Generated Below -->

## Properties

| Property        | Attribute         | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Type                         | Default      |
| --------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ------------ |
| `columns`       | `columns`         | Number of items per column (items visible at the same time on slider's container).                                                                                                                                                                                                                                                                                                                                                                                                                 | `"auto" \| number`           | `undefined`  |
| `currentPage`   | `current-page`    | 0-Indexed number of currently active page                                                                                                                                                                                                                                                                                                                                                                                                                                                          | `number`                     | `0`          |
| `direction`     | `direction`       | Items layout direction: Could be 'horizontal' or 'vertical' (for vertical slider).                                                                                                                                                                                                                                                                                                                                                                                                                 | `"horizontal" \| "vertical"` | `undefined`  |
| `invisibleMode` | `invisible-mode`  | This attribute lets you specify how this element will behave when hidden. \| Value \| Details \| \| ------------ \| --------------------------------------------------------------------------- \| \| `keep-space` \| The element remains in the document flow, and it does occupy space. \| \| `collapse` \| The element is removed form the document flow, and it doesn't occupy space. \|                                                                                                       | `"collapse" \| "keep-space"` | `"collapse"` |
| `itemsPerGroup` | `items-per-group` | Set numbers of items to define and enable group sliding. Useful to use with rowsPerPage > 1                                                                                                                                                                                                                                                                                                                                                                                                        | `number`                     | `1`          |
| `loadingState`  | `loading-state`   | Grid loading state. It's purpose is to know whether the grid loading animation or the grid empty placeholder should be shown. \| Value \| Details \| \| ------------ \| ---------------------------------------------------------------------------------------------- \| \| `loading` \| The grid is waiting the server for the grid data. Grid loading mask will be shown. \| \| `loaded` \| The grid data has been loaded. If the grid has no records, the empty place holder will be shown. \| | `"loaded" \| "loading"`      | `undefined`  |
| `options`       | --                | Advanced options to pass to the swiper instance. See http://idangero.us/swiper/api/ for valid options                                                                                                                                                                                                                                                                                                                                                                                              | `SwiperOptions`              | `{}`         |
| `pager`         | `pager`           | If `true`, show the pagination buttons.                                                                                                                                                                                                                                                                                                                                                                                                                                                            | `boolean`                    | `true`       |
| `recordCount`   | `record-count`    | Grid current row count. This property is used in order to be able to re-render the Grid every time the Grid data changes. If not specified, then grid empty and loading placeholders will not work correctly.                                                                                                                                                                                                                                                                                      | `number`                     | `null`       |
| `rows`          | `rows`            | Number of items per column, for multirow layout.                                                                                                                                                                                                                                                                                                                                                                                                                                                   | `number`                     | `undefined`  |
| `scrollbar`     | `scrollbar`       | If `true`, show the scrollbar.                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | `boolean`                    | `false`      |
| `snapToGrid`    | `snap-to-grid`    | Set to false to enable slides in free mode position.                                                                                                                                                                                                                                                                                                                                                                                                                                               | `boolean`                    | `true`       |

## Events

| Event                   | Description                                                 | Type                  |
| ----------------------- | ----------------------------------------------------------- | --------------------- |
| `gxGridClick`           | Emitted when the user taps/clicks on the slide's container. | `CustomEvent<void>`   |
| `gxGridDidChange`       | Emitted after the active slide has changed.                 | `CustomEvent<number>` |
| `gxGridDidLoad`         | Emitted after Swiper initialization                         | `CustomEvent<void>`   |
| `gxGridDoubleClick`     | Emitted when the user double taps on the slide's container. | `CustomEvent<void>`   |
| `gxGridDrag`            | Emitted when the slider is actively being moved.            | `CustomEvent<void>`   |
| `gxGridNextEnd`         | Emitted when the next slide has ended.                      | `CustomEvent<void>`   |
| `gxGridNextStart`       | Emitted when the next slide has started.                    | `CustomEvent<void>`   |
| `gxGridPrevEnd`         | Emitted when the previous slide has ended.                  | `CustomEvent<void>`   |
| `gxGridPrevStart`       | Emitted when the previous slide has started.                | `CustomEvent<void>`   |
| `gxGridReachEnd`        | Emitted when the slider is at the last slide.               | `CustomEvent<void>`   |
| `gxGridReachStart`      | Emitted when the slider is at its initial position.         | `CustomEvent<void>`   |
| `gxGridTouchEnd`        | Emitted when the user releases the touch.                   | `CustomEvent<void>`   |
| `gxGridTouchStart`      | Emitted when the user first touches the slider.             | `CustomEvent<void>`   |
| `gxGridTransitionEnd`   | Emitted when the slide transition has ended.                | `CustomEvent<void>`   |
| `gxGridTransitionStart` | Emitted when the slide transition has started.              | `CustomEvent<void>`   |
| `gxGridWillChange`      | Emitted before the active slide has changed.                | `CustomEvent<void>`   |

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
