# gx-checkbox

<!-- Auto Generated Below -->

## Properties

| Property         | Attribute          | Description                                                                                                                                                                                                      | Type      | Default     |
| ---------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------- |
| `accessibleName` | `accessible-name`  | Specifies a short string, typically 1 to 3 words, that authors associate with an element to provide users of assistive technologies with a label for the element.                                                | `string`  | `undefined` |
| `caption`        | `caption`          | Specifies the label of the checkbox.                                                                                                                                                                             | `string`  | `undefined` |
| `checked`        | `checked`          | Indicates that the control is selected by default.                                                                                                                                                               | `boolean` | `undefined` |
| `checkedValue`   | `checked-value`    | The value when the checkbox is 'on'                                                                                                                                                                              | `string`  | `undefined` |
| `cssClass`       | `css-class`        | A CSS class to set as the `gx-checkbox` element class.                                                                                                                                                           | `string`  | `undefined` |
| `disabled`       | `disabled`         | This attribute lets you specify if the element is disabled. If disabled, it will not fire any user interaction related event (for example, click event).                                                         | `boolean` | `false`     |
| `highlightable`  | `highlightable`    | True to highlight control when an action is fired.                                                                                                                                                               | `boolean` | `false`     |
| `readonly`       | `readonly`         | This attribute indicates that the user cannot modify the value of the control. Same as [readonly](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-readonly) attribute for `input` elements. | `boolean` | `false`     |
| `unCheckedValue` | `un-checked-value` | The value when the checkbox is 'off'                                                                                                                                                                             | `string`  | `undefined` |
| `value`          | `value`            | The value of the control.                                                                                                                                                                                        | `string`  | `undefined` |

## Events

| Event   | Description                                                                                 | Type               |
| ------- | ------------------------------------------------------------------------------------------- | ------------------ |
| `click` | Emitted when the element is clicked or the space key is pressed and released.               | `CustomEvent<any>` |
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
  gx-dynamic-form --> gx-checkbox
  style gx-checkbox fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
