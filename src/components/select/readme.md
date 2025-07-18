# gx-select

A wrapper for the select element where the options are `gx-select-option` custom elements. It allows a user to select at most one option from a set.

## Children

There must be at least a `gx-select-option` custom element as a child. Each select option must have a different value set.

The one option whose value matches the value of the select will be automatically marked as selected.

<!-- Auto Generated Below -->

## Properties

| Property         | Attribute         | Description                                                                                                                                                                                                      | Type      | Default     |
| ---------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------- |
| `accessibleName` | `accessible-name` | Specifies a short string, typically 1 to 3 words, that authors associate with an element to provide users of assistive technologies with a label for the element. Only works if `readonly="false"`.              | `string`  | `undefined` |
| `cssClass`       | `css-class`       | A CSS class to set as the `gx-select` element class.                                                                                                                                                             | `string`  | `undefined` |
| `disabled`       | `disabled`        | This attribute lets you specify if the element is disabled. If disabled, it will not fire any user interaction related event (for example, click event).                                                         | `boolean` | `false`     |
| `placeholder`    | `placeholder`     | Text that appears in the form control when it has no value set                                                                                                                                                   | `string`  | `undefined` |
| `readonly`       | `readonly`        | This attribute indicates that the user cannot modify the value of the control. Same as [readonly](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-readonly) attribute for `input` elements. | `boolean` | `undefined` |
| `suggest`        | `suggest`         | Render a text input showing a list of suggested elements.                                                                                                                                                        | `boolean` | `undefined` |
| `value`          | `value`           | The initial value of the control. Setting the value automatically selects the corresponding option.                                                                                                              | `string`  | `undefined` |

## Events

| Event   | Description                                                                                 | Type               |
| ------- | ------------------------------------------------------------------------------------------- | ------------------ |
| `input` | The `input` event is emitted when a change to the element's value is committed by the user. | `CustomEvent<any>` |

## Methods

### `getNativeInputId() => Promise<string>`

Returns the id of the inner `input` element (if set).

#### Returns

Type: `Promise<string>`

## Dependencies

### Used by

- [gx-dynamic-form](../dynamic-form)

### Graph

```mermaid
graph TD;
  gx-dynamic-form --> gx-select
  style gx-select fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
