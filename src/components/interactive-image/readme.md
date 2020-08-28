# gx-interactive-image

Images are very common in Smart Devices applications and the users of this apps are used to being able to manipulate them. For example zoom in/out, scroll inside the image, copy the image, etc.

## Example _(with custom style, zoom enabled, and zoom)_

```HTML
	<gx-interactive-image  src="https://www.genexus.com/media/images/genexus-share-link-image.png" style="--control-width: 90%" zoom="200" enable-zoom="true"></gx-interactive-image>
```

<!-- Auto Generated Below -->

## Properties

| Property     | Attribute     | Description                                                                           | Type      | Default |
| ------------ | ------------- | ------------------------------------------------------------------------------------- | --------- | ------- |
| `enableZoom` | `enable-zoom` | True/False. If this property is true, the user can zoom in/out on the image.          | `boolean` | `false` |
| `src`        | `src`         | Lets you specify the image URL. _Requiered_                                           | `""`      | `""`    |
| `zoom`       | `zoom`        | Indicates how much you can enlarge an image. (Percentage) _Note: 100% = Normal size_. | `number`  | `100`   |

---

_Built with [StencilJS](https://stenciljs.com/)_
