# gx-chronometer

<!-- Auto Generated Below -->

## Properties

| Property        | Attribute        | Description                                                                                                                                                                                                                                                                                                                                                                                  | Type                                                           | Default              |
| --------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | -------------------- |
| `cssClass`      | `css-class`      | A CSS class to set as the `gx-chronometer` element class.                                                                                                                                                                                                                                                                                                                                    | `string`                                                       | `undefined`          |
| `interval`      | `interval`       | Defines the interval that the function onTick will be called.                                                                                                                                                                                                                                                                                                                                | `1`                                                            | `1`                  |
| `invisibleMode` | `invisible-mode` | This attribute lets you specify how this element will behave when hidden. \| Value \| Details \| \| ------------ \| --------------------------------------------------------------------------- \| \| `keep-space` \| The element remains in the document flow, and it does occupy space. \| \| `collapse` \| The element is removed form the document flow, and it doesn't occupy space. \| | `"collapse" \| "keep-space"`                                   | `"collapse"`         |
| `maxValue`      | `max-value`      | When the chronometer reaches this value, MaxValueText will be shown instead of the Chronometer value.                                                                                                                                                                                                                                                                                        | `0`                                                            | `0`                  |
| `maxValueText`  | `max-value-text` | Text to be displayed when chronometer value reaches maxValue.                                                                                                                                                                                                                                                                                                                                | `string`                                                       | `undefined`          |
| `state`         | `state`          | State of the Chronometer.                                                                                                                                                                                                                                                                                                                                                                    | `TimerState.Reset \| TimerState.Running \| TimerState.Stopped` | `TimerState.Stopped` |
| `unit`          | `unit`           | Time unit: (s) seconds or (ms) milliseconds for every time control Property.                                                                                                                                                                                                                                                                                                                 | `"ms" \| "s"`                                                  | `"s"`                |
| `value`         | `value`          | The value of the control.                                                                                                                                                                                                                                                                                                                                                                    | `number`                                                       | `0`                  |

## Events

| Event    | Description                                                                      | Type               |
| -------- | -------------------------------------------------------------------------------- | ------------------ |
| `change` | The `change` event is emitted every time the chronometer changes                 | `CustomEvent<any>` |
| `end`    | Event to emit after max time is consumed.                                        | `CustomEvent<any>` |
| `input`  | The `input` event is emitted every time the chronometer changes (every 1 second) | `CustomEvent<any>` |
| `tick`   | Event to emit After elapsed time (tickInterval).                                 | `CustomEvent<any>` |

## Methods

### `getNativeInputId() => Promise<HTMLGxChronometerElement>`

Returns the id of the inner `input` element (if set).

#### Returns

Type: `Promise<HTMLGxChronometerElement>`

### `reset() => Promise<void>`

Stops and set to 0 the Chronometer.

#### Returns

Type: `Promise<void>`

### `start() => Promise<void>`

Starts the Chronometer

#### Returns

Type: `Promise<void>`

### `stop() => Promise<void>`

Stops the Chronometer

#### Returns

Type: `Promise<void>`

---

_Built with [StencilJS](https://stenciljs.com/)_
