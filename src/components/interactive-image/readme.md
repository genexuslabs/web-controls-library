# gx-interactive-image

Images are very common in Smart Devices applications and the users of this apps are used to being able to manipulate them. For example zoom in/out, scroll inside the image, copy the image, etc.

## Example _(with custom style, zoom enabled, and zoom)_

```HTML
	<gx-interactive-image  src="https://www.genexus.com/media/images/genexus-share-link-image.png" style="--control-width: 90%" zoom="200" enable-zoom="true"></gx-interactive-image>
```

<!-- Auto Generated Below -->

## Properties

| Property                | Attribute                  | Description                                                                                                                       | Type      | Default     |
| ----------------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------- |
| `enableCopyToClipboard` | `enable-copy-to-clipboard` | If this property is true, the user can copy the image to the clipboard (Only for iOS, see image below).                           | `boolean` | `undefined` |
| `enableZoom`            | `enable-zoom`              | True/False. If this property is true, the user can zoom in/out on the image.                                                      | `boolean` | `false`     |
| `maxZoomRelativeTo`     | `max-zoom-relative-to`     | Indicates how much you can enlarge an image with reference to the original size of it or the size of the controller. (Percentage) | `number`  | `undefined` |
| `src`                   | `src`                      | Lets you specify the "src" of the img.                                                                                            | `""`      | `""`        |
| `zoom`                  | `zoom`                     | Indicates how much you can enlarge an image. (Percentage) _Note: 100% = Normal size_.                                             | `number`  | `100`       |

## CSS Custom Properties

| Name               | Description                                                                              |
| ------------------ | ---------------------------------------------------------------------------------------- |
| `--control-height` | Set the height or the control. _Must be set before render the control_ (auto by default) |
| `--control-width`  | Set the width or the control. _Must be set before render the control_ (100% by default)  |

---

_Built with [StencilJS](https://stenciljs.com/)_
