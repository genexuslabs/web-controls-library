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

| Property         | Attribute         | Description                                                                | Type                      | Default                   |
| ---------------- | ----------------- | -------------------------------------------------------------------------- | ------------------------- | ------------------------- |
| `disabled`       | `disabled`        | If the annotations are activated or not.                                   | `boolean`                 | `false`                   |
| `fontFamily`     | `font-family`     | Specifies the `fontFamily` for the texts                                   | `string`                  | `"Arial"`                 |
| `fontSize`       | `font-size`       | Specifies the `fontSize` for the texts                                     | `number`                  | `16`                      |
| `imageLabel`     | `image-label`     | The source of the background image.                                        | `"Image to be annotated"` | `"Image to be annotated"` |
| `lines`          | --                | Specifies the lines that will be drawn on the gx-image-annotations control | `ImageAnnotationLine[]`   | `[]`                      |
| `texts`          | --                | Specifies the texts that will be drawn on the gx-image-annotations control | `ImageAnnotationText[]`   | `[]`                      |
| `traceColor`     | `trace-color`     | Drawing color.                                                             | `string`                  | `"#000000"`               |
| `traceIndex`     | `trace-index`     | Property used for change the traceInd state and go forward or backward.    | `number`                  | `-1`                      |
| `traceThickness` | `trace-thickness` | Drawing thickness.                                                         | `number`                  | `2`                       |
| `value`          | `value`           | The source of the background image.                                        | `string`                  | `undefined`               |

## Events

| Event               | Description                                          | Type                                  |
| ------------------- | ---------------------------------------------------- | ------------------------------------- |
| `annotationsChange` | Fired when the annotations change.                   | `CustomEvent<AnnotationsChangeEvent>` |
| `traceIndexChange`  | Fired when the traceIndex property value is changed. | `CustomEvent<number>`                 |

## Shadow Parts

| Part                          | Description                               |
| ----------------------------- | ----------------------------------------- |
| `"image-annotations__canvas"` | The canvas where to make the annotations. |

---

_Built with [StencilJS](https://stenciljs.com/)_
