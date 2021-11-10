# gx-textblock

This is a simple element that allows showing text. Optionally, a URL can be specified in the `href` attribute, to behave as an anchor.

## Children

The text caption of the textblock will be its text content. Being a child instead of an attribute allows us to set text or HTML.

## Styling with SASS

A SASS mixin called `gx-textblock` is provided in `theming/theming-mixins.scss` to ease the styling of this element. See the theming [mixins documentation](/sassdoc/theming-mixins.html.md) for more information.

<!-- Auto Generated Below -->

## Properties

| Property        | Attribute        | Description                                                                                                                                                                                                                                                                                                                                                                                  | Type                         | Default      |
| --------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ------------ |
| `disabled`      | `disabled`       | This attribute lets you specify if the element is disabled. If disabled, it will not fire any user interaction related event (for example, click event).                                                                                                                                                                                                                                     | `boolean`                    | `false`      |
| `format`        | `format`         | It specifies the format that will have the textblock control. If `format` = `HTML`, the textblock control works as an HTML div and the innerHTML will be the same as the `inner` property specifies. If `format` = `Text`, the control works as a normal textblock control and it is affected by most of the defined properties.                                                             | `"HTML" \| "Text"`           | `"Text"`     |
| `highlightable` | `highlightable`  | True to highlight control when an action is fired.                                                                                                                                                                                                                                                                                                                                           | `boolean`                    | `false`      |
| `href`          | `href`           | This attribute lets you specify an URL. If a URL is specified, the textblock acts as an anchor.                                                                                                                                                                                                                                                                                              | `""`                         | `""`         |
| `inner`         | `inner`          | Used as the innerHTML when `format` = `HTML`.                                                                                                                                                                                                                                                                                                                                                | `string`                     | `""`         |
| `invisibleMode` | `invisible-mode` | This attribute lets you specify how this element will behave when hidden. \| Value \| Details \| \| ------------ \| --------------------------------------------------------------------------- \| \| `keep-space` \| The element remains in the document flow, and it does occupy space. \| \| `collapse` \| The element is removed form the document flow, and it doesn't occupy space. \| | `"collapse" \| "keep-space"` | `"collapse"` |
| `lineClamp`     | `line-clamp`     | True to cut text when it overflows, showing an ellipsis.                                                                                                                                                                                                                                                                                                                                     | `boolean`                    | `false`      |

## Dependencies

### Used by

- [gx-grid-empty-indicator](../grid-empty-indicator)

### Graph

```mermaid
graph TD;
  gx-grid-empty-indicator --> gx-textblock
  style gx-textblock fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
