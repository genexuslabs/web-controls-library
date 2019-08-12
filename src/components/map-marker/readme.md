# gx-map-marker

This element represents a marker inside a `<gx-map>` element.
`coords` attribute must always have a value. If value is not specified, the marker will be initialized with default values and it will be drawn at `0, 0` coordinates.

<!-- Auto Generated Below -->

## Properties

| Property         | Attribute         | Description                                                         | Type     | Default     |
| ---------------- | ----------------- | ------------------------------------------------------------------- | -------- | ----------- |
| `coords`         | `coords`          | The coordinates where the marker will appear in the map.            | `string` | `"0, 0"`    |
| `iconSrc`        | `icon-src`        | The URL of the marker image. _Note: The image size must be 25 x 41_ | `string` | `undefined` |
| `tooltipCaption` | `tooltip-caption` | The tooltip caption of the marker.                                  | `string` | `undefined` |

## Events

| Event                | Description                                           | Type               |
| -------------------- | ----------------------------------------------------- | ------------------ |
| `gxMapMarkerDeleted` | Emmits when the element is deleted from a `<gx-map>`. | `CustomEvent<any>` |
| `gxMapMarkerDidLoad` | Emmits when the element is added to a `<gx-map>`.     | `CustomEvent<any>` |
| `gxMapMarkerUpdate`  | Emmits when the element update its data.              | `CustomEvent<any>` |

---

_Built with [StencilJS](https://stenciljs.com/)_
