import { Component, Element, Prop } from "@stencil/core";
import { BaseComponent } from "../common/base-component";
import { FormFieldRender } from "../renders";

@Component({
  shadow: false,
  styleUrl: "form-field.scss",
  tag: "gx-form-field"
})
export class FormField extends FormFieldRender(BaseComponent) {
  @Element() element: HTMLElement;

  /**
   * The text to set as the label of the field.
   */
  @Prop() labelCaption: string;

  /**
   * A CSS class to set as the inner `label` element class.
   */
  @Prop() labelClass: string;

  /**
   * The position where the label will be located, relative to the edit control. The supported values are:
   *
   * * `"top"`: The label is located above the edit control.
   * * `"right"`: The label is located at the right side of the edit control.
   * * `"bottom"`: The label is located below the edit control.
   * * `"left"`: The label is located at the left side of the edit control.
   * * `"float"`: The label is shown as a placeholder when the edit control's value is empty. When the value is not empty, the label floats and locates above the edit control.
   * * `"none"`: The label is rendered, but hidden.
   */
  @Prop() labelPosition: "none" | "top" | "right" | "bottom" | "left" | "float";
}
