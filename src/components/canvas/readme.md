# gx-canvas

A container for creating absolute positioned layouts.

<!-- Auto Generated Below -->

## Properties

| Property           | Attribute            | Description                                                                                                                                                       | Type                                                                                        | Default     |
| ------------------ | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ----------- |
| `accessibleName`   | `accessible-name`    | Specifies a short string, typically 1 to 3 words, that authors associate with an element to provide users of assistive technologies with a label for the element. | `string`                                                                                    | `undefined` |
| `accessibleNameBy` | `accessible-name-by` | Specifies the accessible name property value by providing the ID of the HTMLElement that has the accessible name text.                                            | `string`                                                                                    | `undefined` |
| `accessibleRole`   | `accessible-role`    | Specifies the semantics of the control. Specifying the Role allows assistive technologies to give information about how to use the control to the user.           | `"article" \| "banner" \| "complementary" \| "contentinfo" \| "list" \| "main" \| "region"` | `undefined` |
| `cssClass`         | `css-class`          | A CSS class to set as the `gx-canvas` element class.                                                                                                              | `string`                                                                                    | `undefined` |
| `disabled`         | `disabled`           | This attribute lets you specify if the element is disabled. If disabled, it will not fire any user interaction related event (for example, click event).          | `boolean`                                                                                   | `false`     |
| `highlightable`    | `highlightable`      | True to highlight control when an action is fired.                                                                                                                | `boolean`                                                                                   | `false`     |
| `layoutIsReady`    | `layout-is-ready`    | This attribute defines when the layout has been fully loaded. Useful for determining if the canvas control can set the auto-grow mechanism                        | `boolean`                                                                                   | `false`     |
| `minHeight`        | `min-height`         | This attribute defines the minimum height of the cell when its contents are visible.                                                                              | `string`                                                                                    | `null`      |
| `width`            | `width`              | This attribute lets you specify the width of the control.                                                                                                         | `string`                                                                                    | `undefined` |

## Events

| Event        | Description                                             | Type               |
| ------------ | ------------------------------------------------------- | ------------------ |
| `gxClick`    | Emitted when the element is clicked.                    | `CustomEvent<any>` |
| `swipe`      | Emitted when the element is swiped.                     | `CustomEvent<any>` |
| `swipeDown`  | Emitted when the element is swiped downward direction.  | `CustomEvent<any>` |
| `swipeLeft`  | Emitted when the element is swiped left direction.      | `CustomEvent<any>` |
| `swipeRight` | Emitted when the element is swiped right direction.     | `CustomEvent<any>` |
| `swipeUp`    | Emitted when the element is swiped in upward direction. | `CustomEvent<any>` |

## CSS Custom Properties

| Name                  | Description                                                                                                                                                    |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--gx-overflow-style` | Determine if the overflow will be hidden or visible. By default, the gx-canvas hide its content overflow to ensure that the border-radius property is applied. |

---

_Built with [StencilJS](https://stenciljs.com/)_
