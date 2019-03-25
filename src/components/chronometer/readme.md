# gx-chronometer

<!-- Auto Generated Below -->

## Properties

| Property        | Attribute        | Description                                                                                                                                                                                                                                                                                                                                                                                  | Type                                                           | Default              |
| --------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | -------------------- |
| `id`            | `id`             | The identifier of the control. Must be unique.                                                                                                                                                                                                                                                                                                                                               | `string`                                                       | `undefined`          |
| `interval`      | `interval`       | Defines the interval that the function onTick will be called.                                                                                                                                                                                                                                                                                                                                | `number`                                                       | `1`                  |
| `invisibleMode` | `invisible-mode` | This attribute lets you specify how this element will behave when hidden. \| Value \| Details \| \| ------------ \| --------------------------------------------------------------------------- \| \| `keep-space` \| The element remains in the document flow, and it does occupy space. \| \| `collapse` \| The element is removed form the document flow, and it doesn't occupy space. \| | `"collapse" \| "keep-space"`                                   | `"collapse"`         |
| `maxValue`      | `max-value`      | When the chronometer reaches this value, MaxValueText will be shown instead of the Chronometer value.                                                                                                                                                                                                                                                                                        | `number`                                                       | `0`                  |
| `maxValueText`  | `max-value-text` | Text to be displayed when chronometer value reaches maxValue.                                                                                                                                                                                                                                                                                                                                | `string`                                                       | `undefined`          |
| `state`         | `state`          | State of the Chronometer.                                                                                                                                                                                                                                                                                                                                                                    | `TimerState.Reset \| TimerState.Running \| TimerState.Stopped` | `TimerState.Stopped` |
| `unit`          | `unit`           | Time unit: 1000 as seconds, 1 as miliseconds for every control Prop.                                                                                                                                                                                                                                                                                                                         | `number`                                                       | `1000`               |
| `value`         | `value`          | The value of the control.                                                                                                                                                                                                                                                                                                                                                                    | `number`                                                       | `0`                  |

## Events

| Event    | Description                                                                      | Type                |
| -------- | -------------------------------------------------------------------------------- | ------------------- |
| `change` | The `change` event is emitted every time the chronometer changes                 | `CustomEvent<void>` |
| `end`    | Event to emit after max time is consumed.                                        | `CustomEvent<void>` |
| `input`  | The `input` event is emitted every time the chronometer changes (every 1 second) | `CustomEvent<void>` |
| `tick`   | Event to emit After elapsed time (tickInterval).                                 | `CustomEvent<void>` |

## Methods

### `getNativeInputId() => Promise<any>`

Returns the id of the inner `input` element (if set).

#### Returns

Type: `Promise<any>`

### `reset() => void`

Stops and set to 0 the Chronometer.

#### Returns

Type: `void`

### `start() => void`

Starts the Chronometer

#### Returns

Type: `void`

### `stop() => void`

Stops the Chronometer

#### Returns

Type: `void`

---

_Built with [StencilJS](https://stenciljs.com/)_
