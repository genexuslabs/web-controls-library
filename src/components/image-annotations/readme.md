# gx-image-annotations



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute          | Description                                                     | Type                               | Default        |
| ----------------- | ------------------ | --------------------------------------------------------------- | ---------------------------------- | -------------- |
| `backgroundImage` | `background-image` | The source of the background image.                             | `string`                           | `undefined`    |
| `cssClass`        | `css-class`        | A CSS class to set as the `gx-image-annotations` element class. | `string`                           | `undefined`    |
| `enabled`         | `enabled`          | If the annotations are activated or not.                        | `boolean`                          | `true`         |
| `invisibleMode`   | `invisible-mode`   | How the component will hide.                                    | `"Collapse Space" \| "Keep Space"` | `"Keep Space"` |
| `traceColor`      | `trace-color`      | Drawing color.                                                  | `string`                           | `'#000000'`    |
| `traceThickness`  | `trace-thickness`  | Drawing thickness.                                              | `number`                           | `2`            |
| `visible`         | `visible`          | If the component are visible or not.                            | `boolean`                          | `true`         |


## Methods

### `cleanAll() => Promise<void>`



#### Returns

Type: `Promise<void>`



### `getLastSavedImage() => Promise<string>`



#### Returns

Type: `Promise<string>`



### `getLastSavedImageAnnotations() => Promise<string>`



#### Returns

Type: `Promise<string>`



### `goBack() => Promise<void>`



#### Returns

Type: `Promise<void>`



### `goTo() => Promise<void>`



#### Returns

Type: `Promise<void>`




## Shadow Parts

| Part       | Description |
| ---------- | ----------- |
| `"canvas"` |             |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
