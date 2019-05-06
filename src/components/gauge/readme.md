# gx-gauge

This component allows you to display information in the form of ranges, and decide whether you want to show it using linear or circular gauges.

Use `gx-gauge-range` element to set the number of ranges and the max value the gauge will have.

<!-- Auto Generated Below -->

## Properties

| Property       | Attribute       | Description                                                                                                                                                                | Type                 |
| -------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| `currentValue` | `current-value` | The Currecnt value indicanding in the gauge                                                                                                                                | `number`             |
| `gaugeType`    | `gauge-type`    | This property allows you to select the gauge type. _(Circle or Line)_. Default is linear type.                                                                             | `"line"`, `"circle"` |
| `minValue`     | `min-value`     | The Minimum Value of the gauge                                                                                                                                             | `number`             |
| `showValue`    | `show-value`    | Allows display current value. Default is disabled.                                                                                                                         | `boolean`            |
| `styleShadow`  | `style-shadow`  | Property of type Style. Define if shadow will display or not. Default is disabled.                                                                                         | `boolean`            |
| `thickness`    | `thickness`     | This allows specifying the width of the circumference _(When gauge is Circle type)_ and the width of the bar _(When gauge is Line type)_ in % relative the component size. | `number`             |

## Events

| Event            | Description |
| ---------------- | ----------- |
| `gxGaugeDidLoad` |             |

## CSS Custom Properties

| Name                    | Description                                                                                                                                    |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `--border-color`        | Define the border color of the gauge.                                                                                                          |
| `--border-width`        | Define the border width of the gauge. _(0px by Default)_                                                                                       |
| `--circle-center-color` | Define the color of the center in `circle` gauge type. Value in _hex, rgb, rgba, hsl, cmyk_ format or _color name_. _(Transparent by Default)_ |
| `--circle-text-color`   | Define the color of the center text in `circle` gauge type. Value in _hex, rgb, rgba, hsl, cmyk_ format or _color name_. _(Gray by Default)_   |

---

_Built with [StencilJS](https://stenciljs.com/)_
