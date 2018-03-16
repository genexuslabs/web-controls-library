# gx-password-edit

An password edit box with that optionally shows a button to reveal the password value.

## Attributes

### css-class

A CSS class to set as the inner `input` element class.

### placeholder

A hint to the user of what can be entered in the control. Same as [placeholder](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-placeholder) attribute for `input` elements.

### readonly

This attribute indicates that the user cannot modify the value of the control. Same as [readonly](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-readonly) attribute for `input` elements.

### show-reveal-button

If true, a reveal password button is shown next to the password input. Pressing the reveal button toggles the password mask, allowing the user to view the password text.

### value

The initial value of the control.

## Events

### change

The `change` event is emitted when a change to the element's value is committed by the user. Unlike the `input` event, the `change` event is not necessarily fired for each change to an element's value but when the control loses focus.

### input

The `input` event is fired synchronously when the value is changed.

## Methods

### getNativeInputId()

Returns the id of the inner `input` element (if set).
