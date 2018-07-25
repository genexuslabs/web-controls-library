# gx-form-field

This control allows showing a label for a form custom control. The label's position can be controlled with the `label-position` attribute.

```html
<gx-form-field label-caption="User" label-position="top">


  <gx-edit id="edit1" value="" area="field"></gx-edit>


</gx-form-field>
```

## Children

There must be a form custom element as a child with the `area` attribute set to `"field"`.

An "edit" custom element can be on of these:

* `gx-edit`

- `gx-checkbox`

* `gx-radio-group`

- `gx-select`

* `gx-password-edit`

The child element should have and id specified, so the inner `label` element rendered uses it in its `for` attribute.

## Styling with SASS

A SASS mixin called `gx-form-field` is provided in `theming/theming-mixins.scss` to ease the styling of this element. See the theming [mixins documentation](/sassdoc/theming-mixins.html.md) for more information.

<!-- Auto Generated Below -->

## Properties

#### labelCaption

string

The text to set as the label of the field.

#### labelPosition

string

The position where the label will be located, relative to the edit control. The supported values are:

* `"top"`: The label is located above the edit control.
* `"right"`: The label is located at the right side of the edit control.
* `"bottom"`: The label is located below the edit control.
* `"left"`: The label is located at the left side of the edit control.
* `"float"`: The label is shown as a placeholder when the edit control's value is empty. When the value is not empty, the label floats and locates above the edit control.
* `"none"`: The label is rendered, but hidden.

## Attributes

#### label-caption

string

The text to set as the label of the field.

#### label-position

string

The position where the label will be located, relative to the edit control. The supported values are:

* `"top"`: The label is located above the edit control.
* `"right"`: The label is located at the right side of the edit control.
* `"bottom"`: The label is located below the edit control.
* `"left"`: The label is located at the left side of the edit control.
* `"float"`: The label is shown as a placeholder when the edit control's value is empty. When the value is not empty, the label floats and locates above the edit control.
* `"none"`: The label is rendered, but hidden.

---

_Built with [StencilJS](https://stenciljs.com/)_
