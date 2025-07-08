export const IMAGE_NAME_SEPARATOR = "image:";
export const INNER_CONTROL_CLASS = `css-class="AttributeAlignment"`;
export const LINE_CLAMP_DELAY = 32; // 32ms. Useful when we have to wait for another render to take a screenshot of the control

export const SHORT_TEXT = "Lorem ipsum dolor";
export const MEDIUM_TEXT = "Lorem ipsum dolor sit amet, consectetur adipiscing";
export const LONG_TEXT =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip";

export const SHORT_HTML =
  "This box <i>shows</i> all <sup>type</sup> of <b>HTML</b> content.";
export const LONG_HTML =
  "This box <i>shows</i> all <sup>type</sup> of <b>HTML</b> content. <div>Hello</div> <div>world!</div> <b>Lorem</b> ipsum dolor sit amet, <i>consectetur</i> adipiscing elit, sed do eiusmod";

// Dimensions: 300x231
const STENCIL_LOGO =
  "data:image/png;base64,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";

const disabled = (disabled: boolean) =>
  disabled !== undefined ? "disabled" : "";
const readonly = (readonly: boolean) =>
  readonly !== undefined ? 'readonly="true"' : "";

function FormField(innerControl: string): string {
  return `
    <gx-form-field
      ${INNER_CONTROL_CLASS}
      label-position="none"
    >
      ${innerControl}
    </gx-form-field>`;
}

interface ButtonTestProperties {
  caption: string;
  disabled?: boolean;
  height?: string;
  showMainImage: boolean;
  showDisabledImage: boolean;
  width?: string;
}

export function Button(properties: ButtonTestProperties): string {
  const width =
    properties.width !== undefined ? `width="${properties.width}"` : "";
  const height =
    properties.height !== undefined ? `height="${properties.height}"` : "";

  const image = (slot: "main-image" | "disabled-image") =>
    `<img src="${STENCIL_LOGO}" slot="${slot}"/>`;

  const mainImage = properties.showMainImage ? image("main-image") : "";
  const disabledImage = properties.showDisabledImage
    ? image("disabled-image")
    : "";

  return `
    <gx-button
      ${INNER_CONTROL_CLASS}
      ${disabled(properties.disabled)}
      ${height}
      ${width}
    >
      ${properties.caption}
      ${mainImage}
      ${disabledImage}
    </gx-button>`;
}

interface CheckboxTestProperties {
  caption: string;
  disabled?: boolean;
  readonly?: boolean;
  value: string;
}

export function Checkbox(properties: CheckboxTestProperties): string {
  return FormField(`
    <gx-checkbox
      area="field"
      checked-value="1"
      un-checked-value="0"
      caption="${properties.caption}"
      value="${properties.value}"
      ${INNER_CONTROL_CLASS}
      ${disabled(properties.disabled)}
      ${readonly(properties.readonly)}
    >
    </gx-checkbox>`);
}

interface EditTestProperties {
  autoGrow: boolean;
  disabled?: boolean;
  format: "Text" | "HTML";
  multiline?: boolean;
  readonly?: boolean;
  type:
    | "date"
    | "datetime-local"
    | "email"
    | "file"
    | "number"
    | "password"
    | "search"
    | "tel"
    | "text"
    | "time"
    | "url";
  value: string;
}

export function Edit(properties: EditTestProperties): string {
  const lineClamp =
    !properties.autoGrow && properties.readonly && properties.format !== "HTML"
      ? "line-clamp"
      : "";

  const multiline = properties.multiline != undefined ? "multiline" : "";

  const value =
    properties.format == "Text"
      ? `value="${properties.value}"`
      : `inner="${properties.value}"`;

  return FormField(`
    <gx-edit
      area="field"
      format="${properties.format}"
      placeholder="Type something..."
      type="${properties.type}"
      ${INNER_CONTROL_CLASS}
      ${lineClamp}
      ${multiline}
      ${readonly(properties.readonly)}
      ${value}
    >
    </gx-edit>`);
}

interface RadioGroupTestProperties {
  direction: "horizontal" | "vertical";
  disabled?: boolean;
  readonly?: boolean;
}

export function RadioGroup(properties: RadioGroupTestProperties): string {
  return FormField(`                              
    <gx-radio-group
      area="field"
      value="0"
      direction="${properties.direction}"
      ${INNER_CONTROL_CLASS}
      ${disabled(properties.disabled)}
      ${readonly(properties.readonly)}
    >
      <gx-radio-option caption="Option 0" value="0"></gx-radio-option>
      <gx-radio-option caption="Option 1" value="1"></gx-radio-option>
      <gx-radio-option caption="Option 2" value="2"></gx-radio-option>
    </gx-radio-group>`);
}

interface SelectTestProperties {
  disabled?: boolean;
  readonly?: boolean;
}

export function Select(properties: SelectTestProperties): string {
  return FormField(`
    <gx-select
      area="field"
      placeholder="Select an option..."
      value="0"
      ${INNER_CONTROL_CLASS}
      ${disabled(properties.disabled)}
      ${readonly(properties.readonly)}
    >
      <gx-select-option value="0">Option 0</gx-select-option>
    </gx-select>`);
}

interface TextBlockProperties {
  autoGrow: boolean;
  caption: string;
  disabled?: boolean;
  format: "Text" | "HTML";
}

export function TextBlock(properties: TextBlockProperties): string {
  const captionHTML =
    properties.format === "HTML" ? `inner="${properties.caption}"` : "";
  const captionText = properties.format === "Text" ? properties.caption : "";

  const lineClamp =
    !properties.autoGrow && properties.format !== "HTML" ? "line-clamp" : "";

  return `
    <gx-textblock
      format="${properties.format}"
      ${INNER_CONTROL_CLASS}
      ${captionHTML}
      ${lineClamp}
    >
      ${captionText}
    </gx-textblock>`;
}
