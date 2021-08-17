# gx-video

A component to load a video.

## Video Support

At the moment it only supports Youtube videos. Future updates will support videos URLs from other video publishers and single video files.

## Usage Sample

```HTML
<gx-video src="https://www.youtube.com/watch?v=k2jT6TlxEOM" style="--gx-video-height: 50vh;"></gx-video>
```

<!-- Auto Generated Below -->

## Properties

| Property        | Attribute        | Description                                                                                                                                                                                                                                                                                                                                                                                  | Type                         | Default      |
| --------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ------------ |
| `disabled`      | `disabled`       | This attribute lets you specify if the element is disabled. If disabled, it will not fire any user interaction related event (for example, click event).                                                                                                                                                                                                                                     | `boolean`                    | `false`      |
| `invisibleMode` | `invisible-mode` | This attribute lets you specify how this element will behave when hidden. \| Value \| Details \| \| ------------ \| --------------------------------------------------------------------------- \| \| `keep-space` \| The element remains in the document flow, and it does occupy space. \| \| `collapse` \| The element is removed form the document flow, and it doesn't occupy space. \| | `"collapse" \| "keep-space"` | `"collapse"` |
| `src`           | `src`            | This attribute is for specifies the src of the video.                                                                                                                                                                                                                                                                                                                                        | `string`                     | `undefined`  |

## Events

| Event     | Description                          | Type               |
| --------- | ------------------------------------ | ------------------ |
| `gxClick` | Emitted when the element is clicked. | `CustomEvent<any>` |

## CSS Custom Properties

| Name                | Description                                                                                     |
| ------------------- | ----------------------------------------------------------------------------------------------- |
| `--gx-video-height` | Set the height of the control from the video container or the control itself. (100% by default) |
| `--gx-video-width`  | Set the width of the control from the video container or the control itself. (100% by default)  |

---

_Built with [StencilJS](https://stenciljs.com/)_
