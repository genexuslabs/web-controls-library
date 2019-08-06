# gx-navbar

A navigation bar for showing a list of links for navigation purposes.

## Children

### Logo or brand image

A logo or brand image can be specified using an `<img>` element with `slot="header"` attribute set.

### Items

Currently the navigation bar support specifying a set of links using `<gx-navbar-link>` elements.

## Example

```html
<gx-navbar caption="Sample">
  <gx-navbar-link href="#">First item</gx-navbar-link>
  <gx-navbar-link href="#" active="">Second item (active)</gx-navbar-link>
  <gx-navbar-link href="#" disabled="">Third item (disabled)</gx-navbar-link>
</gx-navbar>
```

<!-- Auto Generated Below -->

## Properties

| Property            | Attribute             | Description                                                                                                                                                                                                                                                                                                                                                                                  | Type                         | Default      |
| ------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ------------ |
| `caption`           | `caption`             | This attribute lets you specify an optional title for the navigation bar \| Value \| Details \| \| ------------ \| --------------------------------------------------------------------------- \| \| `keep-space` \| The element remains in the document flow, and it does occupy space. \| \| `collapse` \| The element is removed form the document flow, and it doesn't occupy space. \|  | `string`                     | `undefined`  |
| `cssClass`          | `css-class`           | A CSS class to set as the inner element class.                                                                                                                                                                                                                                                                                                                                               | `string`                     | `undefined`  |
| `id`                | `id`                  | The identifier of the control. Must be unique.                                                                                                                                                                                                                                                                                                                                               | `string`                     | `undefined`  |
| `invisibleMode`     | `invisible-mode`      | This attribute lets you specify how this element will behave when hidden. \| Value \| Details \| \| ------------ \| --------------------------------------------------------------------------- \| \| `keep-space` \| The element remains in the document flow, and it does occupy space. \| \| `collapse` \| The element is removed form the document flow, and it doesn't occupy space. \| | `"collapse" \| "keep-space"` | `"collapse"` |
| `toggleButtonLabel` | `toggle-button-label` | This attribute lets you specify the label for the toggle button. Important for accessibility.                                                                                                                                                                                                                                                                                                | `string`                     | `undefined`  |

---

_Built with [StencilJS](https://stenciljs.com/)_
