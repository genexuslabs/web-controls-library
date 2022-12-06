export interface GxDynamicForm {
  id: string;
  version: string;
  name: string;
  Elements: DynamicFormElement[];
}

export interface DynamicFormElement {
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

export interface DynamicFormRuleCondition {
  id: number;
  cndElemId: number;
  operator: number;
  cndValue: string;
  cndEval: number;
}

export interface DynamicFormCondition {
  id: number;
  function: string;
  conditions: string;
}

export interface FormMessages {
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

export enum RuleTypes {
  SHOW = "show",
  ENABLE = "enable",
  HIDE = "hide",
  DISABLE = "disable",
  ERROR = "error",
  MSG = "msg",
  RELOAD = "reload",
  ASSIGN = "assign"
}

export const logicalDictionary = {
  0: LogicalOperators.OR,
  1: LogicalOperators.AND
};

export const arithmeticalDictionary = {
  1: ArithmeticalOperators.EQUAL,
  2: ArithmeticalOperators.DISTINCT,
  3: ArithmeticalOperators.GREAT,
  4: ArithmeticalOperators.GREATOREQUAL,
  5: ArithmeticalOperators.LESS,
  6: ArithmeticalOperators.LESSOREQUAL
};

export const typeDictionary = {
  character: "text",
  date: "date",
  datetime: "datetime-local",
  password: "password",
  email: "email",
  numeric: "number",
  upload: "file"
};

export const componentTypeDictionary = {
  "numeric-slider": "GX-SLIDER",
  "numeric-rating": "GX-RATING",
  "boolean-switch": "GX-SWITCH",
  "boolean-default": "GX-CHECKBOX",
  "enum-radio": "GX-RADIO-GROUP",
  "enum-default": "GX-SELECT",
  "group-default": "GX-DYNAMIC-FORM"
};

export enum Messages {
  ERROR = "error",
  WARNING = "warning"
}
