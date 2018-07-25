# Theming helper mixins

## theming-background

### Access

private

### Description

Helper mixin for styling the background of an element

Accepted properties:

* `background-color`
* `background-image`

### Parameters

| Name      | Description                              | Type | Default Value |
| --------- | ---------------------------------------- | ---- | ------------- |
| component | A map containing the accepted properties | Map  |               |

### Used By

* [mixin] `gx-edit`

* [mixin] `gx-textblock`

### Source

```scss
@mixin theming-background($component) {
  background-color: map-get(($component), "background-color");
  background-image: map-get(($component), "background-image");
}
```

## theming-border

### Access

private

### Description

Helper mixin for styling the border of an element

Accepted properties:

* `border-color`
* `border-radius`
* `border-style`
* `border-width`

### Parameters

| Name      | Description | Type | Default Value |
| --------- | ----------- | ---- | ------------- |
| component | Map         |      |               |

### Used By

* [mixin] `theming-box`

### Source

```scss
@mixin theming-border($component) {
  border-color: map-get(($component), "border-color");
  border-radius: map-get(($component), "border-radius");
  border-style: map-get(($component), "border-style");
  border-width: map-get(($component), "border-width");
}
```

## theming-font

### Access

private

### Description

Helper mixin for styling the font of an element

Accepted properties:

* `font-family`
* `font-size`
* `font-style`
* `font-weight`

### Parameters

| Name      | Description | Type | Default Value |
| --------- | ----------- | ---- | ------------- |
| component | Map         |      |               |

### Used By

* [mixin] `theming-text`

### Source

```scss
@mixin theming-font($component) {
  font-family: map-get(($component), "font-family");
  font-size: map-get(($component), "font-size");
  font-style: map-get(($component), "font-style");
  font-weight: map-get(($component), "font-weight");
}
```

## theming-text

### Access

private

### Description

Helper mixin for styling the text of an element

Accepted properties:

* `color`
* `text-decoration`
* Properties accepted by `theming-font` mixin.

### Parameters

| Name      | Description | Type | Default Value |
| --------- | ----------- | ---- | ------------- |
| component | Map         |      |               |

### Requires

* [mixin] `theming-font`

### Used By

* [mixin] `gx-edit`

* [mixin] `gx-textblock`

### Source

```scss
@mixin theming-text($component) {
  color: map-get(($component), "color");
  text-decoration: map-get(($component), "text-decoration");
  @include theming-font($component);
}
```

## theming-margin

### Access

private

### Description

Helper mixin for styling the margin of an element

Accepted properties:

* `margin-top`
* `margin-right`
* `margin-bottom`
* `margin-left`

### Parameters

| Name      | Description | Type | Default Value |
| --------- | ----------- | ---- | ------------- |
| component | Map         |      |               |

### Used By

* [mixin] `theming-box`

### Source

```scss
@mixin theming-margin($component) {
  margin-top: map-get(($component), "margin-top");
  margin-right: map-get(($component), "margin-right");
  margin-bottom: map-get(($component), "margin-bottom");
  margin-left: map-get(($component), "margin-left");
}
```

## theming-padding

### Access

private

### Description

Helper mixin for styling the padding of an element

Accepted properties:

* `padding-top`
* `padding-right`
* `padding-bottom`
* `padding-left`

### Parameters

| Name      | Description | Type | Default Value |
| --------- | ----------- | ---- | ------------- |
| component | Map         |      |               |

### Used By

* [mixin] `theming-box`

### Source

```scss
@mixin theming-padding($component) {
  padding-top: map-get(($component), "padding-top");
  padding-right: map-get(($component), "padding-right");
  padding-bottom: map-get(($component), "padding-bottom");
  padding-left: map-get(($component), "padding-left");
}
```

## theming-dimensions

### Access

private

### Description

Helper mixin for styling the dimensions of an element

Accepted properties:

* `height`
* `width`

### Parameters

| Name      | Description | Type | Default Value |
| --------- | ----------- | ---- | ------------- |
| component | Map         |      |               |

### Used By

* [mixin] `theming-box`

### Source

```scss
@mixin theming-dimensions($component) {
  height: map-get(($component), "height");
  width: map-get(($component), "width");
}
```

## theming-box

### Access

private

### Description

Helper mixin for styling the box of an element

Accepted properties:

* Properties accepted by `theming-border`, `theming-margin`, `theming-padding` and `theming-dimensions` mixins.

### Parameters

| Name      | Description | Type | Default Value |
| --------- | ----------- | ---- | ------------- |
| component | Map         |      |               |

### Requires

* [mixin] `theming-border`

* [mixin] `theming-margin`

* [mixin] `theming-padding`

* [mixin] `theming-dimensions`

### Used By

* [mixin] `gx-edit`

* [mixin] `gx-textblock`

### Source

```scss
@mixin theming-box($component) {
  @include theming-border($component);
  @include theming-margin($component);
  @include theming-padding($component);
  @include theming-dimensions($component);
}
```

## gx-edit

### Description

Helper mixin to ease styling gx-edit custom elements

Accepted properties:

* `edit`
  * Properties accepted by `theming-background`, `theming-box` and `theming-text` mixins.

### Parameters

| Name | Description                                          | Type | Default Value |
| ---- | ---------------------------------------------------- | ---- | ------------- |
| edit | A map containing the properties to style the element | map  |               |

### Requires

* [mixin] `theming-background`

* [mixin] `theming-box`

* [mixin] `theming-text`

### Used By

* [mixin] `gx-form-field`

### Source

```scss
@mixin gx-edit($edit) {
  input {
    @include theming-background($edit);
    @include theming-box($edit);
    @include theming-text($edit);
  }
}
```

## gx-form-field

### Description

Helper mixin to ease styling gx-textblock custom elements
Accepted properties:

* `field`
  * `label-horizontal-alignment`
  * `label-vertical-alignment`
  * `label-width`
  * Properties accepted by `gx-edit` mixin.
* `label`
  * Properties accepted by `gx-textblock` mixin.

### Parameters

| Name  | Description                                                                        | Type | Default Value |
| ----- | ---------------------------------------------------------------------------------- | ---- | ------------- |
| field | A map containing the properties to style the field part of a gx-form-field element | map  |               |
| label | A map containing the properties to style the label part of a gx-form-field element | map  |               |

### Requires

* [mixin] `gx-textblock`

* [mixin] `gx-edit`

### Source

```scss
@mixin gx-form-field($field, $label) {
  [data-part="label"] {
    display: flex;
    @include gx-textblock($label);
    align-items: map-get($field, "label-vertical-alignment");
    justify-content: map-get($field, "label-horizontal-alignment");
    max-width: map-get($field, "label-width");
    flex-basis: map-get($field, "label-width");
  }

  [data-part="field"] {
    @include gx-edit($field);
  }
}
```

## gx-textblock

### Description

Helper mixin to ease styling gx-textblock custom elements

Accepted properties:

* Properties accepted by `theming-background`, `theming-box` and `theming-text` mixins.

### Parameters

| Name      | Description | Type | Default Value |
| --------- | ----------- | ---- | ------------- |
| textblock | map         |      |               |

### Requires

* [mixin] `theming-background`

* [mixin] `theming-box`

* [mixin] `theming-text`

### Used By

* [mixin] `gx-form-field`

### Source

```scss
@mixin gx-textblock($textblock) {
  @include theming-background($textblock);
  @include theming-box($textblock);
  @include theming-text($textblock);
}
```
