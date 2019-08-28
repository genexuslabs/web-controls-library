# gx-video

A component to load a video.

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
| `onClick` | Emitted when the element is clicked. | `CustomEvent<any>` |

## CSS Custom Properties

| Name                   | Description                             |
| ---------------------- | --------------------------------------- |
| `--active-stars-color` | Set the color that will have the stars. |

---

_Built with [StencilJS](https://stenciljs.com/)_
