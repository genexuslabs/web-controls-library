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

| Property      | Attribute      | Description                                                                                                                                                                | Type                 | Default         |
| ------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | --------------- |
| `minValue`    | `min-value`    | The minimum value of the gauge                                                                                                                                             | `number`             | `undefined`     |
| `showValue`   | `show-value`   | Set `true` to display the current value. Default is `false`.                                                                                                               | `boolean`            | `false`         |
| `styleShadow` | `style-shadow` | Property of type Style. Define if shadow will display or not. Default is disabled.                                                                                         | `boolean`            | `false`         |
| `thickness`   | `thickness`    | This allows specifying the width of the circumference _(When gauge is circle type)_ and the width of the bar _(When gauge is Line type)_ in % relative the component size. | `number`             | `10`            |
| `type`        | `type`         | This property allows selecting the gauge type. The allowed values are `circle` or `line` (defautl).                                                                        | `"circle" \| "line"` | `"line"`        |
| `value`       | `value`        | The current value of the gauge                                                                                                                                             | `number`             | `this.minValue` |

## Events

| Event            | Description                                                                          | Type               |
| ---------------- | ------------------------------------------------------------------------------------ | ------------------ |
| `gxGaugeDidLoad` | The `gxGaugeDidLoad` event is triggered when component has been rendered completely. | `CustomEvent<any>` |

## CSS Custom Properties

| Name                                    | Description                                                                                           |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `--center-circle-background-color`      | Define the backgorund color of the center in `circle` gauge type. (transparent by default)            |
| `--center-circle-text-color`            | Define the color of the center text in `circle` gauge type. (gray by default)                         |
| `--circular-gauge-container-box-shadow` | Set the box-shadow of circular gauge container. (0px 0px 9px 0px rgba(0, 0, 0, 0.5) inset by default) |
| `--component-height`                    | Set the height or the control. _Must be set before render the control_ (400px by default)             |
| `--gauge-border-color`                  | Define the border color of the gauge.                                                                 |
| `--gauge-border-width`                  | Define the border width of the gauge. (0 by default)                                                  |
| `--gauge-box-shadow`                    | Set the box-shadow of gauge. (0px 0px 5px 0px rgba(0, 0, 0, 0.5) inset by default)                    |
| `--gauge-ranges-box-shadow`             | Set shadows of each range. (2px 0px 10px 0px rgba(0, 0, 0, 0.4) by default)                           |
| `--marker-backgorund`                   | Define the background color of the marker. (1px by default)                                           |
| `--marker-border`                       | Define the border width, type, and color of the marker. (1px by default)                              |
| `--marker-box-shadow`                   | Set the box-shadow of marker. (1px 3px 3px 0px rgba(0, 0, 0, 0.8) by default)                         |
| `--max-value-display-background`        | Set the color of maximum value display background. (rgba(44, 44, 44, 1) by default)                   |
| `--max-value-display-box-shadow`        | Set the box-shadow of maximum value display. (2px 1px 3px 0px rgba(0, 0, 0, 0.5) by default)          |
| `--max-value-display-color`             | Set the color of maximum value display text. (rgba(255, 255, 255, 0.8) by default)                    |
| `--min-value-display-background`        | Set the color of minimum value display background. (rgba(44, 44, 44, 1) by default)                   |
| `--min-value-display-box-shadow`        | Set the box-shadow of minimum value display. (0px 0px 5px 0px rgba(0, 0, 0, 0.5) by default)          |
| `--min-value-display-color`             | Set the color of minimum value display text. (rgba(255, 255, 255, 0.8) by default)                    |

---

_Built with [StencilJS](https://stenciljs.com/)_
