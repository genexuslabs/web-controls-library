# gx-query-viewer-format-style

<!-- Auto Generated Below -->

## Properties

| Property             | Attribute                | Description                                       | Type                                                   | Default     |
| -------------------- | ------------------------ | ------------------------------------------------- | ------------------------------------------------------ | ----------- |
| `applyToRowOrColumn` | `apply-to-row-or-column` | If Conditional true for applying to row or column | `boolean`                                              | `undefined` |
| `operator`           | `operator`               | If Format the operator of the element             | `"EQ" \| "GE" \| "GT" \| "IN" \| "LE" \| "LT" \| "NE"` | `undefined` |
| `styleOrClass`       | `style-or-class`         | Style or Css class                                | `string`                                               | `undefined` |
| `type`               | `type`                   | Type of the element Conditional or Format         | `"Conditional" \| "Values"`                            | `undefined` |
| `value`              | `value`                  | If Conditional Value to format                    | `string`                                               | `undefined` |
| `value1`             | `value-1`                | If format first value                             | `string`                                               | `undefined` |
| `value2`             | `value-2`                | If format second value                            | `string`                                               | `undefined` |

## Events

| Event            | Description | Type               |
| ---------------- | ----------- | ------------------ |
| `elementChanged` |             | `CustomEvent<any>` |

---

_Built with [StencilJS](https://stenciljs.com/)_
