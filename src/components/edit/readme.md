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

| Property         | Attribute        | Description                                                                                                                                                                                                                                                                                                                                                                                  | Type                                                                                                                | Default      |
| ---------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------ |
| `area`           | `area`           |                                                                                                                                                                                                                                                                                                                                                                                              | `string`                                                                                                            | `undefined`  |
| `autocapitalize` | `autocapitalize` | Specifies the auto-capitalization behavior. Same as [autocapitalize](https://developer.apple.com/library/content/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/Attributes.html#//apple_ref/doc/uid/TP40008058-autocapitalize) attribute for `input` elements. Only supported by Safari and Chrome.                                                                        | `string`                                                                                                            | `undefined`  |
| `autocomplete`   | `autocomplete`   | This attribute indicates whether the value of the control can be automatically completed by the browser. Same as [autocomplete](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-autocomplete) attribute for `input` elements.                                                                                                                                           | `"off" \| "on"`                                                                                                     | `undefined`  |
| `autocorrect`    | `autocorrect`    | Used to control whether autocorrection should be enabled when the user is entering/editing the text value. Sames as [autocorrect](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-autocorrect) attribute for `input` elements.                                                                                                                                          | `string`                                                                                                            | `undefined`  |
| `disabled`       | `disabled`       | This attribute lets you specify if the element is disabled. If disabled, it will not fire any user interaction related event (for example, click event).                                                                                                                                                                                                                                     | `boolean`                                                                                                           | `false`      |
| `fontCategory`   | `font-category`  | Used to define the semantic of the element when readonly=true. Font categories are mapped to semantic HTML elements when rendered: _ `"headline"`: `h1` _ `"subheadline"`: `h2` _ `"body"`: `p` _ `"footnote"`: `footer` _ `"caption1"`: `span` _ `"caption2"`: `span`                                                                                                                       | `"body" \| "caption1" \| "caption2" \| "footnote" \| "headline" \| "subheadline"`                                   | `"body"`     |
| `id`             | `id`             | The identifier of the control. Must be unique.                                                                                                                                                                                                                                                                                                                                               | `string`                                                                                                            | `undefined`  |
| `invisibleMode`  | `invisible-mode` | This attribute lets you specify how this element will behave when hidden. \| Value \| Details \| \| ------------ \| --------------------------------------------------------------------------- \| \| `keep-space` \| The element remains in the document flow, and it does occupy space. \| \| `collapse` \| The element is removed form the document flow, and it doesn't occupy space. \| | `"collapse" \| "keep-space"`                                                                                        | `"collapse"` |
| `multiline`      | `multiline`      | Controls if the element accepts multiline text.                                                                                                                                                                                                                                                                                                                                              | `boolean`                                                                                                           | `undefined`  |
| `placeholder`    | `placeholder`    | A hint to the user of what can be entered in the control. Same as [placeholder](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-placeholder) attribute for `input` elements.                                                                                                                                                                                            | `string`                                                                                                            | `undefined`  |
| `readonly`       | `readonly`       | This attribute indicates that the user cannot modify the value of the control. Same as [readonly](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-readonly) attribute for `input` elements.                                                                                                                                                                             | `boolean`                                                                                                           | `undefined`  |
| `showTrigger`    | `show-trigger`   | If true, a trigger button is shown next to the edit field. The button can be customized using `trigger-text` and `trigger-class` attributes, or adding a child element with `slot="trigger-content"` attribute to specify the content inside the trigger button.                                                                                                                             | `boolean`                                                                                                           | `undefined`  |
| `triggerText`    | `trigger-text`   | The text of the trigger button. If a text is specified and an image is specified (through an element with `slot="trigger-content"`), the content is ignored and the text is used instead.                                                                                                                                                                                                    | `string`                                                                                                            | `undefined`  |
| `type`           | `type`           | The type of control to render. A subset of the types supported by the `input` element is supported: _ `"date"` _ `"datetime-local"` _ `"email"` _ `"file"` _ `"number"` _ `"password"` _ `"search"` _ `"tel"` _ `"text"` _ `"url"`                                                                                                                                                           | `"date" \| "datetime-local" \| "email" \| "file" \| "number" \| "password" \| "search" \| "tel" \| "text" \| "url"` | `"text"`     |
| `value`          | `value`          | The initial value of the control.                                                                                                                                                                                                                                                                                                                                                            | `string`                                                                                                            | `undefined`  |

## Events

| Event            | Description                                                                                                                                                                                                                                | Type               |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------ |
| `change`         | The `change` event is emitted when a change to the element's value is committed by the user. Unlike the `input` event, the `change` event is not necessarily fired for each change to an element's value but when the control loses focus. | `CustomEvent<any>` |
| `gxTriggerClick` | The `gxTriggerClick` event is fired when the trigger button is clicked.                                                                                                                                                                    | `CustomEvent<any>` |
| `input`          | The `input` event is fired synchronously when the value is changed.                                                                                                                                                                        | `CustomEvent<any>` |

## Methods

### `getNativeInputId() => Promise<string>`

Returns the id of the inner `input` element (if set).

#### Returns

Type: `Promise<string>`

---

_Built with [StencilJS](https://stenciljs.com/)_
