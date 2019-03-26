# gx-button

Buttons provide a clickable element, which can be used anywhere that needs simple, standard button functionality. They may display text, icons, or both. The text and images to display are it's children elements.

## Children

The text caption of the button will be its text content. Being a child instead of an attribute allows us to set text or HTML.

### Child images

`gx-button` accepts two child `<img>` elements that work as the main image and the disbled image.

To tag an image as the main one, use the `slot` attribute with value "main-image". For example:

`<img href="..." slot="main-image" />`

To tag an image as the disabled one, use the slot attribute with value "disabled-image". For example:

`<img href="..." slot="disabled-image" />`

The element will show one or the other, depending on the value of the [disabled](../common/readme.md#disabled) attribute.

<!-- Auto Generated Below -->

## Properties

| Property        | Attribute        | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Type                                                    | Default      |
| --------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------- | ------------ |
| `cssClass`      | `css-class`      | A CSS class to set as the inner `input` element class.                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `string`                                                | `undefined`  |
| `disabled`      | `disabled`       | This attribute lets you specify if the element is disabled. If disabled, it will not fire any user interaction related event (for example, click event). If a disabled image has been specified, it will be shown, hiding the base image (if specified).                                                                                                                                                                                                                                               | `boolean`                                               | `false`      |
| `imagePosition` | `image-position` | This attribute lets you specify the relative location of the image to the text. \| Value \| Details \| \| -------- \| ------------------------------------------------------- \| \| `above` \| The image is located above the text. \| \| `before` \| The image is located before the text, in the same line. \| \| `after` \| The image is located after the text, in the same line. \| \| `below` \| The image is located below the text. \| \| `behind` \| The image is located behind the text. \| | `"above" \| "after" \| "before" \| "behind" \| "below"` | `"above"`    |
| `invisibleMode` | `invisible-mode` | This attribute lets you specify how this element will behave when hidden. \| Value \| Details \| \| ------------ \| --------------------------------------------------------------------------- \| \| `keep-space` \| The element remains in the document flow, and it does occupy space. \| \| `collapse` \| The element is removed form the document flow, and it doesn't occupy space. \|                                                                                                           | `"collapse" \| "keep-space"`                            | `"collapse"` |
| `size`          | `size`           | This attribute lets you specify the size of the button. \| Value \| Details \| \| -------- \| ------------------------------------------------------- \| \| `large` \| Large sized button. \| \| `normal` \| Standard sized button. \| \| `small` \| Small sized button. \|                                                                                                                                                                                                                            | `"large" \| "normal" \| "small"`                        | `"normal"`   |

## Events

| Event     | Description                          | Type                |
| --------- | ------------------------------------ | ------------------- |
| `onClick` | Emitted when the element is clicked. | `CustomEvent<void>` |

---

_Built with [StencilJS](https://stenciljs.com/)_
