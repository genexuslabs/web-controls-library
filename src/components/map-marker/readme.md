# gx-map-marker

This web component must be included inner _GX Map_ Component (inner `<gx-map>`).
`coords` attribute must always be included in the the tag. If you do not set any attribute, the marker will initialize with default values and it will be draw in `0, 0` position of the map.

<!-- Auto Generated Below -->

## Properties

| Property         | Attribute         | Description                                              | Type     |
| ---------------- | ----------------- | -------------------------------------------------------- | -------- |
| `coords`         | `coords`          | The coordinates where the marker will appear in the map. | `string` |
| `iconAnchor`     | `icon-anchor`     | The position where the marker will be centered.          | `string` |
| `iconSize`       | `icon-size`       | The size that the marker img will have.                  | `string` |
| `iconSrc`        | `icon-src`        | The src of marker img. It can be an URL or a file path.  | `string` |
| `tooltipAnchor`  | `tooltip-anchor`  | The position in the marker where tooltip will appear.    | `string` |
| `tooltipCaption` | `tooltip-caption` | The tooltip caption of the marker.                       | `string` |

## Events

| Event                | Description                                                   |
| -------------------- | ------------------------------------------------------------- |
| `gxMapMarkerDeleted` | Emmits when gx-map-marker is deleted from gx-map.             |
| `gxMapMarkerDidLoad` | Emmits when gx-map-marker is added inner gx-map and it loads. |

---

_Built with [StencilJS](https://stenciljs.com/)_
