# gx-modal

A content container for showing modal dialogs with actions for lightboxes, notifications, confirmation, etc.
The dialog appears on top of the page content.

## Children

The different building blocks of the modal dialog can be specified using a set of
predefined slots:

| Slot               | Details                                                                                                          |
| ------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `header`           | This slot will be rendered as the header of the modal dialog                                                     |
| `body`             | This slot will be rendered as the body of the modal dialog                                                       |
| `primary-action`   | This slot will be rendered as a primary action of the modal dialog (for example, a "Confirm" button).            |
| `secondary-action` | This slot will be rendered as a secondary action of the modal dialog (for example, a "Close" or "Cancel" button) |

## Example

```html
<gx-modal auto-close="true" opened="true">
  <span slot="header">
    Sample modal dialog
  </span>
  <gx-button slot="primary-action">Confirm</gx-button>
  <gx-button slot="secondary-action">Cancel</gx-button>
  <div slot="body">
    This is the modal dialog's content
  </div>
</gx-modal>
```

<!-- Auto Generated Below -->

## Properties

| Property           | Attribute            | Description                                                                                            | Type      | Default     |
| ------------------ | -------------------- | ------------------------------------------------------------------------------------------------------ | --------- | ----------- |
| `autoClose`        | `auto-close`         | This attribute lets you specify if the modal dialog is automatically closed when an action is clicked. | `boolean` | `undefined` |
| `closeButtonLabel` | `close-button-label` | This attribute lets you specify the label for the close button. Important for accessibility.           | `string`  | `undefined` |
| `id`               | `id`                 | The identifier of the control. Must be unique.                                                         | `string`  | `undefined` |
| `opened`           | `opened`             | This attribute lets you specify if the modal dialog is opened or closed.                               | `boolean` | `false`     |

## Events

| Event     | Description                           | Type                |
| --------- | ------------------------------------- | ------------------- |
| `onClose` | Fired when the modal dialog is closed | `CustomEvent<void>` |
| `onOpen`  | Fired when the modal dialog is opened | `CustomEvent<void>` |

---

_Built with [StencilJS](https://stenciljs.com/)_
