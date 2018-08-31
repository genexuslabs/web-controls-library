# gx-select-option

Options for `gx-select` custom element, like the `option` native element.

<!-- Auto Generated Below -->

## Properties

| Property   | Attribute   | Description                                                                                                                                              | Type      |
| ---------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `cssClass` | `css-class` | A CSS class to set as the inner `input` element class.                                                                                                   | `string`  |
| `disabled` | `disabled`  | This attribute lets you specify if the element is disabled. If disabled, it will not fire any user interaction related event (for example, click event). | `boolean` |
| `selected` | `selected`  | Indicates that the control is selected by default.                                                                                                       | `boolean` |
| `value`    | `value`     | The initial value of the control.                                                                                                                        | `string`  |

## Events

| Event               | Description                                                                                  |
| ------------------- | -------------------------------------------------------------------------------------------- |
| `gxDisable`         | Emitted when the option is disabled.                                                         |
| `gxSelect`          | Emitted when the option is selected.                                                         |
| `gxSelectDidLoad`   | Emitted when the option loads.                                                               |
| `gxSelectDidUnload` | Emitted when the option unloads.                                                             |
| `onChange`          | The `change` event is emitted when a change to the element's value is committed by the user. |

---

_Built with [StencilJS](https://stenciljs.com/)_
