# gx-map-polygon

This element represents a polygon inside a `<gx-map>` element.
`coords` attribute must always have a value. If value is not specified, the polygon will be initialized with default values and will be drawn at `0, 0` coordinates.

## Usage Sample

```HTML
<style>
    .map-polygon-class {
        opacity: 0.9;
    }

    .map-polygon-class--vars {
        --gx-fill-color: #5261ff23;
        --gx-stroke-color: #2a179a;
        --gx-line-width: 4;
        --gx-line-join: miter;
        --gx-line-cap: butt;
    }
</style>

<gx-map-polygon css-class="map-polygon-class" coords='[
    [-34.906381, -56.215217],
    [-34.903460, -56.206870],
    [-34.902809, -56.206141],
    [-34.901700, -56.202772],
    [-34.906064, -56.200948],
    [-34.908422, -56.200068],
    [-34.909637, -56.200218],
    [-34.910640, -56.200497],
    [-34.910217, -56.202815],
    [-34.910323, -56.204574],
    [-34.910692, -56.206141],
    [-34.911730, -56.209252],
    [-34.911678, -56.211119],
    [-34.911273, -56.212428],
    [-34.910147, -56.214015],
    [-34.909619, -56.214230],
    [-34.909619, -56.214230],
    [-34.906381, -56.215217]
    ]' >
</gx-map-polygon>
```

<!-- Auto Generated Below -->

## Properties

| Property   | Attribute   | Description                                               | Type     | Default     |
| ---------- | ----------- | --------------------------------------------------------- | -------- | ----------- |
| `coords`   | `coords`    | The coordinates where the polygon will appear in the map. | `string` | `"0, 0"`    |
| `cssClass` | `css-class` | A CSS class to set as the `gx-map-polygon` element class. | `string` | `undefined` |

## Events

| Event                 | Description                                            | Type                          |
| --------------------- | ------------------------------------------------------ | ----------------------------- |
| `gxMapPolygonDeleted` | Emitted when the element is deleted from a `<gx-map>`. | `CustomEvent<any>`            |
| `gxMapPolygonDidLoad` | Emitted when the element is added to a `<gx-map>`.     | `CustomEvent<GridMapElement>` |

---

_Built with [StencilJS](https://stenciljs.com/)_
