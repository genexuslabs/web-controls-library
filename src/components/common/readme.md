# Common attributes, events and methods

## Attributes

### disabled

This attribute lets you specify if the element is disabled. If disabled, it will not fire any user interaction related event (for example, click event). If a disabled image has been specified, it will be shown, hiding the base image (if specified).

### hidden

This attribute lets you specify if the element is visible or not.

### invisible-mode

This attribute lets you specify how this element will behave when hidden.

| Value        | Details                                                                     |
| ------------ | --------------------------------------------------------------------------- |
| `collapse`   | The element is removed form the document flow, and it doesn't occupy space. |
| `keep-space` | The element remains in the document flow, and it does occupy space.         |

### auto-grow

This attribute defines if the control size will grow automatically, to adjust to its content size.
If set to `false`, it won't grow automatically and it will show scrollbars if the content overflows.

## Events

### click

Emitted when the element is clicked.
