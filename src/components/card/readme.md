# gx-card

A content container with the ability to render a header.

## Example

```html
<style>
  .ApplicationBarFancyClass {
    background-color: #8082b3;
    color: #ffffff;
    font-size: 18px;
    font-weight: 500;

    /* 
    @include gx-navbar(
      $default-button: ".DefaultButton",
      $back-button: ".BackButton"
    );
    */
  }
</style>

<gx-card>
  <gx-card-header slot="header" css-class="ApplicationBarFancyClass">
    <li slot="high-priority-action">
      <gx-button>Share</gx-button>
    </li>

    <li slot="normal-priority-action">
      <gx-button>Save</gx-button>
    </li>

    <li slot="normal-priority-action">
      <gx-button>Cancel</gx-button>
    </li>

    <li slot="low-priority-action">
      <gx-textblock href="#">Action</gx-textblock>
    </li>

    <li slot="low-priority-action">
      <gx-textblock href="#">
        Another action
      </gx-textblock>
    </li>

    <li slot="low-priority-action">
      <gx-textblock href="#">
        Something else here
      </gx-textblock>
    </li>
  </gx-card-header>

  <div slot="body">
    This is the card content
  </div>

  <gx-action-sheet close-button-label="GXM_cancel">
    <gx-action-sheet-item>Action A</gx-action-sheet-item>
    <gx-action-sheet-item disabled>Action B</gx-action-sheet-item>
  </gx-action-sheet>

  <gx-action-sheet close-button-label="GXM_cancel">
    <gx-action-sheet-item>Action 1</gx-action-sheet-item>
    <gx-action-sheet-item>Action 2</gx-action-sheet-item>
  </gx-action-sheet>
</gx-card>
```

<!-- Auto Generated Below -->

## Properties

| Property     | Attribute     | Description                                     | Type      | Default |
| ------------ | ------------- | ----------------------------------------------- | --------- | ------- |
| `showHeader` | `show-header` | True to show the card header. False to hide it. | `boolean` | `true`  |

## Slots

| Slot       | Description                                                                                                                 |
| ---------- | --------------------------------------------------------------------------------------------------------------------------- |
|            | The default slot will also be rendered as the body of the card. Typically, this slot will contain gx-action-sheet controls. |
| `"body"`   | This slot will be rendered as the body of the card.                                                                         |
| `"header"` | This slot will be rendered as the header of the card.                                                                       |

---

_Built with [StencilJS](https://stenciljs.com/)_
