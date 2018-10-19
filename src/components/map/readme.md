# gx-map

Web Component used to display a map.
You can define the center, max zoom, and initial zoom of the map setting them as attribute of the component tag.
If you do not set any attribute, the map will initialize with default values.

<!-- Auto Generated Below -->

## Properties

| Property  | Attribute  | Description                            | Type     |
| --------- | ---------- | -------------------------------------- | -------- |
| `center`  | `center`   | The initial center of the map.         | `string` |
| `maxZoom` | `max-zoom` | The max zoom scale aviable in the map. | `number` |
| `zoom`    | `zoom`     | The initial zoom scale in the map.     | `number` |

## Events

| Event          | Description                |
| -------------- | -------------------------- |
| `gxMapDidLoad` | Emmits when map is loaded. |

---

_Built with [StencilJS](https://stenciljs.com/)_
