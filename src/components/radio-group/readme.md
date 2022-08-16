# gx-radio-group

A radio group is a group of radio buttons (`gx-radio-option`). It allows a user to select at most one radio button from a set. Checking one radio button that belongs to a radio group unchecks any previous checked radio button within the same group.

## Children

There must be at least a `gx-radio-option` custom element as a child. Each radio option must have a different value set.

The one option whose value matches the value of the group will be automatically marked as selected.

<!-- Auto Generated Below -->

## Properties

| Property        | Attribute        | Description                                                                                                                                                                                                                                                                                                                                                                                  | Type                         | Default      |
| --------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ------------ |
| `cssClass`      | `css-class`      | A CSS class to set as the `gx-radio-group` element class.                                                                                                                                                                                                                                                                                                                                    | `string`                     | `undefined`  |
| `direction`     | `direction`      | Specifies how the child `gx-radio-option` will be layed out. It supports two values: _ `horizontal` _ `vertical` (default)                                                                                                                                                                                                                                                                   | `"horizontal" \| "vertical"` | `"vertical"` |
| `disabled`      | `disabled`       | This attribute lets you specify if the element is disabled. If disabled, it will not fire any user interaction related event (for example, click event).                                                                                                                                                                                                                                     | `boolean`                    | `false`      |
| `invisibleMode` | `invisible-mode` | This attribute lets you specify how this element will behave when hidden. \| Value \| Details \| \| ------------ \| --------------------------------------------------------------------------- \| \| `keep-space` \| The element remains in the document flow, and it does occupy space. \| \| `collapse` \| The element is removed form the document flow, and it doesn't occupy space. \| | `"collapse" \| "keep-space"` | `"collapse"` |
| `name`          | `name`           | The name that will be set to all the inner inputs of type radio                                                                                                                                                                                                                                                                                                                              | `string`                     | `undefined`  |
| `readonly`      | `readonly`       | This attribute indicates that the user cannot modify the value of the control. Same as [readonly](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-readonly) attribute for `input` elements.                                                                                                                                                                             | `boolean`                    | `undefined`  |
| `value`         | `value`          | The initial value of the control. Setting the value automatically selects the corresponding radio option.                                                                                                                                                                                                                                                                                    | `string`                     | `undefined`  |

## Events

| Event    | Description                                                                                  | Type               |
| -------- | -------------------------------------------------------------------------------------------- | ------------------ |
| `change` | The `change` event is emitted when a change to the element's value is committed by the user. | `CustomEvent<any>` |

---

_Built with [StencilJS](https://stenciljs.com/)_
