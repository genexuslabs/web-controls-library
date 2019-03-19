# gx-gauge

This component allows you to display information in the form of ranges, and decide whether you want to show it using linear or circular gauges.

Using `gx-range` you set the amount of ranges and the max value that gauge will have.

<!-- Auto Generated Below -->

## Properties

| Property               | Attribute                 | Description                                                                                                                                                                | Type                 |
| ---------------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| `currentValue`         | `current-value`           | The Currecnt value indicanding in the gauge                                                                                                                                | `number`             |
| `gaugeType`            | `gauge-type`              | This property allows you to select the gauge type. _(Circle or Line)_. Default is linear type.                                                                             | `"Line"`, `"Circle"` |
| `minValue`             | `min-value`               | The Minimum Value of the gauge                                                                                                                                             | `number`             |
| `showValue`            | `show-value`              | Allows display current value. Default is disabled.                                                                                                                         | `boolean`            |
| `styleBorderColor`     | `style-border-color`      | Property of type Style. Define the border color. Value in _hex, rgb, rgba, hsl, cmyk_ format or _color name_.                                                              | `string`             |
| `styleBorderWidth`     | `style-border-width`      | Property of type Style. Define the border width. Value in _px_.                                                                                                            | `number`             |
| `styleBorder`          | `style-border`            | Property of type Style. Define if border will display or not. Default is disabled.                                                                                         | `boolean`            |
| `styleCenterColor`     | `style-center-color`      | Property of type Style Define the color of the center in _(Circle)_ gauge type. Value in _hex, rgb, rgba, hsl, cmyk_ format or _color name_. _(Transparent by Default)_    | `string`             |
| `styleCenterTextColor` | `style-center-text-color` | Property of type Style Define the color of the center text in _(Circle)_ gauge type. Value in _hex, rgb, rgba, hsl, cmyk_ format or _color name_. _(Gray by Default)_      | `string`             |
| `styleShadow`          | `style-shadow`            | Property of type Style. Define if shadow will display or not. Default is disabled.                                                                                         | `boolean`            |
| `thickness`            | `thickness`               | This allows specifying the width of the circumference _(When gauge is Circle type)_ and the width of the bar _(When gauge is Line type)_ in % relative the component size. | `number`             |

## Events

| Event            | Description |
| ---------------- | ----------- |
| `gxGaugeDidLoad` |             |

---

_Built with [StencilJS](https://stenciljs.com/)_
