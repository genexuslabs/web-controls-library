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
  <gx-tab-page slot="page"> First tab page </gx-tab-page>

  <gx-tab-caption slot="caption" selected="true">Tab Page 2</gx-tab-caption>
  <gx-tab-page slot="page"> Second tab page </gx-tab-page>

  <gx-tab-caption slot="caption">Tab Page 3</gx-tab-caption>
  <gx-tab-page slot="page"> Third tab page </gx-tab-page>

  <gx-tab-caption slot="caption" disabled>Tab Page 4 (disabled)</gx-tab-caption>
  <gx-tab-page slot="page"> Forth tab page (disabled) </gx-tab-page>
</gx-tab>
```

<!-- Auto Generated Below -->

## Properties

| Property           | Attribute            | Description                                                                                                                                                                                                                                                                                                                                                          | Type                       | Default     |
| ------------------ | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- | ----------- |
| `accessibleName`   | `accessible-name`    | Specifies a short string, typically 1 to 3 words, that authors associate with an element to provide users of assistive technologies with a label for the element.                                                                                                                                                                                                    | `string`                   | `undefined` |
| `accessibleNameBy` | `accessible-name-by` | Specifies the accessible name property value by providing the ID of the HTMLElement that has the accessible name text.                                                                                                                                                                                                                                               | `string`                   | `undefined` |
| `cssClass`         | `css-class`          | A CSS class to set as the `gx-tab` element class.                                                                                                                                                                                                                                                                                                                    | `string`                   | `undefined` |
| `highlightable`    | `highlightable`      | True to highlight control when an action is fired.                                                                                                                                                                                                                                                                                                                   | `boolean`                  | `false`     |
| `tabsDistribution` | `tabs-distribution`  | Defines how the tabs will be distributed in the Strip. \| Value \| Details \| \| ------------ \| ---------------------------------------------------------------------------------- \| \| `scroll` \| Allows scrolling the tab control when the number of tabs exceeds the screen width. \| \| `fixed-size` \| Tabs are fixed size. Used with any amount of tabs. \| | `"fixed-size" \| "scroll"` | `"scroll"`  |

## Events

| Event       | Description                          | Type               |
| ----------- | ------------------------------------ | ------------------ |
| `tabChange` | Fired when the active tab is changed | `CustomEvent<any>` |

## Slots

| Slot        | Description                    |
| ----------- | ------------------------------ |
| `"caption"` | The slot for the tab captions. |
| `"page"`    | The slot for the tab pages.    |

## Shadow Parts

| Part                      | Description                                                 |
| ------------------------- | ----------------------------------------------------------- |
| `"nav-tabs"`              | The main parent of the container of the tab captions.       |
| `"nav-tabs-table"`        | The main parent container of the tab captions.              |
| `"nav-tabs-table-filler"` | The tab strip filler when the `tabs-distribution="scroll"`. |
| `"tab-content"`           | The main parent container of the tab pages.                 |

## CSS Custom Properties

| Name                                     | Description                                                            |
| ---------------------------------------- | ---------------------------------------------------------------------- |
| `--elevation`                            | The size of the shadow for the tab component                           |
| `--gx-tab-caption-horizontal-separation` | Tab caption horizontal separation between image and text               |
| `--gx-tab-caption-overflow`              | The caption overflow for gx-tab-caption control                        |
| `--gx-tab-caption-vertical-separation`   | Tab caption vertical separation between image and text                 |
| `--tab-strip-background-color`           | Tab strip background color                                             |
| `--tab-strip-elevation`                  | The size of the shadow for the tab strip                               |
| `--tab-strip-height`                     | Tab strip height                                                       |
| `--tab-strip-indicator-color`            | Background color of the indicator. Used when a tab caption is selected |
| `--tab-strip-separator-color`            | Color to underline the entire tab strip                                |

---

_Built with [StencilJS](https://stenciljs.com/)_
