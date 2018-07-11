# gx-navbar-link

Represents an item with a link inside a `<gx-navbar>`.

## Example

```html
<gx-navbar caption="Sample">
  <gx-navbar-link href="#">First item</gx-navbar-link>
  <gx-navbar-link href="#" active="">Second item (active)</gx-navbar-link>
  <gx-navbar-link href="#" disabled="">Third item (disabled)</gx-navbar-link>
  <gx-navbar-link href="#"><img src="image1.png"/>Forth item (with image)</gx-navbar-link>
  <gx-navbar-link href="#"><img src="image2.png"/><!-- just an image --></gx-navbar-link>
</gx-navbar>
```

<!-- Auto Generated Below -->

## Properties

#### active

boolean

Indicates if the navbar item is the active one (for example, when the item represents the current page)

#### cssClass

string

A CSS class to set as the inner element class.

#### disabled

boolean

This attribute lets you specify if the navbar item is disabled.

#### href

string

This attribute lets you specify the URL of the navbar item.

#### invisibleMode

string

This attribute lets you specify how this element will behave when hidden.

| Value        | Details                                                                     |
| ------------ | --------------------------------------------------------------------------- |
| `keep-space` | The element remains in the document flow, and it does occupy space.         |
| `collapse`   | The element is removed form the document flow, and it doesn't occupy space. |

## Attributes

#### active

boolean

Indicates if the navbar item is the active one (for example, when the item represents the current page)

#### css-class

string

A CSS class to set as the inner element class.

#### disabled

boolean

This attribute lets you specify if the navbar item is disabled.

#### href

string

This attribute lets you specify the URL of the navbar item.

#### invisible-mode

string

This attribute lets you specify how this element will behave when hidden.

| Value        | Details                                                                     |
| ------------ | --------------------------------------------------------------------------- |
| `keep-space` | The element remains in the document flow, and it does occupy space.         |
| `collapse`   | The element is removed form the document flow, and it doesn't occupy space. |

## Events

#### onClick

Emitted when the element is clicked.

---

_Built with [StencilJS](https://stenciljs.com/)_
