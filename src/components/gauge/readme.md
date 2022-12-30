# gx-gauge

This component allows displaying information in the form of ranges, and decide whether you want to show it using linear or circular gauges.

Use `gx-gauge-range` element to set the number of ranges.

## Samples

`gx-gauge`:

> `gx-gauge` must have [gx-gauge-range](../gauge-range/readme.md) inside with a value set in the `amount` attribute.
> You can add the necessary quantity of [gx-gauge-range](../gauge-range/readme.md) within `gx-gauge`.
> Be aware that the maximum value that the gauge will have, will consist of each value of the "amount" attribute of each range and the minimum value that you set in the gauge.

```HTML
<gx-gauge type="circle" min-value="0" value="4" show-value="true" style-shadow="true" thickness="50" style="--component-height: 200px;--gauge-border-width: 3px;--center-circle-background-color: rgb(0, 92, 129);--marker-border: 2px solid rgba(70, 70, 70, 0.8);--marker-color: rgba(250, 210, 250, 0);--circle-text-color: rgba(250, 250, 250, 0.5);" >
    <gx-gauge-range amount="1" color="red"></gx-gauge-range>
    <gx-gauge-range amount="1" color="orange"></gx-gauge-range>
    <gx-gauge-range amount="1" color="yellow"></gx-gauge-range>
    <gx-gauge-range amount="1" color="green"></gx-gauge-range>
    <gx-gauge-range amount="1" color="blue"></gx-gauge-range>
  </gx-gauge>
```

<!-- Auto Generated Below -->

## Properties

| Property     | Attribute      | Description                                                                                                                                                                                    | Type                 | Default     |
| ------------ | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | ----------- |
| `cssClass`   | `css-class`    | A CSS class to set as the `gx-gauge` element class.                                                                                                                                            | `string`             | `undefined` |
| `maxValue`   | `max-value`    | The maximum value of the gauge. This prop allows specify the maximum value that the gauge will handle. If there is no value specified it will be calculated by the sum of all gx-ranges values | `number`             | `undefined` |
| `minValue`   | `min-value`    | The minimum value of the gauge 0 by Default                                                                                                                                                    | `number`             | `0`         |
| `showMinMax` | `show-min-max` | Set `true` to display the minimum and maximum value. Default is `false`.                                                                                                                       | `boolean`            | `false`     |
| `showValue`  | `show-value`   | Set `true` to display the current value. Default is `false`.                                                                                                                                   | `boolean`            | `false`     |
| `thickness`  | `thickness`    | Allows specify the width of the circumference _(When gauge is circle type)_ or the width of the bar _(When gauge is Line type)_ in % relative the component size.                              | `number`             | `10`        |
| `type`       | `type`         | This property allows selecting the gauge type. The allowed values are `circle` or `line` (defautl).                                                                                            | `"circle" \| "line"` | `"line"`    |
| `value`      | `value`        | The current value of the gauge                                                                                                                                                                 | `number`             | `undefined` |

## Events

| Event            | Description                                                                              | Type               |
| ---------------- | ---------------------------------------------------------------------------------------- | ------------------ |
| `gxGaugeDidLoad` | The `gxGaugeDidLoad` event is triggered when the component has been rendered completely. | `CustomEvent<any>` |

## CSS Custom Properties

| Name                                  | Description                                                                                                      |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `--center-circle-background-color`    | Define the color of the center background text in `circle` gauge type. (rgba(255, 255, 255, 0) by default)       |
| `--center-circle-text-color`          | Define the color of the center text in `circle` gauge type. (rgba(44, 44, 44, 1) by default)                     |
| `--indicator-circle-background-color` | Define the color of the background value indicator in `circle` gauge type. (rgba(44, 44, 44, 1) by default)      |
| `--indicator-line-background-color`   | Set the color of background value indicator in `line` gauge type. (rgba(44, 44, 44, 1) by default)               |
| `--max-value-background-color`        | Set the color of maximum value display background in `line` gauge type. (rgba(255, 255, 255, 0.800) by default)  |
| `--max-value-text-color`              | Set the color of maximum value display text in `line` gauge type. (rgba(40, 40, 40, 0.8) by default)             |
| `--min-value-background-color`        | Set the color of minimum value display background in `line` gauge type. (rgba(255, 255, 255, 0.8000) by default) |
| `--min-value-text-color`              | Set the color of minimum value display text in `line` gauge type. (rgba(40, 40, 40, 0.8) by default)             |
| `--stroke-animation-duration`         | Sets the duration of the stroke transition animation the first time the component is loaded. (1s by default)     |
| `--stroke-linecap`                    | Defines the shape to be used at the end of open subpaths when they are stroked. (initial by default)             |
| `--value-text-background-color`       | Define the background-color of the value text in `line` gauge type. (rgba(255, 255, 255, 0.800) by default)      |
| `--value-text-color`                  | Define the color of the value text in `line` gauge type. (rgba(44, 44, 44, 1) by default)                        |

---

_Built with [StencilJS](https://stenciljs.com/)_
