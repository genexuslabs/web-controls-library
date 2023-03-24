import { h } from "@stencil/core";
import { EditType } from "../../common/types";
import { DynamicFormElement } from "./dynamic-form-interfaces";

// - - - - - - - - Dictionaries - - - - - - - -
const componentTypeDictionary = {
  "numeric-slider": "GX-SLIDER",
  "numeric-rating": "GX-RATING",
  "boolean-switch": "GX-SWITCH",
  "boolean-default": "GX-CHECKBOX",
  "enum-radio": "GX-RADIO-GROUP",
  "enum-default": "GX-SELECT",
  "group-default": "GX-DYNAMIC-FORM",
};

/**
 * Dictionary that implements dynamic-form renders.
 *
 * "GX-SLIDER" render is not implemented yet (the gx-slider control is not implemented).
 * @todo TODO: Add "GX-RATING" render
 */
const renderDictionary = {
  "GX-CHECKBOX": renderGxCheckbox,
  "GX-DYNAMIC-FORM": renderGxDynamicForm,
  "GX-EDIT": renderGxEdit,
  "GX-RADIO-GROUP": renderGxRadioGroup,
  "GX-SELECT": renderGxSelect,
  "GX-SWITCH": renderGxSwitch,
};

const typeDictionary = {
  character: "text",
  date: "date",
  datetime: "datetime-local",
  password: "password",
  email: "email",
  numeric: "number",
  upload: "file",
};

// - - - - - - - -  Interfaces  - - - - - - - -
interface ElementOptions {
  inputCssClass: string;
  readonly: boolean;
}

// - - - - - - - -  Functions  - - - - - - - -
function replaceSpecialChars(name: string) {
  return name.replace(/\/nbsp\//g, " ");
}

function getElementValue(element: DynamicFormElement) {
  if (element.type != "boolean") {
    return element.value
      ? replaceSpecialChars(element.value)
      : element.dftValue
      ? replaceSpecialChars(element.dftValue)
      : "";
  }

  return element.value
    ? element.value.toLowerCase()
    : element.dftValue
    ? element.dftValue.toLowerCase()
    : "";
}

function getComponentType(type: string, display: string): string {
  // @ts-expect-error:
  return componentTypeDictionary[`${type}-${display}`] || "GX-EDIT";
}

function getEditType(type: string): EditType {
  // @ts-expect-error:
  return typeDictionary[type];
}

// - - - - - - - - - Renders - - - - - - - - -
export function renderGxEdit(
  element: DynamicFormElement,
  options: ElementOptions
) {
  return (
    <gx-edit
      cssClass={options.inputCssClass}
      type={getEditType(element.type)}
      multiline={element.display === "textarea"}
      id={element.id.toString()}
      disabled={false}
      readonly={options.readonly}
      value={getElementValue(element)}
    ></gx-edit>
  );
}

export function renderGxRadioGroup(
  element: DynamicFormElement,
  options: ElementOptions
) {
  return (
    <gx-radio-group
      cssClass={options.inputCssClass}
      direction="vertical"
      id={element.id.toString()}
      disabled={false}
      readonly={options.readonly}
      value={getElementValue(element)}
    >
      {element.Values.map((value) => {
        return (
          <gx-radio-option
            caption={replaceSpecialChars(value.description)}
            value={value.id.toString()}
          ></gx-radio-option>
        );
      })}
    </gx-radio-group>
  );
}

export function renderGxDynamicForm(element: DynamicFormElement) {
  return (
    <gx-dynamic-form
      subgroup={true}
      elements={"[" + JSON.stringify(element) + "]"}
    ></gx-dynamic-form>
  );
}

export function renderGxSelect(
  element: DynamicFormElement,
  options: ElementOptions
) {
  return (
    <gx-select
      cssClass={options.inputCssClass}
      id={element.id.toString()}
      disabled={false}
      placeholder="-"
      readonly={options.readonly}
      value={getElementValue(element)}
    >
      {element.Values.map((value) => {
        return (
          <gx-select-option value={value.id.toString()}>
            {replaceSpecialChars(value.description)}
          </gx-select-option>
        );
      })}
    </gx-select>
  );
}

export function renderGxCheckbox(
  element: DynamicFormElement,
  options: ElementOptions
) {
  return (
    <gx-checkbox
      cssClass={options.inputCssClass}
      id={element.id.toString()}
      disabled={false}
      value={getElementValue(element)}
      checkedValue={"true"}
      unCheckedValue={"false"}
    ></gx-checkbox>
  );
}

export function renderGxSwitch(
  element: DynamicFormElement,
  options: ElementOptions
) {
  return (
    <gx-switch
      cssClass={options.inputCssClass}
      id={element.id.toString()}
      checkedValue={"true"}
      unCheckedValue={"false"}
      disabled={false}
      value={getElementValue(element)}
    ></gx-switch>
  );
}

export function renderElement(
  element: DynamicFormElement,
  options: ElementOptions
) {
  const componentType = getComponentType(element.type, element.display);

  if (componentType !== "GX-DYNAMIC-FORM") {
    // @ts-expect-error:
    return renderDictionary[componentType](element, options);
  }

  return renderDictionary[componentType](element);
}
