# gx-rating

The `gx-rating` allows displaying scores and rate something.

Use `gx-rating` with `readonly = true` make available the 'scoring mode' and set `max-value`and `value`.

_`gx-rating` is in 'rating mode' by default_

<!-- Auto Generated Below -->

## Properties

| Property        | Attribute        | Description                                                                                                                                                                                                                                                                                                                                                                                  | Type                         | Default      |
| --------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ------------ |
| `disabled`      | `disabled`       | This attribute allows you specify if the element is disabled. If disabled, it will not trigger any user interaction related event (for example, click event).                                                                                                                                                                                                                                | `boolean`                    | `false`      |
| `id`            | `id`             | The control id. Must be unique per control!                                                                                                                                                                                                                                                                                                                                                  | `string`                     | `undefined`  |
| `invisibleMode` | `invisible-mode` | This attribute lets you specify how this element will behave when hidden. \| Value \| Details \| \| ------------ \| --------------------------------------------------------------------------- \| \| `keep-space` \| The element remains in the document flow, and it does occupy space. \| \| `collapse` \| The element is removed form the document flow, and it doesn't occupy space. \| | `"collapse" \| "keep-space"` | `"collapse"` |
| `maxValue`      | `max-value`      | The current value displayed by the component.                                                                                                                                                                                                                                                                                                                                                | `number`                     | `undefined`  |
| `readonly`      | `readonly`       | This attribute i0ndicates that the user cannot modify the value of the control. Same as [readonly](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-readonly) attribute for `input` elements. _Disable by default_                                                                                                                                                       | `boolean`                    | `false`      |
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
