# gx-map-circle

This element represents a circle inside a `<gx-map>` element.
`coords` attribute must always have a value. If value is not specified, the circle will be initialized with default values and its center will be drawn at `0, 0` coordinates.

## Usage Sample

```HTML
<gx-map-circle coords='-34.928966, -56.161212' radius="3000"></gx-map-circle>
```

<!-- Auto Generated Below -->

## Properties

| Property | Attribute | Description                                                                | Type     | Default  |
| -------- | --------- | -------------------------------------------------------------------------- | -------- | -------- |
| `coords` | `coords`  | The coordinates where the circle will appear in the map.                   | `string` | `"0, 0"` |
| `radius` | `radius`  | The radius that the circle will have in the map. It's expressed in meters. | `number` | `1000`   |

## Events

| Event                | Description                                          | Type                          |
| -------------------- | ---------------------------------------------------- | ----------------------------- |
| `gxMapCircleDeleted` | Emits when the element is deleted from a `<gx-map>`. | `CustomEvent<any>`            |
| `gxMapCircleDidLoad` | Emits when the element is added to a `<gx-map>`.     | `CustomEvent<GridMapElement>` |

---

_Built with [StencilJS](https://stenciljs.com/)_
