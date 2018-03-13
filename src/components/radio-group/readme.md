# gx-radio-group

A radio group is a group of radio buttons (`gx-radio-option`). It allows a user to select at most one radio button from a set. Checking one radio button that belongs to a radio group unchecks any previous checked radio button within the same group.
Take a look at the [common attributes, events and methods](../common/readme.md).

## Children

There must be at least a `gx-radio-option` custom element as a child. Each radio option must have a different value set.
The one option whose value matches the value of the group will be automatically marked as selected.

## Attributes

### direction

Specifies how the child `gx-radio-option` will be layed out. It supports two values:

* `horizontal`
* `vertical` (default)

### name

The name of the control, which is submitted with the form data.

### value

The initial value of the control.

## Events

### change

The `change` event is emitted when a change to the element's value is committed by the user.
