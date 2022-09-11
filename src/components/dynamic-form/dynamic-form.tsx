import {
  Component,
  Host,
  h,
  Element,
  Prop,
  Event,
  EventEmitter
} from "@stencil/core";
import { Component as GxComponent } from "../common/interfaces";

interface GxDynamicForm {
  id: string;
  version: string;
  name: string;
  Elements: DynamicFormElement[];
}

interface DynamicFormElement {
  id: number;
  version: number;
  name: string;
  type:
    | "character"
    | "numeric"
    | "boolean"
    | "date"
    | "datetime"
    | "email"
    | "password"
    | "upload"
    | "group";
  display: "default" | "slider" | "rating" | "switch" | "radio" | "textarea";
  value: string;
  dftValue: string;
  length: number;
  rows: number;
  cols: number;
  Groups?: DynamicFormElement[];
  Values?: ElementValue[];
  Rules?: DynamicFormElementRule[];
}

interface ElementValue {
  id: number;
  description: string;
}

interface DynamicFormElementRule {
  id: number;
  function:
    | "show"
    | "hide"
    | "disable"
    | "enable"
    | "disable"
    | "msg"
    | "error"
    | "assign";
  Conditions?: DynamicFormRuleCondition[];
}

interface DynamicFormRuleCondition {
  id: number;
  cndElemId: number;
  operator: number;
  cndValue: string;
  cndEval: number;
}

interface DynamicFormCondition {
  id: number;
  function: string;
  conditions: string;
}

interface FormMessages {
  id: string;
  type: Messages;
  message: string;
}

const enum LogicalOperators {
  AND = "&&",
  OR = "||"
}

const enum ArithmeticalOperators {
  GREAT = ">",
  LESS = "<",
  GREATOREQUAL = ">=",
  LESSOREQUAL = "<=",
  EQUAL = "==",
  DISTINCT = "!="
}

const enum RuleTypes {
  SHOW = "show",
  ENABLE = "enable",
  HIDE = "hide",
  DISABLE = "disable",
  ERROR = "error",
  MSG = "msg",
  RELOAD = "reload",
  ASSIGN = "assign"
}

const logicalDictionary = {
  0: LogicalOperators.OR,
  1: LogicalOperators.AND
};

const arithmeticalDictionary = {
  1: ArithmeticalOperators.EQUAL,
  2: ArithmeticalOperators.DISTINCT,
  3: ArithmeticalOperators.GREAT,
  4: ArithmeticalOperators.GREATOREQUAL,
  5: ArithmeticalOperators.LESS,
  6: ArithmeticalOperators.LESSOREQUAL
};

const typeDictionary = {
  character: "text",
  date: "date",
  datetime: "datetime-local",
  password: "password",
  email: "email",
  numeric: "number",
  upload: "file"
};

const componentTypeDictionary = {
  "numeric-slider": "GX-SLIDER",
  "numeric-rating": "GX-RATING",
  "boolean-switch": "GX-SWITCH",
  "boolean-default": "GX-CHECKBOX",
  "enum-radio": "GX-RADIO-GROUP",
  "enum-default": "GX-SELECT",
  "group-default": "GX-DYNAMIC-FORM"
};

const enum Messages {
  ERROR = "error",
  WARNING = "warning"
}

// Selectors
const FORM_FIELD_BY_ID = (id: string) => `#form-field-${id}`;

@Component({
  tag: "gx-dynamic-form",
  styleUrl: "dynamic-form.scss",
  shadow: false
})
export class DynamicForm implements GxComponent {
  private conditions: DynamicFormCondition[] = [];
  private formFieldElements = new Map<string, any>();
  private JSONForm: GxDynamicForm[];
  private messages: FormMessages[] = [];

  @Element() element: HTMLGxDynamicFormElement;

  /**
   * This attribute let you specify the elements, rules and conditions of the dynamic form. Must be a JSON string, based on DynamicForm SDT
   */
  @Prop() readonly elements: string;

