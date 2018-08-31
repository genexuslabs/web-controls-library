# gx-checkbox

<!-- Auto Generated Below -->

## Properties

| Property        | Attribute        | Description                                                                                                                                              | Type      |
| --------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `caption`       | `caption`        | Specifies the label of the checkbox.                                                                                                                     | `string`  |
| `checked`       | `checked`        | Indicates that the control is selected by default.                                                                                                       | `boolean` |
| `cssClass`      | `css-class`      | A CSS class to set as the inner `input` element class.                                                                                                   | `string`  |
| `disabled`      | `disabled`       | This attribute lets you specify if the element is disabled. If disabled, it will not fire any user interaction related event (for example, click event). | `boolean` |
| `id`            | `id`             | The identifier of the control. Must be unique.                                                                                                           | `string`  |
| `invisibleMode` | `invisible-mode` | This attribute lets you specify how this element will behave when hidden.                                                                                | Value     | Details |  | ------------ | --------------------------------------------------------------------------- |  | `keep-space` | The element remains in the document flow, and it does occupy space. |  | `collapse` | The element is removed form the document flow, and it doesn't occupy space. |  | `"collapse" | "keep-space"` |

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
