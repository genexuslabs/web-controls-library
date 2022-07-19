# gx-map-icon-image-class

## Using a iconImageClass

- Include the gx-map-marker component: `<gx-map-marker></gx-map-marker>`
- Set the `icon-image-class` property to define the icon image.
- Set the name of the icon `String` define in map.scss

## Properties

| Property           | Attribute          | Description                                    | Type     | Default     |
| ------------------ | ------------------ | ---------------------------------------------- | -------- | ----------- |
| `icon-image-class` | `icon-image-class` | This attribute lets you specify the icon image | `String` | `undefined` |

Allows you to choose an image icon for the marker in the map. It will only be set after a `icon-image-class` has been selected with its corresponding image icon name created in `map.scss`.

## Example

```HTML
    <gx-map-marker coords="-34.890823, -56.120909" tooltip-caption="Ubicacion" icon-image-class="markerprueba">

    </gx-map-marker>
```

---

_Built with [StencilJS](https://stenciljs.com/)_
