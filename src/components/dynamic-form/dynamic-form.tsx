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

const enum LogicalOperators {
  AND = "&&",
  OR = "||"
}

const enum AritmeticalOperators {
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

@Component({
  tag: "gx-dynamic-form",
  styleUrl: "dynamic-form.scss",
  shadow: false
})
export class DynamicForm implements GxComponent {
  private dynamicElements: any = {};
  private inputs: any[] = [];
  private JSONForm = [];

  @Element() element: HTMLGxDynamicFormElement;

  /**
   * This attribute let you specify the elements, rules and conditions of the dynamic form. Must be a JSON string, based on DynamicForm SDT
   */
  @Prop() readonly elements: string;

  /**
   * This attribute let you specify if this dynamic form is a subgroup of another dynamic form
   */
  @Prop() readonly subgroup: boolean = false;

  /**
   * A css class to set to attributes
   */
  @Prop() readonly inputCssClass: string;

  /**
   * A css class to set to attributes when a error occurs
   */
  @Prop() readonly errorCssClass: string;

  /**
   * A css class to set to attributes when a warning occurs
   */
  @Prop() readonly warningCssClass: string;

  /**
   *  This attribute let you specify if the dynamic form is readonly
   */
  @Prop() readonly readonly: boolean = false;

  /**
   *  This attribute let you specify the entry point to upload files
   */
  @Prop() readonly point: string;

  componentWillLoad() {
    let rules = [];
    this.JSONForm = JSON.parse(this.elements);
    this.JSONForm[0].Elements.forEach(element => {
      element.name = this.replaceSpecialChars(element.name);
      if (element.Rules) {
        element.Rules.forEach(rule => {
          rules.push({
            action: this.decodeFunction(rule.function),
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

    this.element.querySelectorAll("input").forEach(element => {
      element.classList.add(this.inputCssClass);
    });

    this.JSONForm[0].Elements.forEach(element => {
      if (element.type == "character" || element.type == "numeric") {
        const input = document.getElementById(element.id + "__edit");
        input?.setAttribute("maxlength", element.length);
        if (element.display == "textarea") {
          input?.setAttribute("rows", element.rows);
          input?.setAttribute("cols", element.cols);
        }
      }
    });

    document.getElementById("SUBMIT_FORM")?.addEventListener("click", () => {
      this.getFormValues();
      this.onSubmitForm.emit(this.JSONForm[0]);
    });
  }

  /**
   * Emited when the form is submitted
   */
  @Event() onSubmitForm: EventEmitter;

  private replaceSpecialChars(name) {
    return name.replace(/\/nbsp\//g, " ");
  }

  private checkRules() {
    for (const i in this.dynamicElements) {
      for (const j in this.dynamicElements[i]) {
        const targeted = this.inputs.find(
          input => input.id.toString() === i.toString()
        );
        const input = document.getElementById(i.toString() + "__edit");
        const gxEditForm = this.getEditFormParentNode(targeted);
        const condition = this.buildCondition(
          this.dynamicElements[i][j].conditions
        );
        const result = eval(condition);
        switch (this.dynamicElements[i][j].action) {
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
            } else {
              targeted.element.classList.remove(this.errorCssClass);
              input.classList.add(this.inputCssClass);
              input.classList.remove(this.errorCssClass);
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
            } else {
              targeted.element.classList.remove(this.warningCssClass);
              input.classList.add(this.inputCssClass);
              input.classList.remove(this.warningCssClass);
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

  private parseRules(conditions) {
    let cond = "";
    conditions.forEach(condition => {
      cond +=
        condition.cndElemId +
        " " +
        this.decodeOperator(condition.operator) +
        " " +
        condition.cndValue +
        (conditions[conditions.length - 1] != condition
          ? " " + this.decodeLogical(condition.cndEval) + " "
          : "");
    });
    return cond;
  }

  // Get all form form values and concatenate them into a string
  // elements      | Elem1ToFind || ArithmeticOperator || ValueToCompare || LogicalOperator || Elem2ToFind || ArithmeticOperator || ValueToCompare || LogicalOperator ||     ...
  // array index   |      0      ||          1         ||       2        ||        3        ||      4      ||          5         ||        6       ||        7        ||     ...
  // Example       | Only Uruguayan citizens older than 18 years old can vote
  // Example array |     Id_1    ||          1         ||   'Uruguayan'  ||        1        ||    Id_2     ||          4         ||       '18'     ||
  private buildCondition(cond) {
    const splited = cond.split(" ");
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
    return document.getElementById("form-field-" + element.id);
  }

  private getFormValues() {
    this.JSONForm[0].Elements.forEach(element => {
      const input = this.inputs.find(
        input => input.id.toString() === element.id.toString()
      );
      if (element.type === "upload") {
        const file = document.getElementById(
          element.id + "__edit"
        )[0] as HTMLInputElement;
        if (input.element.value) {
          this.postFormData(file, element);
        } else element.value = "";
      } else element.value = input.element.value;
    });
  }

  private postFormData(file, element) {
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

  private decodeFunction(func) {
    switch (func) {
      case "assign":
        return RuleTypes.ASSIGN;
      case "disable":
        return RuleTypes.DISABLE;
      case "enable":
        return RuleTypes.ENABLE;
      case "error":
        return RuleTypes.ERROR;
      case "hide":
        return RuleTypes.HIDE;
      case "msg":
        return RuleTypes.MSG;
      case "reload":
        return RuleTypes.RELOAD;
      case "show":
        return RuleTypes.SHOW;
    }
  }

  private decodeOperator(operator) {
    switch (operator) {
      case 1:
        return AritmeticalOperators.EQUAL;
      case 2:
        return AritmeticalOperators.DISTINCT;
      case 3:
        return AritmeticalOperators.GREAT;
      case 4:
        return AritmeticalOperators.GREATOREQUAL;
      case 5:
        return AritmeticalOperators.LESS;
      case 6:
        return AritmeticalOperators.LESSOREQUAL;
    }
  }

  private decodeLogical(cond) {
    switch (cond) {
      case 0:
        return LogicalOperators.OR;
      case 1:
        return LogicalOperators.AND;
    }
  }

  private getElementValue(element) {
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

  private getComponentType(type, display) {
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

  private getEditType(type) {
    switch (type) {
      case "character":
        return "text";
      case "date":
        return "date";
      case "dateTime":
        return "datetime-local";
      case "password":
        return "password";
      case "email":
        return "email";
      case "numeric":
        return "number";
      case "upload":
        return "file";
    }
  }

  private renderGxEdit(element) {
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
          id={element.id}
          disabled={false}
          readonly={this.readonly}
          value={this.getElementValue(element)}
        ></gx-edit>
      </gx-form-field>
    );
  }

  private renderGxRadioGroup(element) {
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
          id={element.id}
          disabled={false}
          readonly={this.readonly}
          value={this.getElementValue(element)}
        >
          {element.Values.map(value => {
            return (
              <gx-radio-option
                caption={this.replaceSpecialChars(value.description)}
                value={value.id}
              ></gx-radio-option>
            );
          })}
        </gx-radio-group>
      </gx-form-field>
    );
  }

  private renderGxDynamicForm(element) {
    return (
      <gx-dynamic-form
        subgroup={true}
        elements={"[" + JSON.stringify(element) + "]"}
      ></gx-dynamic-form>
    );
  }

  private renderGxSelect(element) {
    return (
      <gx-form-field
        cssClass={this.inputCssClass}
        label-caption={element.name}
        label-position="left"
        id={"form-field-" + element.id}
      >
        <gx-select
          cssClass={this.inputCssClass}
          id={element.id}
          disabled={false}
          placeholder="-"
          readonly={this.readonly}
          value={this.getElementValue(element)}
        >
          {element.Values.map(value => {
            return (
              <gx-select-option value={value.id}>
                {this.replaceSpecialChars(value.description)}
              </gx-select-option>
            );
          })}
        </gx-select>
      </gx-form-field>
    );
  }

  private renderGxCheckbox(element) {
    return (
      <gx-form-field
        cssClass={this.inputCssClass}
        label-caption={element.name}
        label-position="left"
        id={"form-field-" + element.id}
      >
        <gx-checkbox
          cssClass={this.inputCssClass}
          id={element.id}
          disabled={false}
          value={this.getElementValue(element)}
          checkedValue={"true"}
          unCheckedValue={"false"}
        ></gx-checkbox>
      </gx-form-field>
    );
  }

  private renderGxSwitch(element) {
    return (
      <gx-form-field
        cssClass={this.inputCssClass}
        label-caption={element.name}
        label-position="left"
        id={"form-field-" + element.id}
      >
        <gx-switch
          cssClass={this.inputCssClass}
          id={element.id}
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
