# Theming helper mixins

## gx-group

### Description

Helper mixin to ease styling gx-group custom elements

### Parameters

| Name    | Description                                | Type | Default Value |
| ------- | ------------------------------------------ | ---- | ------------- |
| class   | Base class of the component                | map  |               |
| caption | Class for styling the caption of the group | map  |               |

### Source

```scss
@mixin gx-group($class, $caption) {
  & > fieldset {
    @extend #{$class} !optional;

    @if ($caption != null) {
      @extend #{$caption} !optional;
    }
  }
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

## gx-loading

### Description

Helper mixin to ease styling gx-loading custom elements

### Parameters

| Name        | Description                                                                            | Type | Default Value |
| ----------- | -------------------------------------------------------------------------------------- | ---- | ------------- |
| class       | Base class of the component                                                            | map  |               |
| animation   | Class for the animation part of the component (applies when an animation is specified) | map  |               |
| title       | Class for the title part of the component                                              | map  |               |
| description | Class for the description part of the component                                        | map  |               |

### Source

```scss
@mixin gx-loading($class, $animation, $title, $description) {
  @if ($animation != null) {
    gx-lottie,
    .gx-lottie-test {
      @extend #{$animation};
    }
  }

  .box {
    @extend #{$class} !optional;
  }

  @if ($title != null) {
    .title {
      @extend #{$title} !optional;
    }
  }

  @if ($description != null) {
    .title {
      @extend #{$description} !optional;
    }
  }
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

## gx-card

### Description

Helper mixin to ease styling gx-card custom elements

### Parameters

| Name  | Description                         | Type | Default Value |
| ----- | ----------------------------------- | ---- | ------------- |
| class | Base class of the component         | map  |               |
| bars  | Base class of bars of the component | map  |               |

### Source

```scss
@mixin gx-card($class, $bars) {
  & > .card {
    @if ($class != null) {
      @extend #{$class} !optional;
    }
    @if ($bars != null) {
      & > .card-header,
      & > .card-footer {
        @extend #{$bars} !optional;
      }
    }
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

## gx-tab-caption

### Description

Helper mixin to ease styling gx-tab-caption custom elements

### Parameters

| Name  | Description                 | Type | Default Value |
| ----- | --------------------------- | ---- | ------------- |
| class | Base class of the component | map  |               |

### Source

```scss
@mixin gx-tab-caption($class) {
  a.nav-link {
    @extend #{$class} !optional;
  }
}
```

## gx-tab

### Description

Helper mixin to ease styling gx-tab custom elements

### Parameters

| Name                   | Description                                | Type | Default Value |
| ---------------------- | ------------------------------------------ | ---- | ------------- |
| class                  | Base class of the component                | map  |               |
| selected-tab-caption   | Class for styling the selected tab caption | map  |               |
| unselected-tab-caption | Class for styling unselected tab caption   | map  |               |

### Source

```scss
@mixin gx-tab($class, $selected-tab-caption, $unselected-tab-caption) {
  @extend #{$class} !optional;

  @if ($unselected-tab-caption != null) {
    gx-tab-caption[aria-selected="false"] {
      @extend #{$unselected-tab-caption} !optional;
    }
  }
  @if ($selected-tab-caption != null) {
    gx-tab-caption[aria-selected="true"] {
      @extend #{$selected-tab-caption} !optional;
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
