# gx-chronometer

Stop watch control that fires an event after certain amount of elapsed time.

## Properties

| Property       | Attribute        | Description                                                                                                     | Type     | Default     |
| -------------- | ---------------- | --------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| `maxValue`     | `max-value`      | When the chronometer reaches maxValue (in milliseconds), MaxValueText will be shown instead of the Chronometer. | `number` | `0`         |
| `maxValueText` | `max-value-text` | Text to be displayed when chronometer value reaches maxValue.                                                   | `string` | `undefined` |
| `tickInterval` | `tick-interval`  | Defines the interval (in milliseconds) that the function onTick will be called.                                 | `number` | `1000`      |
| `value`        | `value`          | Defines the initial Chronometer value (in milliseconds)                                                         | `number` | `0`         |

## Events

| Event  | Description                                      | Type                |
| ------ | ------------------------------------------------ | ------------------- |
| `tick` | Event to emit After elapsed time (tickInterval). | `CustomEvent<void>` |

## Methods

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
