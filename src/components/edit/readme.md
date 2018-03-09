# gx-edit

Take a look at the [common attributes, events and methods](../common/readme.md).

## Attributes

### autocapitalize

Specifies the auto-capitalization behavior. Same as [autocapitalize](https://developer.apple.com/library/content/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/Attributes.html#//apple_ref/doc/uid/TP40008058-autocapitalize) attribute for `input` elements. Only supported by Safari and Chrome.

### autocomplete

This attribute indicates whether the value of the control can be automatically completed by the browser. Same as [autocomplete](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-autocomplete) attribute for `input` elements.

### autocorrect

Used to control whether autocorrection should be enabled when the user is entering/editing the text value. Sames as [autocorrect](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-autocorrect) attribute for `input` elements.

### css-class

A CSS class to set as the inner `input` element class.

### multiline

Controls if the element accepts multiline text.

### placeholder

A hint to the user of what can be entered in the control. Same as [placeholder](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-placeholder) attribute for `input` elements.

### readonly

This attribute indicates that the user cannot modify the value of the control. Same as [readonly](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-readonly) attribute for `input` elements.

### type

The type of control to render. A subset of the types supported by the `input` element is supported:

* `"date"`
* `"datetime-local"`
* `"email"`
* `"file"`
* `"number"`
* `"password"`
* `"search"`
* `"tel"`
* `"text"`
* `"url"`

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
