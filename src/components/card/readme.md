# gx-card

A content container with a header and a footer, and the ability to render
`gx-button`, `gx-textblock` or other actionable elements in specific areas of
the header or footer, according to their priority.

## Children

The different building blocks of the card can be specified using a set of
predefined slots:

| Slot                     | Details                                                                                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `header`                 | This slot will be rendered as the header of the card                                                                                                    |
| `footer`                 | This slot will be rendered as the footer of the card                                                                                                    |
| `body`                   | This slot will be rendered as the body of the card                                                                                                      |
| `normal-priority-action` | This slot will be rendered as a normal priority action of the card. Normal priority actions are rendered right aligned, in the card footer              |
| `high-priority-action`   | This slot will be rendered as a high priority action of the card. High priority actions are rendered right aligned, in the card header                  |
| `low-priority-action`    | This slot will be rendered as a low priority action of the card. Low priority actions are rendered inside a right aligned drop down, in the card header |

## Example

```html
<gx-card>
  <span slot="header">
    Sample card
  </span>
  <gx-button slot="high-priority-action">Share</gx-button>
  <gx-button slot="normal-priority-action">Save</gx-button>
  <gx-button slot="normal-priority-action">Cancel</gx-button>
  <gx-textblock slot="low-priority-action" href="#">Action</gx-textblock>
  <gx-textblock slot="low-priority-action" href="#"
    >Another action</gx-textblock
  >
  <gx-textblock slot="low-priority-action" href="#"
    >Something else here</gx-textblock
  >
  <div slot="body">
    This is the card content
  </div>
</gx-card>
```

<!-- Auto Generated Below -->

## Properties

| Property        | Attribute        | Description                                                                                                                                                                                                                                                                                                                                                                                  | Type                         | Default      |
| --------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ------------ |
| `invisibleMode` | `invisible-mode` | This attribute lets you specify how this element will behave when hidden. \| Value \| Details \| \| ------------ \| --------------------------------------------------------------------------- \| \| `keep-space` \| The element remains in the document flow, and it does occupy space. \| \| `collapse` \| The element is removed form the document flow, and it doesn't occupy space. \| | `"collapse" \| "keep-space"` | `"collapse"` |
| `showBorder`    | `show-border`    | True to show the card border. False to hide it.                                                                                                                                                                                                                                                                                                                                              | `boolean`                    | `true`       |
| `showFooter`    | `show-footer`    | True to show the card footer. False to hide it.                                                                                                                                                                                                                                                                                                                                              | `boolean`                    | `true`       |
| `showHeader`    | `show-header`    | True to show the card header. False to hide it.                                                                                                                                                                                                                                                                                                                                              | `boolean`                    | `true`       |

---

_Built with [StencilJS](https://stenciljs.com/)_
