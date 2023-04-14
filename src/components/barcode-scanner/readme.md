# GX Barcode Scanner

This component allows you to scan a wide variety of types of barcode and QR codes

### Example

```html
<gx-barcode-scanner
  operation-mode="Continuous read"
  display-mode="As Prompt"
  beep-on-each-read
>
  <div id="gx-barcode-scanner-reader" slot="readerContainer"></div>
</gx-barcode-scanner>
```

```js
<script>
  window.addEventListener('load', () => {
    const barcodeScanner = document.querySelector('gx-barcode-scanner');
    barcodeScanner.addEventListener('codeRead', (ev) => {
      const codeText = document.querySelector('#codeText');
      codeText.innerHTML = ev.detail;
    });
  }, false);

  function startScan(){
    const barcodeScanner = document.querySelector('gx-barcode-scanner');
    barcodeScanner.setAttribute('started', true);
  }

  function stopScan(){
    const barcodeScanner = document.querySelector('gx-barcode-scanner');
    barcodeScanner.setAttribute('started', false);
  }
</script>
```

<!-- Auto Generated Below -->

## Properties

| Property         | Attribute           | Description                                                                                                                                                                                | Type                                                                                                                                   | Default                                                                                                                                |
| ---------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `barcodeTypes`   | `barcode-types`     | Comma-separated values of the barcode types the Scanner should look for.                                                                                                                   | `"QR Code, AZTEC, CODE_39, CODE_93, CODE_128, ITF, EAN_13, EAN_8, PDF_417, UPC_A, UPC_E, DATA_MATRIX, MAXICODE, RSS_14, RSS_EXPANDED"` | `"QR Code, AZTEC, CODE_39, CODE_93, CODE_128, ITF, EAN_13, EAN_8, PDF_417, UPC_A, UPC_E, DATA_MATRIX, MAXICODE, RSS_14, RSS_EXPANDED"` |
| `beepOnEachRead` | `beep-on-each-read` | Beeps after each read when set to True.                                                                                                                                                    | `boolean`                                                                                                                              | `undefined`                                                                                                                            |
| `beepSrc`        | `beep-src`          | The source of the beep sound.                                                                                                                                                              | `string`                                                                                                                               | `undefined`                                                                                                                            |
| `cssClass`       | `css-class`         | A CSS class to set as the `gx-banner-scanner` element class.                                                                                                                               | `string`                                                                                                                               | `undefined`                                                                                                                            |
| `displayMode`    | `display-mode`      | When set to As Prompt, it shows an indicator that displays a new screen with the camera viewport. When Inline is selected, the camera viewport is displayed inside the Panel’s layout.     | `"As Prompt" \| "Inline"`                                                                                                              | `"Inline"`                                                                                                                             |
| `operationMode`  | `operation-mode`    | When set to Single read, the control reads the first code and then stops scanning. When Continuous read is selected, it reads all the codes it can while the control is visible, non-stop. | `"Continuous read" \| "Single read"`                                                                                                   | `"Single read"`                                                                                                                        |
| `started`        | `started`           | If the displayMode is 'As Prompt', this attribute lets you specify if the scanner is started or not.                                                                                       | `boolean`                                                                                                                              | `false`                                                                                                                                |

## Events

| Event      | Description                              | Type                  |
| ---------- | ---------------------------------------- | --------------------- |
| `codeRead` | Fired when the menu action is activated. | `CustomEvent<string>` |

## Slots

| Slot                | Description                               |
| ------------------- | ----------------------------------------- |
| `"readerContainer"` | The slot where live the code reader tool. |

---

_Built with [StencilJS](https://stenciljs.com/)_
