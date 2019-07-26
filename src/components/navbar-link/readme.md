# gx-navbar-link

Represents an item with a link inside a `<gx-navbar>`.

## Example

```html
<gx-navbar caption="Sample">
  <gx-navbar-link href="#">First item</gx-navbar-link>
  <gx-navbar-link href="#" active="">Second item (active)</gx-navbar-link>
  <gx-navbar-link href="#" disabled="">Third item (disabled)</gx-navbar-link>
  <gx-navbar-link href="#"
    ><img src="image1.png" />Forth item (with image)</gx-navbar-link
  >
  <gx-navbar-link href="#"
    ><img src="image2.png" /><!-- just an image --></gx-navbar-link
  >
</gx-navbar>
```

<!-- Auto Generated Below -->

## Properties

| Property        | Attribute        | Description                                                                                                                                                                                                                                                                                                                                                                                  | Type                         | Default      |
| --------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ------------ |
| `active`        | `active`         | Indicates if the navbar item is the active one (for example, when the item represents the current page)                                                                                                                                                                                                                                                                                      | `boolean`                    | `false`      |
| `cssClass`      | `css-class`      | A CSS class to set as the inner element class.                                                                                                                                                                                                                                                                                                                                               | `string`                     | `undefined`  |
| `disabled`      | `disabled`       | This attribute lets you specify if the navbar item is disabled.                                                                                                                                                                                                                                                                                                                              | `boolean`                    | `false`      |
| `href`          | `href`           | This attribute lets you specify the URL of the navbar item.                                                                                                                                                                                                                                                                                                                                  | `string`                     | `""`         |
| `iconSrc`       | `icon-src`       | This attribute lets you specify the URL of an icon for the navbar item.                                                                                                                                                                                                                                                                                                                      | `string`                     | `""`         |
| `invisibleMode` | `invisible-mode` | This attribute lets you specify how this element will behave when hidden. \| Value \| Details \| \| ------------ \| --------------------------------------------------------------------------- \| \| `keep-space` \| The element remains in the document flow, and it does occupy space. \| \| `collapse` \| The element is removed form the document flow, and it doesn't occupy space. \| | `"collapse" \| "keep-space"` | `"collapse"` |

## Events

| Event     | Description                          | Type                |
| --------- | ------------------------------------ | ------------------- |
| `onClick` | Emitted when the element is clicked. | `CustomEvent<void>` |

---

_Built with [StencilJS](https://stenciljs.com/)_
