# gx-rating

The `gx-rating` component allows displaying scores or rate items using stars.

## Samples

- `gx-rating` with `readonly` disabled or false:

  > By default, the `readonly` property has `false` as value.
  > This meaning that you can rate by clicking in a star.
  > To use the control in this mode just write the tag of `gx-rating` as the following examlpe:

  ```HTML
  <gx-rating></gx-rating>
  ```

- `gx-rating` readonly:

  > If you want to display a score, use `gx-rating` with `readonly = "true"`
  > and set values for `max-value` and `value` attributes.
  > Example of how to set the necessary properties to show a score:

  ```HTML
  <gx-rating readonly="true" max-value="5" value="4"></gx-rating>
  ```

<!-- Auto Generated Below -->

## Properties

| Property        | Attribute        | Description                                                                                                                                                                                                                                                                                                                                                                                  | Type                         | Default      |
| --------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ------------ |
| `cssClass`      | `css-class`      | A CSS class to set as the `gx-rating` element class.                                                                                                                                                                                                                                                                                                                                         | `string`                     | `undefined`  |
| `disabled`      | `disabled`       | This attribute allows you specify if the element is disabled. If disabled, it will not trigger any user interaction related event (for example, click event).                                                                                                                                                                                                                                | `boolean`                    | `false`      |
| `invisibleMode` | `invisible-mode` | This attribute lets you specify how this element will behave when hidden. \| Value \| Details \| \| ------------ \| --------------------------------------------------------------------------- \| \| `keep-space` \| The element remains in the document flow, and it does occupy space. \| \| `collapse` \| The element is removed form the document flow, and it doesn't occupy space. \| | `"collapse" \| "keep-space"` | `"collapse"` |
| `maxValue`      | `max-value`      | This property determine the number of stars displayed.                                                                                                                                                                                                                                                                                                                                       | `number`                     | `5`          |
| `value`         | `value`          | The current value displayed by the component.                                                                                                                                                                                                                                                                                                                                                | `number`                     | `0`          |

## Events

| Event   | Description                                                                                 | Type               |
| ------- | ------------------------------------------------------------------------------------------- | ------------------ |
| `input` | The 'input' event is emitted when a change to the element's value is committed by the user. | `CustomEvent<any>` |

## Methods

### `getNativeInputId() => Promise<string>`

Returns the id of the inner `input` element (if set).

#### Returns

Type: `Promise<string>`

## CSS Custom Properties

| Name                | Description                                 |
| ------------------- | ------------------------------------------- |
| `--star-heigth`     | Set the heigth of each star.                |
| `--star-separation` | This is for set the space between each star |
| `--star-width`      | Set the width of each star.                 |

---

_Built with [StencilJS](https://stenciljs.com/)_
