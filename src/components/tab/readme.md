# gx-tab

A content container that offers a tabbed interface.

## Children

Each tab page is defined through the `gx-tab-caption` and `gx-tab-page` elements.
For every tab item, a tab caption and a tab page must be defined. First comes the
tab caption, using the `gx-tab-caption` element, then comes its corresponding
tab content, using the `gx-tab-page` element.

## Example

```html
<gx-tab>
  <gx-tab-caption slot="caption">Tab Page 1</gx-tab-caption>
  <gx-tab-page slot="page">
    First tab page
  </gx-tab-page>
  <gx-tab-caption slot="caption" selected="true">Tab Page 2</gx-tab-caption>
  <gx-tab-page slot="page">
    Second tab page
  </gx-tab-page>
  <gx-tab-caption slot="caption">Tab Page 3</gx-tab-caption>
  <gx-tab-page slot="page">
    Third tab page
  </gx-tab-page>
  <gx-tab-caption slot="caption" disabled>Tab Page 4 (disabled)</gx-tab-caption>
  <gx-tab-page slot="page">
    Forth tab page (disabled)
  </gx-tab-page>
</gx-tab>
```

<!-- Auto Generated Below -->

## Properties

| Property           | Attribute           | Description                                                                                                                                                                                                                                                                                                                                                                                  | Type                         | Default      |
| ------------------ | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ------------ |
| `cssClass`         | `css-class`         | A CSS class to set as the `gx-tab` element class.                                                                                                                                                                                                                                                                                                                                            | `string`                     | `undefined`  |
| `invisibleMode`    | `invisible-mode`    | This attribute lets you specify how this element will behave when hidden. \| Value \| Details \| \| ------------ \| --------------------------------------------------------------------------- \| \| `keep-space` \| The element remains in the document flow, and it does occupy space. \| \| `collapse` \| The element is removed form the document flow, and it doesn't occupy space. \| | `"collapse" \| "keep-space"` | `"collapse"` |
| `tabsDistribution` | `tabs-distribution` | Defines how the tabs will be distributed in the Strip. \| Value \| Details \| \| ------------ \| ---------------------------------------------------------------------------------- \| \| `scoll` \| Allows scrolling the tab control when the number of tabs exceeds the screen width. \| \| `fixed-size` \| Tabs are fixed size. Used with any amount of tabs. \|                          | `"fixed-size" \| "scroll"`   | `"scroll"`   |
| `tabsPosition`     | `tabs-position`     | Specifies the position to show the tabs.                                                                                                                                                                                                                                                                                                                                                     | `"bottom" \| "top"`          | `"top"`      |

## Events

| Event       | Description                          | Type               |
| ----------- | ------------------------------------ | ------------------ |
| `tabChange` | Fired when the active tab is changed | `CustomEvent<any>` |

## CSS Custom Properties

| Name                                    | Description                                                            |
| --------------------------------------- | ---------------------------------------------------------------------- |
| `--elevation`                           | The size of the shadow for the tab component                           |
| `--tab-caption-horizontal-padding`      | Tab caption horizontal padding                                         |
| `--tab-caption-image-horizontal-margin` | Tab caption image horizontal margin                                    |
| `--tab-caption-image-vertical-margin`   | Tab caption image vertical margin                                      |
| `--tab-caption-vertical-padding`        | Tab caption vertical padding                                           |
| `--tab-strip-background-color`          | Tab strip background color                                             |
| `--tab-strip-elevation`                 | The size of the shadow for the tab strip                               |
| `--tab-strip-height`                    | Tab strip height                                                       |
| `--tab-strip-indicator-color`           | Background color of the indicator. Used when a tab caption is selected |
| `--tab-strip-separator-color`           | Color to underline the entire tab strip                                |

---

_Built with [StencilJS](https://stenciljs.com/)_
