import { Component, Element, Prop, h } from "@stencil/core";
import { FormFieldRender } from "../renders/bootstrap/form-field/form-field-render";
import { IComponent } from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "form-field.scss",
  tag: "gx-form-field"
})
export class FormField implements IComponent {
  constructor() {
    this.renderer = new FormFieldRender(this);
  }

  private renderer: FormFieldRender;

  @Element() element: HTMLElement;

  /**
   * The identifier of the control. Must be unique.
   */
  @Prop() id: string;

  /**
   * The text to set as the label of the field.
   */
  @Prop() labelCaption: string;

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

  componentDidLoad() {
    this.renderer.componentDidLoad();
  }

  render() {
    return this.renderer.render({ default: <slot /> });
  }
}
