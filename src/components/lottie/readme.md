# gx-lottie

An element for displaying lottie animations

## Example

```html
<gx-lottie path="/lottie/animation.json" loop="false" auto-play="true">
</gx-lottie>
```

It also accepts setting the animation with an object, using the `animationData` property:

```html
<gx-lottie id="lottie-1" loop="false" auto-play="true">
</gx-lottie>
<script>
    document.querySelector("#lottie-1").animationData = { ... };
</script>
```

<!-- Auto Generated Below -->

## Properties

| Property        | Attribute        | Description                                                                                                                                              | Type      |
| --------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `animationData` | --               | This attribute lets you specify a Lottie animation object                                                                                                | `any`     |
| `autoPlay`      | `auto-play`      | This attribute lets you specify if the animation will start playing as soon as it is ready                                                               | `boolean` |
| `disabled`      | `disabled`       | This attribute lets you specify if the element is disabled. If disabled, it will not fire any user interaction related event (for example, click event). | `boolean` |
| `invisibleMode` | `invisible-mode` | This attribute lets you specify how this element will behave when hidden.                                                                                | Value     | Details |  | ------------ | --------------------------------------------------------------------------- |  | `keep-space` | The element remains in the document flow, and it does occupy space. |  | `collapse` | The element is removed form the document flow, and it doesn't occupy space. |  | `"collapse"`, `"keep-space"` |
| `loop`          | `loop`           | This attribute lets you specify if the animation will loop                                                                                               | `boolean` |
| `path`          | `path`           | This attribute lets you specify the relative path to the animation object. (`animationData` and `path` are mutually exclusive)                           | `string`  |

## Events

| Event           | Description                                      |
| --------------- | ------------------------------------------------ |
| `animationLoad` | Emitted when the animation is loaded in the DOM. |
| `onClick`       | Emitted when the element is clicked.             |

## Methods

| Method        | Description                                    |
| ------------- | ---------------------------------------------- |
| `pause`       | Pause the animation                            |
| `play`        | Start playing the animation                    |
| `setProgress` | Set the progress of the animation to any point |
| `stop`        | Stop the animation                             |

---

_Built with [StencilJS](https://stenciljs.com/)_
