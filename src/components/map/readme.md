# gx-map

An element for showing an interactive map built using [LeafletJS](https://leafletjs.com/).
You can define the center, max zoom, and initial zoom of the map setting them as attributes of the component tag.
If you do not set any attribute, the map will initialize with default values.

The coordinate system used is the [EPSG:3857](https://epsg.io/) also known as "Web Mercator" _Latitude and Longitude coords separated by a comma_ (the same coordinate system used by Google and OpenStreetMap).

Syntax: `lat, lng`

Example: `38.89606811858382, -77.0365619659424`

## Using Sample

<!-- Auto Generated Below -->

## Properties

| Property      | Attribute      | Description                                                                                                                                                                                   | Type                                   | Default     |
| ------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ----------- |
| `center`      | `center`       | The coord of initial center of the map.                                                                                                                                                       | `string`                               | `"0, 0"`    |
| `mapProvider` | `map-provider` | The map provider. _Note: By now, this proprty is for set a custom map provider using an URL._                                                                                                 | `string`                               | `undefined` |
| `mapType`     | `map-type`     | Map type to be used instead a custom map provider. _Note: If you set a map provider, the selected map type will be ignored._                                                                  | `"hybrid" \| "satellite" \| "standar"` | `"standar"` |
| `maxZoom`     | `max-zoom`     | The max zoom level available in the map. _Note: 20 is the best value to be used. Is highly recommended to no change this value if you are not secure about the maxZoom supported by the map._ | `number`                               | `20`        |
| `zoom`        | `zoom`         | The initial zoom level in the map.                                                                                                                                                            | `number`                               | `1`         |

## Events

| Event          | Description                                             | Type               |
| -------------- | ------------------------------------------------------- | ------------------ |
| `gxMapDidLoad` | Emmits when the map is loaded.                          | `CustomEvent<any>` |
| `mapClick`     | Emmits when the map is clicked and return click coords. | `CustomEvent<any>` |

---

_Built with [StencilJS](https://stenciljs.com/)_
