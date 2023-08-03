# gx-video

A component to load a video.

## Video Support

It supports Youtube videos, URLs from other video publishers and single video files.
It does not support multiple video sources.

## Usage Sample

```HTML
<gx-video src="https://www.youtube.com/watch?v=k2jT6TlxEOM"></gx-video>
```

```HTML
<gx-video src="https://www.w3schools.com/tags/movie.mp4"></gx-video>
```

<!-- Auto Generated Below -->

## Properties

| Property         | Attribute         | Description                                                                                                                                                       | Type      | Default     |
| ---------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------- |
| `accessibleName` | `accessible-name` | Specifies a short string, typically 1 to 3 words, that authors associate with an element to provide users of assistive technologies with a label for the element. | `string`  | `undefined` |
| `disabled`       | `disabled`        | This attribute lets you specify if the element is disabled. If disabled, it will not fire any user interaction related event (for example, click event).          | `boolean` | `false`     |
| `src`            | `src`             | This attribute is for specifies the src of the video.                                                                                                             | `string`  | `undefined` |

---

_Built with [StencilJS](https://stenciljs.com/)_
