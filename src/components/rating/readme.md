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
| `disabled`      | `disabled`       | This attribute allows you specify if the element is disabled. If disabled, it will not trigger any user interaction related event (for example, click event).                                                                                                                                                                                                                                | `boolean`                    | `false`      |
| `id`            | `id`             | The control id. Must be unique per control!                                                                                                                                                                                                                                                                                                                                                  | `string`                     | `undefined`  |
| `invisibleMode` | `invisible-mode` | This attribute lets you specify how this element will behave when hidden. \| Value \| Details \| \| ------------ \| --------------------------------------------------------------------------- \| \| `keep-space` \| The element remains in the document flow, and it does occupy space. \| \| `collapse` \| The element is removed form the document flow, and it doesn't occupy space. \| | `"collapse" \| "keep-space"` | `"collapse"` |
| `maxValue`      | `max-value`      | This porpoerty is required if you want to display a score. >E.g: In a score of 4/5 stars the `maxValue` is `5` and the `value` is `4`                                                                                                                                                                                                                                                        | `number`                     | `undefined`  |
| `readonly`      | `readonly`       | This attribute indicates that the user cannot modify the value of the control. Same as [readonly](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-readonly) attribute for `input` elements. _Disable by default_                                                                                                                                                        | `boolean`                    | `false`      |
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

| Name                                                            | Description                                                              |
| --------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `--active-stars-color`                                          | Set the color that will have the stars.                                  |
| `--active-stars-shadow-color`                                   | Set the shadow color of actives stars.                                   |
| `--inactive-stars-color`                                        | Set the color that will have the stars when are not active _(No rated)_. |
| `--inactive-stars-hover-color`                                  | Set the color of inactive stars when the user is rating.                 |
| `--star-heigth`                                                 | Set the heigth of each star.                                             |
| `--star-separation This is for set the space between each star` |                                                                          |
| `--star-width`                                                  | Set the width of each star.                                              |

---

_Built with [StencilJS](https://stenciljs.com/)_