  /**
   * A css class to set to attributes when a error occurs
   */
  @Prop() readonly errorCssClass: string;

  /**
   * A css class to set to attributes
   */
  @Prop() readonly inputCssClass: string;

  /**
   *  This attribute let you specify if the dynamic form is readonly
   */
  @Prop() readonly readonly: boolean = false;

  /**
   * This attribute let you specify if this dynamic form is a subgroup of another dynamic form
   */
  @Prop() readonly subgroup: boolean = false;

  /**
   * A css class to set to attributes when a warning occurs
   */
  @Prop() readonly warningCssClass: string;

  /**
   * Emitted when a message is shown
   */
  @Event() onMessage: EventEmitter;

  /**
   * Emitted when the form is submitted
   */
  @Event() onSubmitForm: EventEmitter;

  componentWillLoad() {
    this.JSONForm = JSON.parse(this.elements);

    this.JSONForm[0].Elements.forEach(element => {
      element.name = this.replaceSpecialChars(element.name);
      this.addConditionsOfElement(element);
    });
  }

  componentDidLoad() {
    const elements = this.element.querySelectorAll(
      "gx-checkbox, gx-switch, gx-edit, gx-radio-group, gx-select"
    );

    // Store element references
    elements.forEach(element => {
      element.addEventListener("change", () => {
        this.checkRules();
      });

      this.formFieldElements.set(element.id, element);
    });

    // Set element maxlength
    this.JSONForm[0].Elements.forEach(element => {
      this.setElementAttributes(element);
    });

    this.element
      .querySelector("#SUBMIT_FORM")
      ?.addEventListener("click", () => {
        this.handleData();
      });
  }

  disconnectedCallback() {
    this.element
      .querySelector("#SUBMIT_FORM")
      ?.removeEventListener("click", () => {
        this.handleData;
      });
  }

  private addConditionsOfElement(element: DynamicFormElement) {
    if (element.Rules == null) {
      return;
    }

    element.Rules.forEach(rule => {
      this.conditions.push({
        id: element.id,
        function: rule.function,
        conditions: this.parseRules(rule.Conditions)
      });
    });
  }

  private setElementAttributes(element: DynamicFormElement) {
    if (element.type !== "character" && element.type !== "numeric") {
      return;
    }

    const input = document.getElementById(element.id.toString());

    if (input == undefined) {
      return;
    }

    input.setAttribute("maxlength", element.length.toString());

    if (element.display == "textarea") {
      input.setAttribute("rows", element.rows.toString());
      input.setAttribute("cols", element.cols.toString());
    }
  }

