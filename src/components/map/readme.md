# gx-map

An element for showing an interactive map built using [LeafletJS](https://leafletjs.com/).
You can define the center, max zoom, and initial zoom of the map setting them as attributes of the component tag.
If you do not set any attribute, the map will initialize with default values.

The coordinate system used is the [EPSG:3857](https://epsg.io/) also known as "Web Mercator" _Latitude and Longitude coords separated by a comma_ (the same coordinate system used by Google and OpenStreetMap).

Syntax: `lat, lng`

Example: `-34.87945241095968, -56.078210142066956`

## Example

```HTML
    <gx-map center="-34.87945241095968, -56.078210142066956" zoom="12">
    </gx-map>
```

> ### Example with Marker

```HTML
    <gx-map center="-34.87945241095968, -56.078210142066956" zoom="12">
      <gx-map-marker coords="-34.87945241095968, -56.078210142066956" tooltip-caption="Some title here"></gx-map-marker>
    </gx-map>
```

<!-- Auto Generated Below -->

## Properties

| Property                  | Attribute                     | Description                                                                                                                                                                                                                                                                               | Type                                    | Default                |
| ------------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- | ---------------------- |
| `center`                  | `center`                      | The coord of initial center of the map.                                                                                                                                                                                                                                                   | `string`                                | `"0, 0"`               |
| `highAccuracyLocator`     | `high-accuracy-locator`       | Enable the High Accuracy in user location. _Note: This property applies when `watchPosition = true`._                                                                                                                                                                                     | `boolean`                               | `true`                 |
| `mapProvider`             | `map-provider`                | The map provider. _Note: Currently, this property is for setting a custom map provider using an URL._                                                                                                                                                                                     | `string`                                | `undefined`            |
| `mapType`                 | `map-type`                    | Map type to be used. _Note: If you set a map provider, the selected map type will be ignored._                                                                                                                                                                                            | `"hybrid" \| "satellite" \| "standard"` | `"standard"`           |
| `maxZoom`                 | `max-zoom`                    | The max zoom level available in the map. _Note: 20 is the best value to be used, only lower values are allowed. Is highly recommended to no change this value if you are not sure about the `maxZoom` supported by the map._                                                              | `number`                                | `RECOMMENDED_MAX_ZOOM` |
| `pinImageCssClass`        | `pin-image-css-class`         | A CSS class to set as the `showMyLocation` icon class.                                                                                                                                                                                                                                    | `string`                                | `undefined`            |
| `pinImageSrcset`          | `pin-image-srcset`            | This attribute lets you specify the srcset attribute for the `showMyLocation` icon when the `pinShowMyLocationSrcset` property is not specified.                                                                                                                                          | `string`                                | `undefined`            |
| `pinShowMyLocationSrcset` | `pin-show-my-location-srcset` | This attribute lets you specify the srcset attribute for the `showMyLocation` icon. If not set the `pinImageSrcset` property will be used to specify the srcset attribute for the icon. If none of the properties are specified, a default icon will be used when `showMyLocation = true` | `string`                                | `undefined`            |
| `scrollWheelZoom`         | `scroll-wheel-zoom`           | Whether the map can be zoomed by using the mouse wheel.                                                                                                                                                                                                                                   | `boolean`                               | `true`                 |
| `selectionLayer`          | `selection-layer`             | Enables the possibility to navigate the map and select a location point using the map center.                                                                                                                                                                                             | `boolean`                               | `false`                |
| `showMyLocation`          | `show-my-location`            | Indicates if the current location of the device is displayed on the map.                                                                                                                                                                                                                  | `boolean`                               | `false`                |
| `zoom`                    | `zoom`                        | The initial zoom level in the map.                                                                                                                                                                                                                                                        | `number`                                | `1`                    |

## Events

| Event                | Description                                                                | Type               |
| -------------------- | -------------------------------------------------------------------------- | ------------------ |
| `gxMapDidLoad`       | Emmited when the map is loaded.                                            | `CustomEvent<any>` |
| `mapClick`           | Emmited when the map is clicked and return click coords.                   | `CustomEvent<any>` |
| `selectionChange`    | Emmited when the map stops from being moved, if selection layer is active. | `CustomEvent<any>` |
| `selectionInput`     | Emmited when the map is being moved, if selection layer is active.         | `CustomEvent<any>` |
| `userLocationChange` | Emmited when the user location coords change.                              | `CustomEvent<any>` |

## Dependencies

### Depends on

- [gx-map-marker](../map-marker)

### Graph

```mermaid
graph TD;
  gx-map --> gx-map-marker
  style gx-map fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
