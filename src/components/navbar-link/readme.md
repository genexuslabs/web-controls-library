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

| Property  | Attribute  | Description                                                                                             | Type      | Default |
| --------- | ---------- | ------------------------------------------------------------------------------------------------------- | --------- | ------- |
| `active`  | `active`   | Indicates if the navbar item is the active one (for example, when the item represents the current page) | `boolean` | `false` |
| `href`    | `href`     | This attribute lets you specify the URL of the navbar item.                                             | `""`      | `""`    |
| `iconSrc` | `icon-src` | This attribute lets you specify the URL of an icon for the navbar item.                                 | `""`      | `""`    |

---

_Built with [StencilJS](https://stenciljs.com/)_
