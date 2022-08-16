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
  EQUAL = "===",
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

const enum Messages {
  ERROR = "error",
  WARNING = "warning"
}

@Component({
  tag: "gx-dynamic-form",
  styleUrl: "dynamic-form.scss",
  shadow: false
})
export class DynamicForm implements GxComponent {
  private dynamicElements: any = {};
  private inputs: any[] = [];
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
   *  This attribute let you specify the entry point to upload files
   */
  @Prop() readonly point: string;

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
    let rules = [];
    this.JSONForm = JSON.parse(this.elements);
    this.JSONForm[0].Elements.forEach(element => {
      element.name = this.replaceSpecialChars(element.name);
      if (element.Rules != null) {
        element.Rules.forEach(rule => {
          rules.push({
            action: rule.function,
            conditions: this.parseRules(rule.Conditions)
          });
        });
      }
      this.dynamicElements[element.id] = rules.slice(0);
      rules = [];
    });
  }

  componentDidLoad() {
    const docs = this.element.querySelectorAll(
      "gx-checkbox, gx-switch, gx-edit, gx-radio-group, gx-select"
    );
    docs.forEach(element => {
      element.addEventListener("change", () => {
        this.checkRules();
      });
      this.inputs.push({
        id: element.id,
        tagName: element.tagName,
        element: element
      });
    });

    this.JSONForm[0].Elements.forEach(element => {
      this.setElementAttributes(element);
    });

    this.element
      .querySelector("[id='SUBMIT_FORM']")
      ?.addEventListener("click", this.handleData);
  }

  disconnectedCallback() {
    this.element
      .querySelector("[id='SUBMIT_FORM']")
      .removeEventListener("click", this.handleData);
  }

  private setElementAttributes(element: DynamicFormElement) {
    if (element.type !== "character" && element.type !== "numeric") {
      return;
    }

    const input = this.element.querySelector('[id="' + element.id + '__edit"]');

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

  /**
   * This method parse each rule of the form and evaluate the conditions
   */
  private checkRules() {
    for (const id in this.dynamicElements) {
      for (const rule in this.dynamicElements[id]) {
        const targeted = this.inputs.find(
          input => input.id.toString() === id.toString()
        );
        const input = this.element.querySelector(
          '[id="' + id + '__edit"]'
        ) as HTMLInputElement;
        const gxEditForm = this.getEditFormParentNode(
          targeted
        ) as HTMLGxEditElement;
        const condition = this.buildCondition(
          this.dynamicElements[id][rule].conditions
        );
        const result = eval(condition);
        switch (this.dynamicElements[id][rule].action) {
          case RuleTypes.ASSIGN:
          //not implemented yet
          case RuleTypes.DISABLE:
            targeted.element.disabled = result;
            break;
          case RuleTypes.ENABLE:
            targeted.element.disabled = !result;
            break;
          case RuleTypes.ERROR:
            if (result) {
              targeted.element.classList.add(this.errorCssClass);
              input.classList.remove(this.inputCssClass);
              input.classList.add(this.errorCssClass);
              this.addMessage(
                Messages.ERROR,
                this.dynamicElements[id][rule].conditions,
                id
              );
            } else {
              targeted.element.classList.remove(this.errorCssClass);
              input.classList.add(this.inputCssClass);
              input.classList.remove(this.errorCssClass);
              this.removeMessage(id);
            }
            break;
          case RuleTypes.HIDE:
            result
              ? (gxEditForm.style.display = "none")
              : (gxEditForm.style.display = "block");
            break;
          case RuleTypes.MSG:
            if (result) {
              targeted.element.classList.add(this.warningCssClass);
              input.classList.remove(this.inputCssClass);
              input.classList.add(this.warningCssClass);
              this.addMessage(
                Messages.WARNING,
                this.dynamicElements[id][rule].conditions,
                id
              );
            } else {
              targeted.element.classList.remove(this.warningCssClass);
              input.classList.add(this.inputCssClass);
              input.classList.remove(this.warningCssClass);
              this.removeMessage(id);
            }
            break;
          case RuleTypes.RELOAD:
            result ? (targeted.element.value = "") : null;
            break;
          case RuleTypes.SHOW:
            result
              ? (gxEditForm.style.display = "block")
              : (gxEditForm.style.display = "none");
            break;
        }
      }
    }
  }

  /**
   * This method add a message to message list
   * @param {Messages} type - the type of message
   * @param {string} conditional - the condition that caused the message
   * @param {string} id - the id of the element that caused the message
   */
  private addMessage(type: Messages, conditional: string, id: string) {
    console.log(this.JSONForm[0].Elements, "JSONForm");
    console.log(id, "id");
    conditional.split("&&|\\||").forEach(condition => {
      const parsedCondition = this.buildCondition(condition);
      const result = eval(parsedCondition);
      const elemName = this.replaceSpecialChars(
        this.JSONForm[0].Elements.find(
          element => element.id.toString() === id.toString()
        ).name
      );
      if (
        result &&
        this.messages.find(
          message => message.id.toString() === id.toString()
        ) === undefined
      ) {
        this.messages.push({
          id: id,
          type: type,
          message:
            elemName +
            " " +
            condition
              .split(" ")
              .slice(1, 3)
              .join(" ")
        });
      }
    });
    console.log(this.messages, "messages");
    this.onMessage.emit(this.messages);
  }

  /**
   * This method remove a message from message list
   * @param {string} id - the id of the element that caused the message
   */
  private removeMessage(id: string) {
    this.messages = this.messages.filter(
      message => message.id.toString() !== id.toString()
    );
    this.onMessage.emit(this.messages);
  }

  private parseRules(conditions: DynamicFormRuleCondition[]) {
    let parsedCond = "";
    conditions.forEach(condition => {
      parsedCond +=
        condition.cndElemId +
        " " +
        this.decodeOperator(condition.operator) +
        " " +
        condition.cndValue +
        (conditions[conditions.length - 1] != condition
          ? " " + this.decodeLogical(condition.cndEval) + " "
          : "");
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
      splited[i] =
        "'" +
        this.inputs.find(input => input.id.toString() == splited[i].toString())
          ?.element.value +
        "'";
    }

    for (let i = 2; i < splited.length; i += 4) {
      splited[i] = "'" + splited[i] + "'";
    }

    return splited.join(" ");
  }

  private getEditFormParentNode(element) {
    return this.element.querySelector('[id = "form-field-' + element.id + '"]');
  }

  /**
   * this method makes the response when a form is submitted
   */
  private handleData() {
    this.getFormValues();
    this.onSubmitForm.emit(this.JSONForm[0]);
  }

  private getFormValues() {
    this.JSONForm[0].Elements.forEach(element => {
      const input = this.inputs.find(
        input => input.id.toString() === element.id.toString()
      );
      if (element.type === "upload") {
        const file = this.element.querySelector(
          "[id =" + element.id + '__edit"]'
        );
        if (input.element.value) {
          this.postFormData(file, element);
        } else element.value = "";
      } else element.value = input.element.value;
    });
  }

  /**
   * This method makes a post to the entry point of the form to upload a file
   * @param file - the file to upload
   * @param {DynamicFormElement} element - the element in the JSON
   */
  private postFormData(file, element: DynamicFormElement) {
    const url =
      location.pathname.substring(0, location.pathname.lastIndexOf("/") + 1) +
      this.point;
    const formData = new FormData();
    formData.append("file", file.files[0]);
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data"
      },
      body: formData
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        element.value =
          "$fileName=" + file.files[0].name + "$" + data["object_id"];
      });
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
    } else {
      return element.value
        ? element.value.toLowerCase()
        : element.dftValue
        ? element.dftValue.toLowerCase()
        : "";
    }
  }

  private getComponentType(type: string, display: string) {
    switch (type) {
      case "numeric":
        switch (display) {
          case "slider":
            return "GX-SLIDER";
          case "rating":
            return "GX-RATING";
          default:
            return "GX-EDIT";
        }
      case "boolean":
        return display === "switch" ? "GX-SWITCH" : "GX-CHECKBOX";
      case "enum":
        return display === "radio" ? "GX-RADIO-GROUP" : "GX-SELECT";
      case "group":
        return "GX-DYNAMIC-FORM";
      default:
        return "GX-EDIT";
    }
  }

  private getEditType(type: string) {
    return typeDictionary[type];
  }

  private renderGxEdit(element: DynamicFormElement) {
    return (
      <gx-form-field
        cssClass={this.inputCssClass}
        label-caption={element.name}
        label-position="left"
        id={"form-field-" + element.id}
      >
        <gx-edit
          cssClass={this.inputCssClass}
          type={this.getEditType(element.type)}
          multiline={element.display === "textarea"}
          id={element.id.toString()}
          disabled={false}
          readonly={this.readonly}
          value={this.getElementValue(element)}
        ></gx-edit>
      </gx-form-field>
    );
  }

  private renderGxRadioGroup(element: DynamicFormElement) {
    return (
      <gx-form-field
        cssClass={this.inputCssClass}
        label-caption={element.name}
        label-position="left"
        id={"form-field-" + element.id}
      >
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
      </gx-form-field>
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
      <gx-form-field
        cssClass={this.inputCssClass}
        label-caption={element.name}
        label-position="left"
        id={"form-field-" + element.id}
      >
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
      </gx-form-field>
    );
  }

  private renderGxCheckbox(element: DynamicFormElement) {
    return (
      <gx-form-field
        cssClass={this.inputCssClass}
        label-caption={element.name}
        label-position="left"
        id={"form-field-" + element.id}
      >
        <gx-checkbox
          cssClass={this.inputCssClass}
          id={element.id.toString()}
          disabled={false}
          value={this.getElementValue(element)}
          checkedValue={"true"}
          unCheckedValue={"false"}
        ></gx-checkbox>
      </gx-form-field>
    );
  }

  private renderGxSwitch(element: DynamicFormElement) {
    return (
      <gx-form-field
        cssClass={this.inputCssClass}
        label-caption={element.name}
        label-position="left"
        id={"form-field-" + element.id}
      >
        <gx-switch
          cssClass={this.inputCssClass}
          id={element.id.toString()}
          checkedValue={"true"}
          unCheckedValue={"false"}
          disabled={false}
          value={this.getElementValue(element)}
        ></gx-switch>
      </gx-form-field>
    );
  }

  render() {
    return (
      <Host>
        {this.JSONForm[0] &&
          this.JSONForm[0].Elements.map(elem => {
            switch (this.getComponentType(elem.type, elem.display)) {
              case "GX-RADIO-GROUP":
                return this.renderGxRadioGroup(elem);
              case "GX-EDIT":
                return this.renderGxEdit(elem);
              case "GX-DYNAMIC-FORM":
                return this.renderGxDynamicForm(elem);
              case "GX-SELECT":
                return this.renderGxSelect(elem);
              case "GX-CHECKBOX":
                return this.renderGxCheckbox(elem);
              case "GX-SWITCH":
                return this.renderGxSwitch(elem);
            }
          })}
        <slot></slot>
      </Host>
    );
  }
}
