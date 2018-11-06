# gx-map

An element for showing an interactive map build with [LeafletJS](https://leafletjs.com/).
You can define the center, max zoom, and initial zoom of the map setting them as attribute of the component tag.
If you do not set any attribute, the map will initialize with default values.

The coordinate system used is the [EPSG:3857](https://epsg.io/) also known as "Web Mercator" _Latitude and Longitude coords separated by a comma_ (the same coordinate system used by Google and OpenStreetMap).

Syntax: `lat, lng`

Example: `38.89606811858382, -77.0365619659424`

<!-- Auto Generated Below -->

## Properties

| Property  | Attribute  | Description                              | Type     |
| --------- | ---------- | ---------------------------------------- | -------- |
| `center`  | `center`   | The coord of initial center of the map.  | `string` |
| `maxZoom` | `max-zoom` | The max zoom level available in the map. | `number` |
| `zoom`    | `zoom`     | The initial zoom level in the map.       | `number` |

## Events

| Event          | Description                    |
| -------------- | ------------------------------ |
| `gxMapDidLoad` | Emmits when the map is loaded. |

---

_Built with [StencilJS](https://stenciljs.com/)_
