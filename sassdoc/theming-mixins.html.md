# Theming helper mixins

## gx-table

### Description

Helper mixin to ease styling gx-table custom elements

### Parameters

| Name            | Description                                                | Type | Default Value |
| --------------- | ---------------------------------------------------------- | ---- | ------------- |
| class           | Base class of the component                                | map  |               |
| horizontal-line | Class of the horizontal line separator (to be implemented) | map  |               |

### Source

```scss
@mixin gx-table($class, $horizontal-line) {
  @extend #{$class} !optional;
}
```

## gx-image

### Description

Helper mixin to ease styling gx-image custom elements

### Parameters

| Name  | Description                 | Type | Default Value |
| ----- | --------------------------- | ---- | ------------- |
| class | Base class of the component | map  |               |

### Source

```scss
@mixin gx-image($class) {
  img {
    @extend #{$class} !optional;
  }
  @include dragging-behavior(
    $accept-drag-class,
    $no-accept-drag-class,
    $start-dragging-class,
    $drag-over-class
  );
}
```

## gx-button

### Description

Helper mixin to ease styling gx-button custom elements

### Parameters

| Name  | Description                 | Type | Default Value |
| ----- | --------------------------- | ---- | ------------- |
| class | Base class of the component | map  |               |

### Source

```scss
@mixin gx-button($class) {
  button {
    @extend #{$class} !optional;
  }
}
```

## gx-edit

### Description

Helper mixin to ease styling gx-edit custom elements

### Parameters

| Name  | Description                 | Type | Default Value |
| ----- | --------------------------- | ---- | ------------- |
| class | Base class of the component | map  |               |

### Source

```scss
@mixin gx-edit($class) {
  input,
  textarea {
    @extend #{$class} !optional;
  }
}
```

## gx-form-field

### Description

Helper mixin to ease styling gx-form-field custom elements

### Parameters

| Name                 | Description                                                                             | Type | Default Value |
| -------------------- | --------------------------------------------------------------------------------------- | ---- | ------------- |
| class                | Base class of the field inside the component                                            | map  |               |
| label                | Base class of the label of the component                                                | map  |               |
| highlighted          | Class to be used when the component is in active state                                  | map  |               |
| accept-drag-class    | Class to be used when the component shows that it accepts a drop operation              | map  |               |
| no-accept-drag-class | Class to be used when the component shows that it doesn&#39;t accept a drop operation   | map  |               |
| start-dragging-class | Class to be used when the component starts being dragged                                | map  |               |
| drag-over-class      | Class to be used when the component is hovered by other control during a drag operation | map  |               |

### Source

```scss
@mixin gx-form-field(
  $class,
  $label,
  $highlighted,
  $accept-drag-class,
  $no-accept-drag-class,
  $start-dragging-class,
  $drag-over-class
) {
  @include dragging-behavior(
    $accept-drag-class,
    $no-accept-drag-class,
    $start-dragging-class,
    $drag-over-class
  );
  [data-part="field"] {
    @extend #{$class} !optional;
  }
  @if ($label != null) {
    [data-part="label"] {
      @extend #{$label} !optional;
    }
  }
  @if $highlighted != null {
    &:active {
      @extend #{$highlighted} !optional;
    }
  }
}
```

## gx-table

### Description

Helper mixin to ease styling gx-table custom elements

### Parameters

| Name            | Description                                                | Type | Default Value |
| --------------- | ---------------------------------------------------------- | ---- | ------------- |
| class           | Base class of the component                                | map  |               |
| horizontal-line | Class of the horizontal line separator (to be implemented) | map  |               |

### Source

```scss
@mixin gx-table($class, $horizontal-line) {
  @extend #{$class} !optional;
}
```

## gx-textblock

### Description

Helper mixin to ease styling gx-textblock custom elements

### Parameters

| Name                 | Description                                                                             | Type | Default Value |
| -------------------- | --------------------------------------------------------------------------------------- | ---- | ------------- |
| class                | Base class of the component                                                             | map  |               |
| accept-drag-class    | Class to be used when the component shows that it accepts a drop operation              | map  |               |
| no-accept-drag-class | Class to be used when the component shows that it doesn&#39;t accept a drop operation   | map  |               |
| start-dragging-class | Class to be used when the component starts being dragged                                | map  |               |
| drag-over-class      | Class to be used when the component is hovered by other control during a drag operation | map  |               |

### Source

```scss
@mixin gx-textblock(
  $class,
  $accept-drag-class,
  $no-accept-drag-class,
  $start-dragging-class,
  $drag-over-class
) {
  @include dragging-behavior(
    $accept-drag-class,
    $no-accept-drag-class,
    $start-dragging-class,
    $drag-over-class
  );
  .content,
  .label-content {
    @extend #{$class} !optional;
  }
}
```
