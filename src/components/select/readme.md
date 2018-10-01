# gx-select

A wrapper for the select element where the options are `gx-select-option` custom elements. It allows a user to select at most one option from a set.

## Children

There must be at least a `gx-select-option` custom element as a child. Each select option must have a different value set.

The one option whose value matches the value of the select will be automatically marked as selected.

<!-- Auto Generated Below -->

## Properties

| Property        | Attribute        | Description                                                                                                                                                                                                      | Type      |
| --------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `cssClass`      | `css-class`      | A CSS class to set as the inner `input` element class.                                                                                                                                                           | `string`  |
| `disabled`      | `disabled`       | This attribute lets you specify if the element is disabled. If disabled, it will not fire any user interaction related event (for example, click event).                                                         | `boolean` |
| `id`            | `id`             | The identifier of the control. Must be unique.                                                                                                                                                                   | `string`  |
| `invisibleMode` | `invisible-mode` | This attribute lets you specify how this element will behave when hidden.                                                                                                                                        | Value     | Details |  | ------------ | --------------------------------------------------------------------------- |  | `keep-space` | The element remains in the document flow, and it does occupy space. |  | `collapse` | The element is removed form the document flow, and it doesn't occupy space. |  | `"collapse"`, `"keep-space"` |
| `readonly`      | `readonly`       | This attribute indicates that the user cannot modify the value of the control. Same as [readonly](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-readonly) attribute for `input` elements. | `boolean` |
| `value`         | `value`          | The initial value of the control. Setting the value automatically selects the corresponding option.                                                                                                              | `string`  |

## Events

| Event      | Description                                                                                  |
| ---------- | -------------------------------------------------------------------------------------------- |
| `onChange` | The `change` event is emitted when a change to the element's value is committed by the user. |

## Methods

| Method             | Description                                           |
| ------------------ | ----------------------------------------------------- |
| `getNativeInputId` | Returns the id of the inner `input` element (if set). |

---

_Built with [StencilJS](https://stenciljs.com/)_
