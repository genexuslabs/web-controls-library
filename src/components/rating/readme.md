# gx-rating

The `gx-rating` allows displaying scores or rate items using stars.

E.g.:

<div>
    <svg viewBox="0 0 100 100" width="40" heigth="40" style=" filter: drop-shadow(0 0 2px #e4ac13);"><polygon fill="#e4ac13" points="50,0 15,95 100,35 0,35 85,95"/></svg>
    <svg viewBox="0 0 100 100" width="40" heigth="40" style=" filter: drop-shadow(0 0 2px #e4ac13);"><polygon fill="#e4ac13" points="50,0 15,95 100,35 0,35 85,95"/></svg>
    <svg viewBox="0 0 100 100" width="40" heigth="40" style=" filter: drop-shadow(0 0 2px #e4ac13);"><polygon fill="#e4ac13" points="50,0 15,95 100,35 0,35 85,95"/></svg>
    <svg viewBox="0 0 100 100" width="40" heigth="40" style=" filter: drop-shadow(0 0 2px #e4ac13);"><polygon fill="#e4ac13" points="50,0 15,95 100,35 0,35 85,95"/></svg>
    <svg viewBox="0 0 100 100" width="40" heigth="40" style=" filter: drop-shadow(0 0 2px #e4ac13);"><polygon fill="#e4ac13" points="50,0 15,95 100,35 0,35 85,95"/></svg>
</div>

Use `gx-rating` with `readonly = true` to make available the 'score mode' and set values for `max-value` and `value` attributes.

_`gx-rating` is in 'rating mode' by default_

<!-- Auto Generated Below -->

## Properties

| Property        | Attribute        | Description                                                                                                                                                                                                                                                                                                                                                                                  | Type                         | Default      |
| --------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ------------ |
| `disabled`      | `disabled`       | This attribute allows you specify if the element is disabled. If disabled, it will not trigger any user interaction related event (for example, click event).                                                                                                                                                                                                                                | `boolean`                    | `false`      |
| `id`            | `id`             | The control id. Must be unique per control!                                                                                                                                                                                                                                                                                                                                                  | `string`                     | `undefined`  |
| `invisibleMode` | `invisible-mode` | This attribute lets you specify how this element will behave when hidden. \| Value \| Details \| \| ------------ \| --------------------------------------------------------------------------- \| \| `keep-space` \| The element remains in the document flow, and it does occupy space. \| \| `collapse` \| The element is removed form the document flow, and it doesn't occupy space. \| | `"collapse" \| "keep-space"` | `"collapse"` |
| `maxValue`      | `max-value`      | The current value displayed by the component.                                                                                                                                                                                                                                                                                                                                                | `number`                     | `undefined`  |
| `readonly`      | `readonly`       | This attribute indicates that the user cannot modify the value of the control. Same as [readonly](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-readonly) attribute for `input` elements. _Disable by default_                                                                                                                                                        | `boolean`                    | `false`      |
| `value`         | `value`          | The current value displayed by the component.                                                                                                                                                                                                                                                                                                                                                | `number`                     | `0`          |

## Events

| Event   | Description                                                                                 | Type                |
| ------- | ------------------------------------------------------------------------------------------- | ------------------- |
| `input` | The 'input' event is emitted when a change to the element's value is committed by the user. | `CustomEvent<void>` |

## Methods

### `getNativeInputId() => Promise<any>`

Returns the id of the inner `input` element (if set).

#### Returns

Type: `Promise<any>`

---

_Built with [StencilJS](https://stenciljs.com/)_
