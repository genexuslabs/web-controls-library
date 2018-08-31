# gx-message

A message box for showing information, warning or error messages.

<!-- Auto Generated Below -->

## Properties

| Property          | Attribute           | Description                                                                                                                                          | Type                           |
| ----------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| `closeButtonText` | `close-button-text` | Text for the close button.                                                                                                                           | `string`                       |
| `duration`        | `duration`          | The time in miliseconds before the message is automatically dismissed. If no duration is specified, the message will not be automatically dismissed. | `number`                       |
| `invisibleMode`   | `invisible-mode`    | This attribute lets you specify how this element will behave when hidden.                                                                            | Value                          | Details |  | ------------ | --------------------------------------------------------------------------- |  | `keep-space` | The element remains in the document flow, and it does occupy space. |  | `collapse` | The element is removed form the document flow, and it doesn't occupy space. |  | `"collapse" | "keep-space"` |
| `showCloseButton` | `show-close-button` | Show a button for closing the meesage box                                                                                                            | `boolean`                      |
| `type`            | `type`              | Type of the button: _ `info`: Information message _ `warning`: Warning Message \* `error`: Error message                                             | `"info" | "warning" | "error"` |

---

_Built with [StencilJS](https://stenciljs.com/)_
