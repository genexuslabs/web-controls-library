# gx-checkbox

Take a look at the [common attributes, events and methods](../common/readme.md).

## Attributes

### caption

Specifies the label of the checkbox.

### css-class

A CSS class to set as the inner `input` element class.

### checked

Indicates that the control is selected by default.

## Events

### change

The `change` event is emitted when a change to the element's value is committed by the user. Unlike the `input` event, the `change` event is not necessarily fired for each change to an element's value but when the control loses focus.

## Methods

### getNativeInputId()

Returns the id of the inner `input` element (if set).
