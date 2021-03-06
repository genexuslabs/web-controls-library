# gx-message

A message box for showing information, warning or error messages.

<!-- Auto Generated Below -->

## Properties

| Property          | Attribute           | Description                                                                                                                                                                                                                                                                                                                                                                                  | Type                             | Default      |
| ----------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ------------ |
| `closeButtonText` | `close-button-text` | Text for the close button.                                                                                                                                                                                                                                                                                                                                                                   | `string`                         | `undefined`  |
| `duration`        | `duration`          | The time in miliseconds before the message is automatically dismissed. If no duration is specified, the message will not be automatically dismissed.                                                                                                                                                                                                                                         | `number`                         | `undefined`  |
| `invisibleMode`   | `invisible-mode`    | This attribute lets you specify how this element will behave when hidden. \| Value \| Details \| \| ------------ \| --------------------------------------------------------------------------- \| \| `keep-space` \| The element remains in the document flow, and it does occupy space. \| \| `collapse` \| The element is removed form the document flow, and it doesn't occupy space. \| | `"collapse" \| "keep-space"`     | `"collapse"` |
| `showCloseButton` | `show-close-button` | Show a button for closing the meesage box                                                                                                                                                                                                                                                                                                                                                    | `boolean`                        | `undefined`  |
| `type`            | `type`              | Type of the button: _ `info`: Information message _ `warning`: Warning Message \* `error`: Error message                                                                                                                                                                                                                                                                                     | `"error" \| "info" \| "warning"` | `undefined`  |

## CSS Custom Properties

| Name                                    | Description              |
| --------------------------------------- | ------------------------ |
| `--gx-message-error-background-color`   | Error background color   |
| `--gx-message-error-color`              | Error text color         |
| `--gx-message-info-background-color`    | Info background color    |
| `--gx-message-info-color`               | Info text color          |
| `--gx-message-warning-background-color` | Warning background color |
| `--gx-message-warning-color`            | Warning text color       |

---

_Built with [StencilJS](https://stenciljs.com/)_
