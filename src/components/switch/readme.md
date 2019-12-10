# gx-switch

A switch/toggle control that enables you to select between options.

<!-- Auto Generated Below -->


## Properties

| Property        | Attribute        | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Type                         | Default      |
| --------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ------------ |
| `caption`       | `caption`        | Attribute that provides the caption to the control.                                                                                                                                                                                                                                                                                                                                                                                                                                | `string`                     | `undefined`  |
| `checked`       | `checked`        | Indicates if switch control is checked by default.                                                                                                                                                                                                                                                                                                                                                                                                                                 | `boolean`                    | `undefined`  |
| `disabled`      | `disabled`       | This attribute allows you specify if the element is disabled. If disabled, it will not trigger any user interaction related event (for example, click event).                                                                                                                                                                                                                                                                                                                      | `boolean`                    | `false`      |
| `invisibleMode` | `invisible-mode` | This attribute lets you specify how this element will behave when hidden.  \| Value        \| Details                                                                     \| \| ------------ \| --------------------------------------------------------------------------- \| \| `keep-space` \| The element remains in the document flow, and it does occupy space.         \| \| `collapse`   \| The element is removed form the document flow, and it doesn't occupy space. \| | `"collapse" \| "keep-space"` | `"collapse"` |
| `value`         | `value`          | The value of the control.                                                                                                                                                                                                                                                                                                                                                                                                                                                          | `string`                     | `undefined`  |


## Events

| Event   | Description                                                                                 | Type               |
| ------- | ------------------------------------------------------------------------------------------- | ------------------ |
| `input` | The 'input' event is emitted when a change to the element's value is committed by the user. | `CustomEvent<any>` |


## Methods

### `getNativeInputId() => Promise<string>`

Returns the id of the inner `input` element (if set).

#### Returns

Type: `Promise<string>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
