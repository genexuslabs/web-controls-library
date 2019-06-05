# gx-image

This component wraps an `<img>` element, adding support for lazy loading.
A CSS animation with a spinning circle is used as a loading indicator while the image is being loaded.
The loading indicator can be disabled by setting the `--image-loading-indicator` CSS variable to `none`.

<!-- Auto Generated Below -->

## Properties

| Property           | Attribute            | Description                                                                                                                                                                                                                                                                                                                                                                                  | Type                         | Default      |
| ------------------ | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ------------ |
| `alt`              | `alt`                | This attribute lets you specify the alternative text.                                                                                                                                                                                                                                                                                                                                        | `string`                     | `""`         |
| `cssClass`         | `css-class`          | A CSS class to set as the inner element class.                                                                                                                                                                                                                                                                                                                                               | `string`                     | `undefined`  |
| `disabled`         | `disabled`           | This attribute lets you specify if the element is disabled. If disabled, it will not fire any user interaction related event (for example, click event).                                                                                                                                                                                                                                     | `boolean`                    | `false`      |
| `height`           | `height`             | This attribute lets you specify the height.                                                                                                                                                                                                                                                                                                                                                  | `string`                     | `undefined`  |
| `invisibleMode`    | `invisible-mode`     | This attribute lets you specify how this element will behave when hidden. \| Value \| Details \| \| ------------ \| --------------------------------------------------------------------------- \| \| `keep-space` \| The element remains in the document flow, and it does occupy space. \| \| `collapse` \| The element is removed form the document flow, and it doesn't occupy space. \| | `"collapse" \| "keep-space"` | `"collapse"` |
| `lazyLoad`         | `lazy-load`          | True to lazy load the image, when it enters the viewport.                                                                                                                                                                                                                                                                                                                                    | `boolean`                    | `true`       |
| `lowResolutionSrc` | `low-resolution-src` | This attribute lets you specify the low resolution image SRC.                                                                                                                                                                                                                                                                                                                                | `string`                     | `""`         |
| `src`              | `src`                | This attribute lets you specify the SRC.                                                                                                                                                                                                                                                                                                                                                     | `string`                     | `""`         |
| `width`            | `width`              | This attribute lets you specify the width.                                                                                                                                                                                                                                                                                                                                                   | `string`                     | `undefined`  |

## Events

| Event     | Description                          | Type                |
| --------- | ------------------------------------ | ------------------- |
| `onClick` | Emitted when the element is clicked. | `CustomEvent<void>` |

---

_Built with [StencilJS](https://stenciljs.com/)_
