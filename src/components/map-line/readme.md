# gx-map-line

This element represents a line/polyline inside a `<gx-map>` element.
`coords` attribute must always have a value. If value is not specified, the line/polyline will be initialized with default values and its start point will be drawn at `0, 0` coordinates.

## Usage Sample

```HTML
<gx-map-line coords='[[-34.928163834493645,-56.161251068115234], [-34.86959506593882,-56.1676025390625], [-34.87311600305101,-56.20656967163086]]' ></gx-map-line>
```

## Properties

| Property | Attribute | Description                                                     | Type     | Default  |
| -------- | --------- | --------------------------------------------------------------- | -------- | -------- |
| `coords` | `coords`  | The coordinates where the line/polyline will appear in the map. | `string` | `"0, 0"` |

## Events

| Event              | Description                                           | Type               |
| ------------------ | ----------------------------------------------------- | ------------------ |
| `gxMapLineDeleted` | Emmits when the element is deleted from a `<gx-map>`. | `CustomEvent<any>` |
| `gxMapLineDidLoad` | Emmits when the element is added to a `<gx-map>`.     | `CustomEvent<any>` |

---

_Built with [StencilJS](https://stenciljs.com/)_
