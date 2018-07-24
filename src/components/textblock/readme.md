# gx-textblock

This is a simple element that allows showing text. Optionally, a URL can be specified in the `href` attribute, to behave as an anchor.

## Children

The text caption of the textblock will be its text content. Being a child instead of an attribute allows us to set text or HTML.

<!-- Auto Generated Below -->

## Properties

#### disabled

boolean

This attribute lets you specify if the element is disabled.
If disabled, it will not fire any user interaction related event
(for example, click event).

#### href

string

This attribute lets you specify an URL. If a URL is specified, the textblock acts as an anchor.

#### invisibleMode

string

This attribute lets you specify how this element will behave when hidden.

| Value        | Details                                                                     |
| ------------ | --------------------------------------------------------------------------- |
| `keep-space` | The element remains in the document flow, and it does occupy space.         |
| `collapse`   | The element is removed form the document flow, and it doesn't occupy space. |

## Attributes

#### disabled

boolean

This attribute lets you specify if the element is disabled.
If disabled, it will not fire any user interaction related event
(for example, click event).

#### href

string

This attribute lets you specify an URL. If a URL is specified, the textblock acts as an anchor.

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
