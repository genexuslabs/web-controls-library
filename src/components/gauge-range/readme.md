# gx-gauge-range

Component used within `gx-gauge` to show a range.

<!-- Auto Generated Below -->

## Properties

| Property | Attribute | Description                                                                                   | Type     | Default     |
| -------- | --------- | --------------------------------------------------------------------------------------------- | -------- | ----------- |
| `amount` | `amount`  | The range length.                                                                             | `number` | `undefined` |
| `color`  | `color`   | Color property defines the color of range background. Color value can be any valid CSS color. | `string` | `undefined` |
| `name`   | `name`    | The name of the range.                                                                        | `string` | `undefined` |

## Events

| Event                   | Description                                                                                           | Type                |
| ----------------------- | ----------------------------------------------------------------------------------------------------- | ------------------- |
| `gxGaugeRangeDidLoad`   | The gxGaugeRangeDidLoad is triggered when the component has been added and its render completely ran. | `CustomEvent<void>` |
| `gxGaugeRangeDidUnload` | The gxGaugeRangeDidUnload is triggered when the component has been deleted                            | `CustomEvent<void>` |
| `gxGaugeRangeDidUpdate` | The gxGaugeRangeDidUpdate is triggered when a property of the component has been changed.             | `CustomEvent<void>` |

---

_Built with [StencilJS](https://stenciljs.com/)_
