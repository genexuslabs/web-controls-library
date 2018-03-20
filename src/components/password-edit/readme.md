# gx-password-edit

An password edit box with that optionally shows a button to reveal the password value.

<!-- Auto Generated Below -->

## Properties

#### cssClass

string

A CSS class to set as the inner `input` element class.

#### disabled

boolean

This attribute lets you specify if the element is disabled.
If disabled, it will not fire any user interaction related event
(for example, click event).

#### id

string

The identifier of the control. Must be unique.

#### invisibleMode

This attribute lets you specify how this element will behave when hidden.

| Value        | Details                                                                     |
| ------------ | --------------------------------------------------------------------------- |
| `keep-space` | The element remains in the document flow, and it does occupy space.         |
| `collapse`   | The element is removed form the document flow, and it doesn't occupy space. |

#### placeholder

string

A hint to the user of what can be entered in the control. Same as [placeholder](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-placeholder)
attribute for `input` elements.

#### readonly

boolean

This attribute indicates that the user cannot modify the value of the control.
Same as [readonly](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-readonly)
attribute for `input` elements.

#### revealButtonTextOff

string

Text of the reveal button to offer hiding the password.

#### revealButtonTextOn

string

Text of the reveal button to offer revealing the password.

#### showRevealButton

boolean

If true, a reveal password button is shown next to the password input.
Pressing the reveal button toggles the password mask, allowing the user to
view the password text.

#### value

string

The initial value of the control.

## Attributes

#### css-class

string

A CSS class to set as the inner `input` element class.

#### disabled

boolean

This attribute lets you specify if the element is disabled.
If disabled, it will not fire any user interaction related event
(for example, click event).

#### id

string

The identifier of the control. Must be unique.

#### invisible-mode

This attribute lets you specify how this element will behave when hidden.

| Value        | Details                                                                     |
| ------------ | --------------------------------------------------------------------------- |
| `keep-space` | The element remains in the document flow, and it does occupy space.         |
| `collapse`   | The element is removed form the document flow, and it doesn't occupy space. |

#### placeholder

string

A hint to the user of what can be entered in the control. Same as [placeholder](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-placeholder)
attribute for `input` elements.

#### readonly

boolean

This attribute indicates that the user cannot modify the value of the control.
Same as [readonly](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-readonly)
attribute for `input` elements.

#### reveal-button-text-off

string

Text of the reveal button to offer hiding the password.

#### reveal-button-text-on

string

Text of the reveal button to offer revealing the password.

#### show-reveal-button

boolean

If true, a reveal password button is shown next to the password input.
Pressing the reveal button toggles the password mask, allowing the user to
view the password text.

#### value

string

The initial value of the control.

## Events

#### onChange

The `change` event is emitted when a change to the element's value is
committed by the user. Unlike the `input` event, the `change` event is not
necessarily fired for each change to an element's value but when the
control loses focus.

#### onInput

The `input` event is fired synchronously when the value is changed.

## Methods

#### getNativeInputId()

Returns the id of the inner `input` element (if set).

---

_Built with [StencilJS](https://stenciljs.com/)_
