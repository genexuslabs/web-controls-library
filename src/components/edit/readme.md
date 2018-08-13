# gx-edit

An edit box with an optional trigger button.

## Children

If a child element with the attribute area="trigger-content" is found, this content will be used as the trigger content.

```html
<gx-edit value="my value" show-trigger>
  <img src="icon.png" slot="trigger-content"></img>
</gx-edit>
```

```html
<gx-edit value="my value" show-trigger>
  <i class="fa fa-search" slot="trigger-content"></i>
</gx-edit>
```

## Styling with SASS

A SASS mixin called `gx-edit` is provided in `theming/theming-mixins.scss` to ease the styling of this element. See the theming [mixins documentation](/sassdoc/theming-mixins.html.md) for more information.

<!-- Auto Generated Below -->

## Properties

#### area

string

#### autocapitalize

string

Specifies the auto-capitalization behavior. Same as [autocapitalize](https://developer.apple.com/library/content/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/Attributes.html#//apple_ref/doc/uid/TP40008058-autocapitalize)
attribute for `input` elements. Only supported by Safari and Chrome.

#### autocomplete

string

This attribute indicates whether the value of the control can be
automatically completed by the browser. Same as [autocomplete](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-autocomplete)
attribute for `input` elements.

#### autocorrect

string

Used to control whether autocorrection should be enabled when the user
is entering/editing the text value. Sames as [autocorrect](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-autocorrect)
attribute for `input` elements.

#### disabled

boolean

This attribute lets you specify if the element is disabled.
If disabled, it will not fire any user interaction related event
(for example, click event).

#### id

string

The identifier of the control. Must be unique.

#### invisibleMode

string

This attribute lets you specify how this element will behave when hidden.

| Value        | Details                                                                     |
| ------------ | --------------------------------------------------------------------------- |
| `keep-space` | The element remains in the document flow, and it does occupy space.         |
| `collapse`   | The element is removed form the document flow, and it doesn't occupy space. |

#### multiline

boolean

Controls if the element accepts multiline text.

#### placeholder

string

A hint to the user of what can be entered in the control. Same as [placeholder](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-placeholder)
attribute for `input` elements.

#### readonly

boolean

This attribute indicates that the user cannot modify the value of the control.
Same as [readonly](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-readonly)
attribute for `input` elements.

#### showTrigger

boolean

If true, a trigger button is shown next to the edit field. The button can
be customized using `trigger-text` and `trigger-class` attributes,
or adding a child element with `slot="trigger-content"` attribute to
specify the content inside the trigger button.

#### triggerText

string

The text of the trigger button. If a text is specified and an image is
specified (through an element with `slot="trigger-content"`), the content
is ignored and the text is used instead.

#### type

string

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

#### value

string

The initial value of the control.

## Attributes

#### area

string

#### autocapitalize

string

Specifies the auto-capitalization behavior. Same as [autocapitalize](https://developer.apple.com/library/content/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/Attributes.html#//apple_ref/doc/uid/TP40008058-autocapitalize)
attribute for `input` elements. Only supported by Safari and Chrome.

#### autocomplete

string

This attribute indicates whether the value of the control can be
automatically completed by the browser. Same as [autocomplete](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-autocomplete)
attribute for `input` elements.

#### autocorrect

string

Used to control whether autocorrection should be enabled when the user
is entering/editing the text value. Sames as [autocorrect](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-autocorrect)
attribute for `input` elements.

#### disabled

boolean

This attribute lets you specify if the element is disabled.
If disabled, it will not fire any user interaction related event
(for example, click event).

#### id

string

The identifier of the control. Must be unique.

#### invisible-mode

string

This attribute lets you specify how this element will behave when hidden.

| Value        | Details                                                                     |
| ------------ | --------------------------------------------------------------------------- |
| `keep-space` | The element remains in the document flow, and it does occupy space.         |
| `collapse`   | The element is removed form the document flow, and it doesn't occupy space. |

#### multiline

boolean

Controls if the element accepts multiline text.

#### placeholder

string

A hint to the user of what can be entered in the control. Same as [placeholder](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-placeholder)
attribute for `input` elements.

#### readonly

boolean

This attribute indicates that the user cannot modify the value of the control.
Same as [readonly](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-readonly)
attribute for `input` elements.

#### show-trigger

boolean

If true, a trigger button is shown next to the edit field. The button can
be customized using `trigger-text` and `trigger-class` attributes,
or adding a child element with `slot="trigger-content"` attribute to
specify the content inside the trigger button.

#### trigger-text

string

The text of the trigger button. If a text is specified and an image is
specified (through an element with `slot="trigger-content"`), the content
is ignored and the text is used instead.

#### type

string

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

#### value

string

The initial value of the control.

## Events

#### gxTriggerClick

The `gxTriggerClick` event is fired when the trigger button is clicked.

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
