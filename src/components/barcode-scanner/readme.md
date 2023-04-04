# gx-barcode-scanner

<!-- Auto Generated Below -->

## Properties

| Property           | Attribute            | Description                                                                                                                                                                                | Type                                 | Default                                                                                                                                |
| ------------------ | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `autoClose`        | `auto-close`         | This attribute lets you specify if the popup is automatically closed when an action is clicked.                                                                                            | `boolean`                            | `undefined`                                                                                                                            |
| `barcodeTypes`     | `barcode-types`      | Comma-separated values of the barcode types the Scanner should look for.                                                                                                                   | `string`                             | `'QR Code, AZTEC, CODE_39, CODE_93, CODE_128, ITF, EAN_13, EAN_8, PDF_417, UPC_A, UPC_E, DATA_MATRIX, MAXICODE, RSS_14, RSS_EXPANDED'` |
| `beepOnEachRead`   | `beep-on-each-read`  | Beeps after each read when set to True.                                                                                                                                                    | `boolean`                            | `undefined`                                                                                                                            |
| `beepSrc`          | `beep-src`           | The source of the beep sound.                                                                                                                                                              | `string`                             | `undefined`                                                                                                                            |
| `closeButtonLabel` | `close-button-label` | This attribute lets you specify the label for the close button. Important for accessibility.                                                                                               | `string`                             | `undefined`                                                                                                                            |
| `cssClass`         | `css-class`          | A CSS class to set as the `gx-banner-scanner` element class.                                                                                                                               | `string`                             | `undefined`                                                                                                                            |
| `displayMode`      | `display-mode`       | When set to As Prompt, it shows an indicator that displays a new screen with the camera viewport. When Inline is selected, the camera viewport is displayed inside the Panel’s layout.     | `"As Prompt" \| "Inline"`            | `'Inline'`                                                                                                                             |
| `opened`           | `opened`             | If the showBehavior is popup, this attribute lets you specify if the popup is opened or closed.                                                                                            | `boolean`                            | `false`                                                                                                                                |
| `operationMode`    | `operation-mode`     | When set to Single read, the control reads the first code and then stops scanning. When Continuous read is selected, it reads all the codes it can while the control is visible, non-stop. | `"Continuous read" \| "Single read"` | `'Single read'`                                                                                                                        |
| `popupHeight`      | `popup-height`       | This attribute lets you specify the height of the popup.                                                                                                                                   | `string`                             | `null`                                                                                                                                 |
| `popupWidth`       | `popup-width`        | This attribute lets you specify the width of the popup.                                                                                                                                    | `string`                             | `null`                                                                                                                                 |
| `showFooter`       | `show-footer`        | This attribute lets you specify if a footer is rendered at the bottom of the popup.                                                                                                        | `boolean`                            | `true`                                                                                                                                 |
| `showHeader`       | `show-header`        | This attribute lets you specify if a header is rendered on top of the popup.                                                                                                               | `boolean`                            | `true`                                                                                                                                 |

## Events

| Event                        | Description                              | Type                  |
| ---------------------------- | ---------------------------------------- | --------------------- |
| `codeRead`                   | Fired when the menu action is activated. | `CustomEvent<string>` |
| `gxBarcodeScannerPopupClose` | Fired when the popup is closed           | `CustomEvent<any>`    |
| `gxBarcodeScannerPopupOpen`  | Fired when the popup is opened           | `CustomEvent<any>`    |

## Shadow Parts

| Part                  | Description |
| --------------------- | ----------- |
| `"body"`              |             |
| `"close-button"`      |             |
| `"footer"`            |             |
| `"header"`            |             |
| `"scanner-container"` |             |

---

_Built with [StencilJS](https://stenciljs.com/)_
