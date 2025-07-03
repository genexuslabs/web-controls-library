# gx-button

Buttons provide a clickable element, which can be used anywhere that needs simple, standard button functionality. They may display text, icons, or both. The text and images to display are it's children elements.

## Children

The button accepts a child element as the caption content when the property format is "HTML". This allows the control to know explicitly when the content is HTML in order to perform further optimizations.

## Usage

```html
<gx-button
  css-class="common-properties-button"
  caption="Some caption..."
  main-image-srcset="path_to_main_image.svg"
  disabled-image-srcset="path_to_main_image.svg"
  width="140px"
  height="70px"
>
</gx-button>

<gx-button
  css-class="common-properties-button"
  caption="Some caption..."
  main-image-src="path_to_main_image.svg"
  disabled-image-src="path_to_main_image.svg"
  image-position="below"
  width="140px"
  height="70px"
>
</gx-button>

<gx-button
  css-class="common-properties-button"
  main-image-srcset="path_to_main_image.svg"
  disabled-image-src="path_to_main_image.svg"
  disabled
  format="HTML"
  width="140px"
>
  This is <b>HTML</b> content.
</gx-button>

<gx-button css-class="common-properties-button" format="HTML">
  This is <b>HTML</b> content.
</gx-button>
```

The element will show one or the other image, depending on the value of the `disabled` attribute.
If the main image is the only image specified, it will be displayed both when the button is enabled and disabled.

<!-- Auto Generated Below -->

## Properties

| Property              | Attribute               | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Type                                                    | Default     |
| --------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------- | ----------- |
| `accessibleName`      | `accessible-name`       | Specifies a short string, typically 1 to 3 words, that authors associate with an element to provide users of assistive technologies with a label for the element.                                                                                                                                                                                                                                                                                                                                      | `string`                                                | `undefined` |
| `caption`             | `caption`               | The caption of the button                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | `string`                                                | `undefined` |
| `cssClass`            | `css-class`             | A CSS class to set as the `gx-button` element class.                                                                                                                                                                                                                                                                                                                                                                                                                                                   | `string`                                                | `undefined` |
| `disabled`            | `disabled`              | This attribute lets you specify if the element is disabled. If disabled, it will not fire any user interaction related event (for example, click event). If a disabled image has been specified, it will be shown, hiding the base image (if specified).                                                                                                                                                                                                                                               | `boolean`                                               | `false`     |
| `disabledImageSrc`    | `disabled-image-src`    | This attribute lets you specify the `src` of the disabled image.                                                                                                                                                                                                                                                                                                                                                                                                                                       | `string`                                                | `undefined` |
| `disabledImageSrcset` | `disabled-image-srcset` | This attribute lets you specify the `srcset` of the disabled image.                                                                                                                                                                                                                                                                                                                                                                                                                                    | `string`                                                | `undefined` |
| `format`              | `format`                | It specifies the format that will have the gx-button control. - If `format` = `HTML`, the button control works as an HTML div and the caption will be taken from the default slot. - If `format` = `Text`, the control will take its caption using the `caption` property.                                                                                                                                                                                                                             | `"HTML" \| "Text"`                                      | `"Text"`    |
| `height`              | `height`                | This attribute lets you specify the height.                                                                                                                                                                                                                                                                                                                                                                                                                                                            | `string`                                                | `""`        |
| `highlightable`       | `highlightable`         | True to highlight control when an action is fired.                                                                                                                                                                                                                                                                                                                                                                                                                                                     | `boolean`                                               | `true`      |
| `imagePosition`       | `image-position`        | This attribute lets you specify the relative location of the image to the text. \| Value \| Details \| \| -------- \| ------------------------------------------------------- \| \| `above` \| The image is located above the text. \| \| `before` \| The image is located before the text, in the same line. \| \| `after` \| The image is located after the text, in the same line. \| \| `below` \| The image is located below the text. \| \| `behind` \| The image is located behind the text. \| | `"above" \| "after" \| "before" \| "behind" \| "below"` | `"above"`   |
| `mainImageSrc`        | `main-image-src`        | This attribute lets you specify the `src` of the main image.                                                                                                                                                                                                                                                                                                                                                                                                                                           | `string`                                                | `undefined` |
| `mainImageSrcset`     | `main-image-srcset`     | This attribute lets you specify the `srcset` of the main image.                                                                                                                                                                                                                                                                                                                                                                                                                                        | `string`                                                | `undefined` |
| `width`               | `width`                 | This attribute lets you specify the width.                                                                                                                                                                                                                                                                                                                                                                                                                                                             | `string`                                                | `""`        |

## Events

| Event   | Description                                                                                             | Type               |
| ------- | ------------------------------------------------------------------------------------------------------- | ------------------ |
| `click` | Emitted when the element is clicked, the enter key is pressed or the space key is pressed and released. | `CustomEvent<any>` |

## Slots

| Slot | Description                                                        |
| ---- | ------------------------------------------------------------------ |
|      | The slot for the caption displayed. Only works if `format="HTML"`. |

## Shadow Parts

| Part               | Description                                                                                                                                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `"caption"`        | The caption displayed at the center of the control.                                                                                                                                                                |
| `"disabled-image"` | The image displayed in the position indicated by the `imagePosition` property. This part is only available if the disabled image src is defined and the control is disabled                                        |
| `"disabled-img"`   |                                                                                                                                                                                                                    |
| `"main-image"`     | The image displayed in the position indicated by the `imagePosition` property. This part is only available if the main image src is defined and the {control is not disabled \| the disabled image is not defined} |
| `"main-img"`       |                                                                                                                                                                                                                    |

## CSS Custom Properties

| Name                       | Description                          |
| -------------------------- | ------------------------------------ |
| `--gx-button-image-margin` | Button image margin (0px by default) |
| `--gx-button-image-size`   | Button image size (16px by default)  |

---

_Built with [StencilJS](https://stenciljs.com/)_
