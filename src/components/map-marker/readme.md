# gx-map-marker

This element represents a marker inside a `<gx-map>` element.
`coords` attribute must always have a value. If value is not specified, the marker will be initialized with default values and it will be drawn at `0, 0` coordinates.

## Usage Sample

```HTML
<gx-map-marker coords="-34.87845241095968, -56.07882142066956" tooltip-caption="Some title here"></gx-map-marker>
```

> ### Sample with Popup Content

```HTML
    <gx-map-marker coords="-34.87845241095968, -56.07882142066956" tooltip-caption="Some title here">
        <div>
          <h3>
            Title of popUp here
          </h3>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
          <p>
            Sequi quasi sed error maxime repellat amet laborum ipsum vel labore
            qui, veritatis voluptas deleniti, inventore similique.
          </p>
          <p>Tempora molestias minus eveniet itaque!</p>
        </div>
    </gx-map-marker>
```

<!-- Auto Generated Below -->

## Properties

| Property         | Attribute         | Description                                                                                               | Type     | Default             |
| ---------------- | ----------------- | --------------------------------------------------------------------------------------------------------- | -------- | ------------------- |
| `coords`         | `coords`          | The coordinates where the marker will appear in the map.                                                  | `string` | `"0, 0"`            |
| `iconHeight`     | `icon-height`     | The marker image height.                                                                                  | `number` | `30`                |
| `iconWidth`      | `icon-width`      | The marker image width.                                                                                   | `number` | `30`                |
| `markerClass`    | `marker-class`    | The class that the marker will have. Set the `background-image` property to use it as icon of the marker. | `string` | `"gx-default-icon"` |
| `tooltipCaption` | `tooltip-caption` | The tooltip caption of the marker.                                                                        | `string` | `undefined`         |

## Events

| Event                | Description                                           | Type               |
| -------------------- | ----------------------------------------------------- | ------------------ |
| `gxMapMarkerDeleted` | Emmits when the element is deleted from a `<gx-map>`. | `CustomEvent<any>` |
| `gxMapMarkerDidLoad` | Emmits when the element is added to a `<gx-map>`.     | `CustomEvent<any>` |
| `gxMapMarkerUpdate`  | Emmits when the element update its data.              | `CustomEvent<any>` |

---

_Built with [StencilJS](https://stenciljs.com/)_
