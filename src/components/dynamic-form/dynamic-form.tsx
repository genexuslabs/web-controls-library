import {
  Component,
  Host,
  h,
  Element,
  Prop,
  Event,
  EventEmitter,
} from "@stencil/core";
import { Component as GxComponent } from "../common/interfaces";
import {
  arithmeticalDictionary,
  DynamicFormCondition,
  DynamicFormElement,
  DynamicFormRuleCondition,
  FormMessages,
  GxDynamicForm,
  logicalDictionary,
  Messages,
  RuleTypes,
} from "./dynamic-form-interfaces";
import { renderElement } from "./dynamic-form-renders";

// Selectors
const FORM_FIELD_BY_ID = (id: string) => `#form-field-${id}`;

@Component({
  tag: "gx-dynamic-form",
  styleUrl: "dynamic-form.scss",
  shadow: false,
})
export class DynamicForm implements GxComponent {
  private conditions: DynamicFormCondition[] = [];
  private formFieldElements = new Map<string, any>();
  private JSONForm: GxDynamicForm[];
  private messages = new Map<string, FormMessages>();

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

    this.JSONForm[0].Elements.forEach((element) => {
      element.name = this.replaceSpecialChars(element.name);
      this.addConditionsOfElement(element);
    });
  }

  componentDidLoad() {
    const elements = this.element.querySelectorAll(
      "gx-checkbox, gx-switch, gx-edit, gx-radio-group, gx-select"
    );

    // Store element references
    elements.forEach((element) => {
      element.addEventListener("change", () => {
        this.checkRules();
      });

      this.formFieldElements.set(element.id, element);
    });

    // Set element maxlength
    this.JSONForm[0].Elements.forEach((element) => {
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
        this.handleData();
      });
  }

  private addConditionsOfElement(element: DynamicFormElement) {
    if (element.Rules == null) {
      return;
    }

    element.Rules.forEach((rule) => {
      this.conditions.push({
        id: element.id,
        function: rule.function,
        conditions: this.parseRules(rule.Conditions),
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
    Array.from(this.conditions).forEach((element) => {
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
    conditional.split("&&|\\||").forEach((condition) => {
      const parsedCondition = this.buildCondition(condition);

      const result = eval(parsedCondition);

      if (result && this.messages.get(id.toString()) === undefined) {
        const elemName = this.replaceSpecialChars(
          this.JSONForm[0].Elements.find(
            (element) => element.id.toString() === id.toString()
          ).name
        );

        const indexCondition = condition.indexOf("");
        const msgCondition = condition.substring(indexCondition + 1);

        this.messages.set(id.toString(), {
          type: type,
          message: `${elemName} ${msgCondition}`,
        });
      }
    });
  }

  /**
   * This method remove a message from message list
   * @param {string} id - the id of the element that caused the message
   */
  private removeMessage(id: string) {
    this.messages.delete(id.toString());
  }

  private parseRules(conditions: DynamicFormRuleCondition[]) {
    let parsedCond = "";

    conditions.forEach((condition) => {
      const logicalOperator =
        conditions[conditions.length - 1] != condition
          ? this.decodeLogical(condition.cndEval) + " "
          : "";

      parsedCond += [
        condition.cndElemId,
        this.decodeOperator(condition.operator),
        condition.cndValue,
        logicalOperator,
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
    this.JSONForm[0].Elements.forEach((element) => {
      const input = this.formFieldElements.get(element.id.toString());
      element.value = input.value;
    });
    this.onSubmitForm.emit(this.JSONForm[0]);
  }

  private decodeOperator(operator: number) {
    // @ts-expect-error:
    return arithmeticalDictionary[operator];
  }

  private decodeLogical(condition: number) {
    // @ts-expect-error:
    return logicalDictionary[condition];
  }

  render() {
    const options = {
      inputCssClass: this.inputCssClass,
      readonly: this.readonly,
    };

    return (
      <Host>
        {this.JSONForm[0] &&
          this.JSONForm[0].Elements.map((element) => {
            return (
              <gx-form-field
                cssClass={this.inputCssClass}
                label-caption={element.name}
                label-position="left"
                id={"form-field-" + element.id}
              >
                {renderElement(element, options)}
              </gx-form-field>
            );
          })}
        <slot></slot>
      </Host>
    );
  }
}
