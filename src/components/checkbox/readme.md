# gx-checkbox

<!-- Auto Generated Below -->

## Properties

| Property         | Attribute          | Description                                                                                                                                                                                                                                                                                                                                                                                  | Type                         | Default      |
| ---------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ------------ |
| `caption`        | `caption`          | Specifies the label of the checkbox.                                                                                                                                                                                                                                                                                                                                                         | `string`                     | `undefined`  |
| `checked`        | `checked`          | Indicates that the control is selected by default.                                                                                                                                                                                                                                                                                                                                           | `boolean`                    | `undefined`  |
| `checkedValue`   | `checked-value`    | The value when the checkbox is 'on'                                                                                                                                                                                                                                                                                                                                                          | `string`                     | `undefined`  |
| `cssClass`       | `css-class`        | A CSS class to set as the inner `input` element class.                                                                                                                                                                                                                                                                                                                                       | `string`                     | `undefined`  |
| `disabled`       | `disabled`         | This attribute lets you specify if the element is disabled. If disabled, it will not fire any user interaction related event (for example, click event).                                                                                                                                                                                                                                     | `boolean`                    | `false`      |
| `id`             | `id`               | The identifier of the control. Must be unique.                                                                                                                                                                                                                                                                                                                                               | `string`                     | `undefined`  |
| `invisibleMode`  | `invisible-mode`   | This attribute lets you specify how this element will behave when hidden. \| Value \| Details \| \| ------------ \| --------------------------------------------------------------------------- \| \| `keep-space` \| The element remains in the document flow, and it does occupy space. \| \| `collapse` \| The element is removed form the document flow, and it doesn't occupy space. \| | `"collapse" \| "keep-space"` | `"collapse"` |
| `unCheckedValue` | `un-checked-value` | The value when the checkbox is 'off'                                                                                                                                                                                                                                                                                                                                                         | `string`                     | `undefined`  |
| `value`          | `value`            | The value of the control.                                                                                                                                                                                                                                                                                                                                                                    | `string`                     | `undefined`  |

## Events

| Event   | Description                                                                                 | Type               |
| ------- | ------------------------------------------------------------------------------------------- | ------------------ |
| `input` | The `input` event is emitted when a change to the element's value is committed by the user. | `CustomEvent<any>` |

## Methods

### `getNativeInputId() => Promise<string>`

Returns the id of the inner `input` element (if set).

#### Returns

Type: `Promise<string>`

---

_Built with [StencilJS](https://stenciljs.com/)_
