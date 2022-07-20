# gx-layout

A container control for creating a simple column layout, consisting of five targets: top, right, bottom left and center:

```
-------------------------------------
|                                   |
|                top                |
|                                   |
-------------------------------------
|          |            |           |
|  left    |   center   |   right   |
|          |            |           |
-------------------------------------
|                                   |
|              bottom               |
|                                   |
-------------------------------------
```

The `slot` attribute is used to control where its child elements wil be laid out: "top", "right", "bottom" and "left" are the supported `slot` attribute values. If no slot is specified, the child elements are laid out inside the center target.

## Example

```
<gx-layout>
    <div slot="top">Top</div>
    <div slot="right">Right</div>
    <div slot="bottom">Bottom</div>
    <div slot="left">Left</div>
    <div slot>Center</div>
</gx-layout>
```

## Present only once in the page

This control is meant to be used only once in a page and ideally taking all the viewport space.

## Responsive behavior

When the viewport width is less than 1200px the left and right targets stop being fixed and float above the center target.

When the left or right target is visible and floating, the center target is masked. Clicking outside these targets automatically hides them.

<!-- Auto Generated Below -->

## Properties

| Property              | Attribute               | Description                                                | Type      | Default |
| --------------------- | ----------------------- | ---------------------------------------------------------- | --------- | ------- |
| `bottomHidden`        | `bottom-hidden`         | True to hide the bottom target                             | `boolean` | `false` |
| `bottomNavbarVisible` | `bottom-navbar-visible` | `true` if the bottom navbar is visible in the application. | `boolean` | `false` |
| `leftHidden`          | `left-hidden`           | True to hide the left target                               | `boolean` | `false` |
| `rightHidden`         | `right-hidden`          | True to hide the right target                              | `boolean` | `false` |
| `topHidden`           | `top-hidden`            | True to hide the top target                                | `boolean` | `false` |

## Events

| Event                                  | Description                                                                | Type               |
| -------------------------------------- | -------------------------------------------------------------------------- | ------------------ |
| `leftHiddenChange`                     | Fired when the leftHidden property is changed                              | `CustomEvent<any>` |
| `rightHiddenChange`                    | Fired when the rightHidden property is changed                             | `CustomEvent<any>` |
| `verticalTargetsBreakpointMatchChange` | Fired when the viewport size is less than the vertical targets breakpoint. | `CustomEvent<any>` |

## CSS Custom Properties

| Name                                            | Description                                    |
| ----------------------------------------------- | ---------------------------------------------- |
| `--gx-layout-horizontal-target-height`          | Height for horizontal targets (top and bottom) |
| `--gx-layout-mask-background-color`             | Mask background color                          |
| `--gx-layout-mask-opacity`                      | Mask opacity                                   |
| `--gx-layout-target-transition-duration`        | Vertical target's transition duration          |
| `--gx-layout-target-transition-timing-function` | Vertical target's transition timing function   |
| `--gx-layout-vertical-target-width`             | Width for vertical targets (left and right)    |
| `--gx-layout-vertical-targets-breakpoint`       | Vertical targets breakpoint                    |

---

_Built with [StencilJS](https://stenciljs.com/)_
