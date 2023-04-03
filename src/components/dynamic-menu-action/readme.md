# dynamic-menu-action

Action of the menu

<!-- Auto Generated Below -->

## Properties

| Property       | Attribute       | Description                                                                                                      | Type      | Default     |
| -------------- | --------------- | ---------------------------------------------------------------------------------------------------------------- | --------- | ----------- |
| `actionId`     | `action-id`     | This attribute specifies the id of the dynamic-menu-action for manage from outside, will be an unique attribute. | `string`  | `undefined` |
| `activeClass`  | `active-class`  | A CSS class to set as the `dynamic-menu-action` element class when `inactivated = false`.                        | `string`  | `undefined` |
| `cssClass`     | `css-class`     | A CSS class to set as the `dynamic-menu-action` element class.                                                   | `string`  | `undefined` |
| `deactivated`  | `deactivated`   | This attribute lets you specify if the menu action is activated or not.                                          | `boolean` | `true`      |
| `itemSubtitle` | `item-subtitle` | The subtitle of menu action.                                                                                     | `string`  | `undefined` |
| `itemTitle`    | `item-title`    | The title of menu action.                                                                                        | `string`  | `undefined` |
| `popupId`      | `popup-id`      | This attribute specifies which popup of the dynamic-menu must be open.                                           | `string`  | `undefined` |

## Events

| Event                 | Description                                                 | Type                                 |
| --------------------- | ----------------------------------------------------------- | ------------------------------------ |
| `menuActionActivated` | Fired when the menu action is activated.                    | `CustomEvent<MenuActionActiveEvent>` |
| `menuActionKeyDown`   | Fired when a KeyboardEvent is captured for the menu action. | `CustomEvent<KeyboardEvent>`         |

## Slots

| Slot      | Description                                                                               |
| --------- | ----------------------------------------------------------------------------------------- |
| `"data"`  | The slot where you can put the main data of the action.                                   |
| `"right"` | The slot where you can put additional components aligned to the right of the menu action. |

## Shadow Parts

| Part           | Description                                                        |
| -------------- | ------------------------------------------------------------------ |
| `"item-right"` | The right part of menu action, where you can put other components. |
| `"subtitle"`   | The subtitle of menu action.                                       |
| `"title"`      | The title of menu action.                                          |

---

_Built with [StencilJS](https://stenciljs.com/)_
