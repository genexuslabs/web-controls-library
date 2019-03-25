# gx-map

An element for showing an interactive map built using [LeafletJS](https://leafletjs.com/).
You can define the center, max zoom, and initial zoom of the map setting them as attributes of the component tag.
If you do not set any attribute, the map will initialize with default values.

The coordinate system used is the [EPSG:3857](https://epsg.io/) also known as "Web Mercator" _Latitude and Longitude coords separated by a comma_ (the same coordinate system used by Google and OpenStreetMap).

Syntax: `lat, lng`

Example: `38.89606811858382, -77.0365619659424`

<!-- Auto Generated Below -->

## Properties

| Property  | Attribute  | Description                              | Type     | Default  |
| --------- | ---------- | ---------------------------------------- | -------- | -------- |
| `center`  | `center`   | The coord of initial center of the map.  | `string` | `"0, 0"` |
| `maxZoom` | `max-zoom` | The max zoom level available in the map. | `number` | `20`     |
| `zoom`    | `zoom`     | The initial zoom level in the map.       | `number` | `1`      |

## Events

| Event          | Description                    | Type                |
| -------------- | ------------------------------ | ------------------- |
| `gxMapDidLoad` | Emmits when the map is loaded. | `CustomEvent<void>` |

---

_Built with [StencilJS](https://stenciljs.com/)_
