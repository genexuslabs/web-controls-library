# gx-radio-option

Radios are generally used as a set of related options inside of a group, but they can also be used alone. Pressing on a radio will check it. They can also be checked programmatically by setting the checked property.

An `gx-radio-group` can be used to group a set of radios. When radios are inside of a [radio group](../radio-group/readme.md), only one radio in the group will be checked at any time. Pressing a radio will check it and uncheck the previously selected radio, if there is one. If a radio is not in a group with another radio, then both radios will have the ability to be checked at the same time.

Take a look at the [common attributes, events and methods](../common/readme.md).

## Attributes

### caption

Specifies the label of the checkbox.

### css-class

A CSS class to set as the inner `input` element class.

### checked

Indicates that the control is selected by default.

### name

The name of the control, which is submitted with the form data.

### value

The initial value of the control.

## Events

### change

The `change` event is emitted when a change to the element's value is committed by the user. Unlike the `input` event, the `change` event is not necessarily fired for each change to an element's value but when the control loses focus.

### gxRadioDidLoad

Emitted when the radio loads.

### gxRadioDidUnload

Emitted when the radio unloads.

### gxSelect

Emitted when the radio button is selected.
