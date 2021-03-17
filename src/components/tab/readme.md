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

| Property        | Attribute        | Description                                                                                                                                                                                                                                                                                                                                                                                  | Type                         | Default      |
| --------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ------------ |
| `highlightable` | `highlightable`  | True to highlight control when an action is fired.                                                                                                                                                                                                                                                                                                                                           | `boolean`                    | `false`      |
| `invisibleMode` | `invisible-mode` | This attribute lets you specify how this element will behave when hidden. \| Value \| Details \| \| ------------ \| --------------------------------------------------------------------------- \| \| `keep-space` \| The element remains in the document flow, and it does occupy space. \| \| `collapse` \| The element is removed form the document flow, and it doesn't occupy space. \| | `"collapse" \| "keep-space"` | `"collapse"` |

## Events

| Event       | Description                          | Type               |
| ----------- | ------------------------------------ | ------------------ |
| `tabChange` | Fired when the active tab is changed | `CustomEvent<any>` |

## CSS Custom Properties

| Name                                    | Description                                  |
| --------------------------------------- | -------------------------------------------- |
| `--elevation`                           | The size of the shadow for the tab component |
| `--tab-caption-active-border-color`     | Active tab caption border color              |
| `--tab-caption-border-color`            | Tab captions border color                    |
| `--tab-caption-disabled-color`          | Disabled tab caption text color              |
| `--tab-caption-fous-border-color`       | Focused tab caption border color             |
| `--tab-caption-horizontal-padding`      | Tab caption horizontal padding               |
| `--tab-caption-hover-border-color`      | Hovered tab caption border color             |
| `--tab-caption-image-horizontal-margin` | Tab caption image horizontal margin          |
| `--tab-caption-image-vertical-margin`   | Tab caption image vertical margin            |
| `--tab-caption-vertical-padding`        | Tab caption vertical padding                 |
| `--tab-strip-background-color`          | Tab strip background color                   |
| `--tab-strip-elevation`                 | The size of the shadow for the tab strip     |
| `--tab-strip-height`                    | Tab strip height                             |

---

_Built with [StencilJS](https://stenciljs.com/)_
