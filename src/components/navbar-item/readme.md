# gx-navbar-item

Represents an item with a link inside a `<gx-navbar>`.

## Example

```html
<gx-navbar caption="Sample">
  <gx-navbar-item slot="navigation" href="#">First item</gx-navbar-item>
  <gx-navbar-item slot="navigation" href="#" active=""
    >Second item (active)</gx-navbar-item
  >
  <gx-navbar-item slot="navigation" href="#" disabled=""
    >Third item (disabled)</gx-navbar-item
  >
  <gx-navbar-item slot="navigation" href="#"
    ><img src="image1.png" />Forth item (with image)</gx-navbar-item
  >
  <gx-navbar-item slot="navigation" href="#"
    ><img src="image2.png" /><!-- just an image --></gx-navbar-item
  >
</gx-navbar>
```

<!-- Auto Generated Below -->

## Properties

| Property      | Attribute       | Description                                                                                             | Type      | Default |
| ------------- | --------------- | ------------------------------------------------------------------------------------------------------- | --------- | ------- |
| `active`      | `active`        | Indicates if the navbar item is the active one (for example, when the item represents the current page) | `boolean` | `false` |
| `href`        | `href`          | This attribute lets you specify the URL of the navbar item.                                             | `""`      | `""`    |
| `iconAltText` | `icon-alt-text` | This attribute lets you specify the alternate text for the image specified in iconSrc.                  | `""`      | `""`    |
| `iconSrc`     | `icon-src`      | This attribute lets you specify the URL of an icon for the navbar item.                                 | `""`      | `""`    |

---

_Built with [StencilJS](https://stenciljs.com/)_
