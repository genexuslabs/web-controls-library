# gx-chronometer

<!-- Auto Generated Below -->

## Properties

| Property              | Attribute              | Description                                                                                                        | Type     | Default     |
| --------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------ | -------- | ----------- |
| `initialMilliseconds` | `initial-milliseconds` | Defines the initial Chronometer value in milliseconds                                                              | `number` | `0`         |
| `maxValue`            | `max-value`            | When the chronnometer reach the maxValue (in milliseconds), MaxValueText will be shown instead of the Chronometer. | `number` | `0`         |
| `maxValueText`        | `max-value-text`       |                                                                                                                    | `string` | `undefined` |
| `tickInterval`        | `tick-interval`        | Defines the interval in milliseconds that the function onTick will be called.                                      | `number` | `1000`      |

## Events

| Event  | Description | Type                |
| ------ | ----------- | ------------------- |
| `tick` |             | `CustomEvent<void>` |

## Methods

### `reset() => void`

#### Returns

Type: `void`

### `start() => void`

#### Returns

Type: `void`

### `stop() => void`

#### Returns

Type: `void`

---

_Built with [StencilJS](https://stenciljs.com/)_