  private replaceSpecialChars(name: string) {
    return name.replace(/\/nbsp\//g, " ");
  }

  private getEditFormParentNode(id: string) {
    return this.element.querySelector(FORM_FIELD_BY_ID(id));
  }

  /**
   * This method parse each rule of the form and evaluate the conditions
   */
  private checkRules() {
    Array.from(this.conditions).forEach(element => {
      const id = element.id;
      const conditions = element.conditions;

      /** The element that may be affected by the rule */
      const targeted = this.formFieldElements.get(id.toString());

      //** The parent node of the element that may be affected by the rule */
      const gxEditForm = this.getEditFormParentNode(
        id.toString()
      ) as HTMLGxEditElement;

      const parsedCondition = this.buildCondition(conditions);
      const result = eval(parsedCondition);

      switch (element.function) {
        // If the condition is true, the element is disabled
        case RuleTypes.DISABLE:
          targeted.disabled = result;
          break;

        // If the condition is true, the element is enabled
        case RuleTypes.ENABLE:
          targeted.disabled = !result;
          break;

        // If the condition is true, the element shows with error class and emit a message
        case RuleTypes.ERROR:
          if (result) {
            targeted.cssClass = this.errorCssClass;
            this.addMessage(Messages.ERROR, conditions, id.toString());
          } else {
            targeted.cssClass = this.inputCssClass;
            this.removeMessage(id.toString());
          }
          break;

        // If the condition is true, the element shows with warning class and emit a message
        case RuleTypes.MSG:
          if (result) {
            targeted.cssClass = this.warningCssClass;
            this.addMessage(Messages.WARNING, conditions, id.toString());
          } else {
            targeted.cssClass = this.inputCssClass;
            this.removeMessage(id.toString());
          }
          break;

        // If the condition is true, the element clear they value
        case RuleTypes.RELOAD:
          if (result) targeted.value = "";
          break;

        // If the condition is true, the element is hidden, otherwise it is shown
        case RuleTypes.HIDE:
        case RuleTypes.SHOW:
          gxEditForm.hidden = result;
      }
    });
    this.onMessage.emit(this.messages);
  }

  /**
   * This method add a message to message list
   * @param {Messages} type - the type of message
   * @param {string} conditional - the condition that caused the message
   * @param {string} id - the id of the element that caused the message
   */
  private addMessage(type: Messages, conditional: string, id: string) {
    conditional.split("&&|\\||").forEach(condition => {
      const parsedCondition = this.buildCondition(condition);

      const result = eval(parsedCondition);

      if (
        result &&
        this.messages.find(
          message => message.id.toString() === id.toString()
        ) === undefined
      ) {
        const elemName = this.replaceSpecialChars(
          this.JSONForm[0].Elements.find(
            element => element.id.toString() === id.toString()
          ).name
        );

        const indexCondition = condition.indexOf("");
        const msgCondition = condition.substring(indexCondition + 1);

        this.messages.push({
          id: id,
          type: type,
          message: elemName + " " + msgCondition
        });
      }
    });
  }

  /**
   * This method remove a message from message list
   * @param {string} id - the id of the element that caused the message
   */
  private removeMessage(id: string) {
    this.messages = this.messages.filter(
      message => message.id.toString() !== id.toString()
    );
  }

  private parseRules(conditions: DynamicFormRuleCondition[]) {
    let parsedCond = "";

    conditions.forEach(condition => {
      const logicalOperator =
        conditions[conditions.length - 1] != condition
          ? this.decodeLogical(condition.cndEval) + " "
          : "";

      parsedCond += [
        condition.cndElemId,
        this.decodeOperator(condition.operator),
        condition.cndValue,
        logicalOperator
      ].join(" ");
    });
    return parsedCond;
  }

  /**
   * Get all form values and concatenate them into a string.
   *
   * | Array index  | Element            |
   * | ------------ | ------------------ |
   * | `0`          | Elem1ToFind        |
   * | `1`          | ArithmeticOperator |
   * | `2`          | ValueToCompare     |
   * | `3`          | LogicalOperator    |
   * | `4`          | Elem2ToFind        |
   * | `5`          | ArithmeticOperator |
   * | `6`          | ValueToCompare     |
   * | `7`          | LogicalOperator    |
   * | `8`          | ...                |
   *
   * @example <caption>Only Uruguayan citizens older than 18 years old can vote.</caption>
   * Array: |  Id_1  |  1  |  'Uruguayan'  |  1  |  Id_2  |  4  |  '18'  |
   *
   * @param condition - the condition to parse
   * @returns {string} - the parsed condition
   */
  private buildCondition(condition: string) {
    const splited = condition.split(" ");

    for (let i = 0; i < splited.length; i += 4) {
      const formFieldElement = this.formFieldElements.get(
        splited[i].toString()
      );

      if (formFieldElement != undefined) {
        splited[i] = `'${formFieldElement.value}'`;
      }
    }

    for (let i = 2; i < splited.length; i += 4) {
      splited[i] = `'${splited[i]}'`;
    }

    return splited.join(" ");
  }

  /**
   * this method makes the response when a form is submitted
   */
  private handleData() {
    this.JSONForm[0].Elements.forEach(element => {
      const input = this.formFieldElements.get(element.id.toString());
      element.value = input.value;
    });
    this.onSubmitForm.emit(this.JSONForm[0]);
  }

  private decodeOperator(operator: number) {
    return arithmeticalDictionary[operator];
  }

  private decodeLogical(condition: number) {
    return logicalDictionary[condition];
  }

  private getElementValue(element: DynamicFormElement) {
    if (element.type != "boolean") {
      return element.value
        ? this.replaceSpecialChars(element.value)
        : element.dftValue
        ? this.replaceSpecialChars(element.dftValue)
        : "";
    }

    return element.value
      ? element.value.toLowerCase()
      : element.dftValue
      ? element.dftValue.toLowerCase()
      : "";
  }

  private getComponentType(type: string, display: string) {
    return componentTypeDictionary[`${type}-${display}`] || "GX-EDIT";
  }

  private getEditType(type: string) {
    return typeDictionary[type];
  }

  private renderGxEdit(element: DynamicFormElement) {
    return (
      <gx-edit
        cssClass={this.inputCssClass}
        type={this.getEditType(element.type)}
        multiline={element.display === "textarea"}
        id={element.id.toString()}
        disabled={false}
        readonly={this.readonly}
        value={this.getElementValue(element)}
      ></gx-edit>
    );
  }

  private renderGxRadioGroup(element: DynamicFormElement) {
    return (
      <gx-radio-group
        cssClass={this.inputCssClass}
        direction="vertical"
        id={element.id.toString()}
        disabled={false}
        readonly={this.readonly}
        value={this.getElementValue(element)}
      >
        {element.Values.map(value => {
          return (
            <gx-radio-option
              caption={this.replaceSpecialChars(value.description)}
              value={value.id.toString()}
            ></gx-radio-option>
          );
        })}
      </gx-radio-group>
    );
  }

  private renderGxDynamicForm(element: DynamicFormElement) {
    return (
      <gx-dynamic-form
        subgroup={true}
        elements={"[" + JSON.stringify(element) + "]"}
      ></gx-dynamic-form>
    );
  }

  private renderGxSelect(element: DynamicFormElement) {
    return (
      <gx-select
        cssClass={this.inputCssClass}
        id={element.id.toString()}
        disabled={false}
        placeholder="-"
        readonly={this.readonly}
        value={this.getElementValue(element)}
      >
        {element.Values.map(value => {
          return (
            <gx-select-option value={value.id.toString()}>
              {this.replaceSpecialChars(value.description)}
            </gx-select-option>
          );
        })}
      </gx-select>
    );
  }

  private renderGxCheckbox(element: DynamicFormElement) {
    return (
      <gx-checkbox
        cssClass={this.inputCssClass}
        id={element.id.toString()}
        disabled={false}
        value={this.getElementValue(element)}
        checkedValue={"true"}
        unCheckedValue={"false"}
      ></gx-checkbox>
    );
  }

  private renderGxSwitch(element: DynamicFormElement) {
    return (
      <gx-switch
        cssClass={this.inputCssClass}
        id={element.id.toString()}
        checkedValue={"true"}
        unCheckedValue={"false"}
        disabled={false}
        value={this.getElementValue(element)}
      ></gx-switch>
    );
  }

  private renderElement(element: DynamicFormElement) {
    switch (this.getComponentType(element.type, element.display)) {
      case "GX-RADIO-GROUP":
        return this.renderGxRadioGroup(element);
      case "GX-EDIT":
        return this.renderGxEdit(element);
      case "GX-DYNAMIC-FORM":
        return this.renderGxDynamicForm(element);
      case "GX-SELECT":
        return this.renderGxSelect(element);
      case "GX-CHECKBOX":
        return this.renderGxCheckbox(element);
      case "GX-SWITCH":
        return this.renderGxSwitch(element);
    }
  }

  render() {
    return (
      <Host>
        {this.JSONForm[0] &&
          this.JSONForm[0].Elements.map(element => {
            return (
              <gx-form-field
                cssClass={this.inputCssClass}
                label-caption={element.name}
                label-position="left"
                id={"form-field-" + element.id}
              >
                {this.renderElement(element)}
              </gx-form-field>
            );
          })}
        <slot></slot>
      </Host>
    );
  }
}
