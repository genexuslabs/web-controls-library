# gx-password-edit

An password edit box with that optionally shows a button to reveal the password value.

<!-- Auto Generated Below -->

## Properties

| Property              | Attribute                | Description                                                                                                                                                                                                      | Type      |
| --------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `cssClass`            | `css-class`              | A CSS class to set as the inner `input` element class.                                                                                                                                                           | `string`  |
| `disabled`            | `disabled`               | This attribute lets you specify if the element is disabled. If disabled, it will not fire any user interaction related event (for example, click event).                                                         | `boolean` |
| `id`                  | `id`                     | The identifier of the control. Must be unique.                                                                                                                                                                   | `string`  |
| `invisibleMode`       | `invisible-mode`         | This attribute lets you specify how this element will behave when hidden.                                                                                                                                        | Value     | Details |  | ------------ | --------------------------------------------------------------------------- |  | `keep-space` | The element remains in the document flow, and it does occupy space. |  | `collapse` | The element is removed form the document flow, and it doesn't occupy space. |  | `"collapse" | "keep-space"` |
| `placeholder`         | `placeholder`            | A hint to the user of what can be entered in the control. Same as [placeholder](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-placeholder) attribute for `input` elements.                | `string`  |
| `readonly`            | `readonly`               | This attribute indicates that the user cannot modify the value of the control. Same as [readonly](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-readonly) attribute for `input` elements. | `boolean` |
| `revealButtonTextOff` | `reveal-button-text-off` | Text of the reveal button to offer hiding the password.                                                                                                                                                          | `string`  |
| `revealButtonTextOn`  | `reveal-button-text-on`  | Text of the reveal button to offer revealing the password.                                                                                                                                                       | `string`  |
| `showRevealButton`    | `show-reveal-button`     | If true, a reveal password button is shown next to the password input. Pressing the reveal button toggles the password mask, allowing the user to view the password text.                                        | `boolean` |
| `value`               | `value`                  | The initial value of the control.                                                                                                                                                                                | `string`  |

## Events

| Event      | Description                                                                                                                                                                                                                                |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `onChange` | The `change` event is emitted when a change to the element's value is committed by the user. Unlike the `input` event, the `change` event is not necessarily fired for each change to an element's value but when the control loses focus. |
| `onInput`  | The `input` event is fired synchronously when the value is changed.                                                                                                                                                                        |

## Methods

| Method             | Description                                           |
| ------------------ | ----------------------------------------------------- |
| `getNativeInputId` | Returns the id of the inner `input` element (if set). |

---

_Built with [StencilJS](https://stenciljs.com/)_
