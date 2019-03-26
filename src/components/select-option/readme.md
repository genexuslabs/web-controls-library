# gx-select-option

Options for `gx-select` custom element, like the `option` native element.

<!-- Auto Generated Below -->

## Properties

| Property   | Attribute   | Description                                                                                                                                              | Type      | Default     |
| ---------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------- |
| `cssClass` | `css-class` | A CSS class to set as the inner `input` element class.                                                                                                   | `string`  | `undefined` |
| `disabled` | `disabled`  | This attribute lets you specify if the element is disabled. If disabled, it will not fire any user interaction related event (for example, click event). | `boolean` | `false`     |
| `selected` | `selected`  | Indicates that the control is selected by default.                                                                                                       | `boolean` | `undefined` |
| `value`    | `value`     | The initial value of the control.                                                                                                                        | `string`  | `undefined` |

## Events

| Event               | Description                                                                                  | Type                |
| ------------------- | -------------------------------------------------------------------------------------------- | ------------------- |
| `change`            | The `change` event is emitted when a change to the element's value is committed by the user. | `CustomEvent<void>` |
| `gxDisable`         | Emitted when the option is disabled.                                                         | `CustomEvent<void>` |
| `gxSelect`          | Emitted when the option is selected.                                                         | `CustomEvent<void>` |
| `gxSelectDidLoad`   | Emitted when the option loads.                                                               | `CustomEvent<void>` |
| `gxSelectDidUnload` | Emitted when the option unloads.                                                             | `CustomEvent<void>` |

---

_Built with [StencilJS](https://stenciljs.com/)_
