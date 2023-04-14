# GX Image Annotations

This component allows you to draw traces on the space in which the control is placed, where the traces can have different colors and thicknesses. Also, the component accepts the option to use an image as a background to draw the traces.

### Example

```html
<gx-image-annotations
  trace-color="#000000"
  css-class="gx-image-annotations"
  value="image-path.jpg"
>
</gx-image-annotations>
```

```js
<script type="text/javascript">
  let traceIndex = -1;
  window.addEventListener('load', () => {
    let gxImageAnn = document.querySelector("gx-image-annotations");
    gxImageAnn.addEventListener('annotationsChange', (ev) => {
      document.getElementById("preview").src = ev.detail.annotatedImage;
    });
    gxImageAnn.addEventListener('traceIndexChange', (ev) => {
      traceIndex = ev.detail;
      gxImageAnn.setAttribute("trace-index", traceIndex);
    });
  }, false);

  function changeColor(color){
    let gxImageAnn = document.querySelector("gx-image-annotations");
    gxImageAnn.setAttribute("trace-color", color);
  }
  function cleanAll(){
    traceIndex = -3;
    ChangeTraceIndex();
  }
  function goBack(){
      traceIndex--;
      ChangeTraceIndex();
  }
  function goTo(){
    traceIndex++;
    ChangeTraceIndex();
  }
  function ChangeTraceIndex(){
    let gxImageAnn = document.querySelector("gx-image-annotations");
    gxImageAnn.setAttribute("trace-index", traceIndex);
  }
  function loadImage(imgsrc){
    let gxImageAnn = document.querySelector("gx-image-annotations");
    gxImageAnn.setAttribute("value", imgsrc);
  }
</script>
```

<!-- Auto Generated Below -->

## Properties

| Property          | Attribute          | Description                                                     | Type                               | Default        |
| ----------------- | ------------------ | --------------------------------------------------------------- | ---------------------------------- | -------------- |
| `backgroundImage` | `background-image` | The source of the background image.                             | `string`                           | `undefined`    |
| `cssClass`        | `css-class`        | A CSS class to set as the `gx-image-annotations` element class. | `string`                           | `undefined`    |
| `enabled`         | `enabled`          | If the annotations are activated or not.                        | `boolean`                          | `true`         |
| `invisibleMode`   | `invisible-mode`   | How the component will hide.                                    | `"Collapse Space" \| "Keep Space"` | `"Keep Space"` |
| `traceColor`      | `trace-color`      | Drawing color.                                                  | `string`                           | `"#000000"`    |
| `traceThickness`  | `trace-thickness`  | Drawing thickness.                                              | `number`                           | `2`            |
| `visible`         | `visible`          | If the component are visible or not.                            | `boolean`                          | `true`         |

## Methods

### `cleanAll() => Promise<void>`

#### Returns

Type: `Promise<void>`

### `getLastSavedImage() => Promise<string>`

#### Returns

Type: `Promise<string>`

### `getLastSavedImageAnnotations() => Promise<string>`

#### Returns

Type: `Promise<string>`

### `goBack() => Promise<void>`

#### Returns

Type: `Promise<void>`

### `goTo() => Promise<void>`

#### Returns

Type: `Promise<void>`

## Shadow Parts

| Part       | Description                               |
| ---------- | ----------------------------------------- |
| `"canvas"` | The canvas where to make the annotations. |

---

_Built with [StencilJS](https://stenciljs.com/)_
