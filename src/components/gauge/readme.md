# gx-gauge

This component allows you to display information in the form of ranges, and decide whether you want to show it using linear or circular gauges.

Use `gx-gauge-range` element to set the number of ranges and the max value the gauge will have.

<!-- Auto Generated Below -->

## Properties

| Property      | Attribute      | Description                                                                                                                                                                | Type                 | Default         |
| ------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | --------------- |
| `gaugeType`   | `gauge-type`   | This property allows selecting the gauge type. The allowed values are `circle` or `line` (defautl).                                                                        | `"circle" \| "line"` | `"line"`        |
| `minValue`    | `min-value`    | The minimum value of the gauge                                                                                                                                             | `number`             | `undefined`     |
| `showValue`   | `show-value`   | Set `ture` to display the current value. Default is `false`.                                                                                                               | `boolean`            | `false`         |
| `styleShadow` | `style-shadow` | Property of type Style. Define if shadow will display or not. Default is disabled.                                                                                         | `boolean`            | `false`         |
| `thickness`   | `thickness`    | This allows specifying the width of the circumference _(When gauge is circle type)_ and the width of the bar _(When gauge is Line type)_ in % relative the component size. | `number`             | `10`            |
| `value`       | `value`        | The current value of the gauge                                                                                                                                             | `number`             | `this.minValue` |

## Events

| Event            | Description                                                                          | Type                |
| ---------------- | ------------------------------------------------------------------------------------ | ------------------- |
| `gxGaugeDidLoad` | The `gxGaugeDidLoad` event is triggered when component has been rendered completely. | `CustomEvent<void>` |

## CSS Custom Properties

| Name                                    | Description                                                                                           |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `--border-color`                        | Define the border color of the gauge.                                                                 |
| `--border-width`                        | Define the border width of the gauge. (0 by default)                                                  |
| `--box-shadow-circular-gauge-container` | Set the box-shadow of circular gauge container. (0px 0px 9px 0px rgba(0, 0, 0, 0.5) inset by default) |
| `--box-shadow-gauge`                    | Set the box-shadow of gauge. (0px 0px 5px 0px rgba(0, 0, 0, 0.5) inset by default)                    |
| `--box-shadow-gauge-ranges`             | Set shadows of each range. (2px 0px 10px 0px rgba(0, 0, 0, 0.4) by default)                           |
| `--box-shadow-marker`                   | Set the box-shadow of marker. (1px 3px 3px 0px rgba(0, 0, 0, 0.8) by default)                         |
| `--box-shadow-max-value-display`        | Set the box-shadow of maximum value display. (2px 1px 3px 0px rgba(0, 0, 0, 0.5) by default)          |
| `--box-shadow-min-value-display`        | Set the box-shadow of minimum value display. (0px 0px 5px 0px rgba(0, 0, 0, 0.5) by default)          |
| `--circle-center-color`                 | Define the color of the center in `circle` gauge type. (transparent by default)                       |
| `--circle-text-color`                   | Define the color of the center text in `circle` gauge type. (gray by default)                         |
| `--height-component`                    | Set the height or the control. _Must be setted before render the control_ (400px by default)          |
| `--marker-backgorund`                   | Define the background color of the marker. (1px by default)                                           |
| `--marker-border`                       | Define the border width, type, and color of the marker. (1px by default)                              |
| `--max-value-display-background`        | Set the color of maximum value display background. (rgba(44, 44, 44, 1) by default)                   |
| `--max-value-display-color`             | Set the color of maximum value display text. (rgba(255, 255, 255, 0.8) by default)                    |
| `--min-value-display-background`        | Set the color of minimum value display background. (rgba(44, 44, 44, 1) by default)                   |
| `--min-value-display-color`             | Set the color of minimum value display text. (rgba(255, 255, 255, 0.8) by default)                    |

---

_Built with [StencilJS](https://stenciljs.com/)_
