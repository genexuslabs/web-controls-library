# gx-lottie

An element for displaying lottie animations

## Example

```html
<gx-lottie path="/lottie/animation.json" loop="false" auto-play="true">
</gx-lottie>
```

It also accepts setting the animation with an object, using the `animationData` property:

```html
<gx-lottie id="lottie-1" loop="false" auto-play="true"> </gx-lottie>
<script>
  document.querySelector("#lottie-1").animationData = { ... };
</script>
```

<!-- Auto Generated Below -->

## Properties

| Property        | Attribute        | Description                                                                                                                                                                                                                                                                                                                                                                                  | Type                         | Default      |
| --------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ------------ |
| `animationData` | `animation-data` | This attribute lets you specify a Lottie animation object                                                                                                                                                                                                                                                                                                                                    | `any`                        | `undefined`  |
| `autoPlay`      | `auto-play`      | This attribute lets you specify if the animation will start playing as soon as it is ready                                                                                                                                                                                                                                                                                                   | `boolean`                    | `true`       |
| `disabled`      | `disabled`       | This attribute lets you specify if the element is disabled. If disabled, it will not fire any user interaction related event (for example, click event).                                                                                                                                                                                                                                     | `boolean`                    | `false`      |
| `invisibleMode` | `invisible-mode` | This attribute lets you specify how this element will behave when hidden. \| Value \| Details \| \| ------------ \| --------------------------------------------------------------------------- \| \| `keep-space` \| The element remains in the document flow, and it does occupy space. \| \| `collapse` \| The element is removed form the document flow, and it doesn't occupy space. \| | `"collapse" \| "keep-space"` | `"collapse"` |
| `loop`          | `loop`           | This attribute lets you specify if the animation will loop                                                                                                                                                                                                                                                                                                                                   | `boolean`                    | `true`       |
| `path`          | `path`           | This attribute lets you specify the relative path to the animation object. (`animationData` and `path` are mutually exclusive)                                                                                                                                                                                                                                                               | `string`                     | `undefined`  |

## Events

| Event           | Description                                      | Type                |
| --------------- | ------------------------------------------------ | ------------------- |
| `animationLoad` | Emitted when the animation is loaded in the DOM. | `CustomEvent<void>` |
| `onClick`       | Emitted when the element is clicked.             | `CustomEvent<void>` |

## Methods

### `pause() => Promise<void>`

Pause the animation

#### Returns

Type: `Promise<void>`

### `play(from?: number, to?: number) => Promise<void>`

Start playing the animation

#### Parameters

| Name   | Type     | Description |
| ------ | -------- | ----------- |
| `from` | `number` |             |
| `to`   | `number` |             |

#### Returns

Type: `Promise<void>`

### `setProgress(progress: number) => Promise<void>`

Set the progress of the animation to any point

#### Parameters

| Name       | Type     | Description                                                                               |
| ---------- | -------- | ----------------------------------------------------------------------------------------- |
| `progress` | `number` | : Value from 0 to 1 indicating the percentage of progress where the animation will start. |

#### Returns

Type: `Promise<void>`

### `stop() => Promise<void>`

Stop the animation

#### Returns

Type: `Promise<void>`

---

_Built with [StencilJS](https://stenciljs.com/)_
