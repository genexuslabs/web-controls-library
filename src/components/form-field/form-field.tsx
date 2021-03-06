import { Component, Element, Prop, h } from "@stencil/core";
import { FormFieldRender } from "../renders/bootstrap/form-field/form-field-render";
import { Component as GxComponent } from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "form-field.scss",
  tag: "gx-form-field"
})
export class FormField implements GxComponent {
  constructor() {
    this.renderer = new FormFieldRender(this);
  }

  private renderer: FormFieldRender;

  @Element() element: HTMLGxFormFieldElement;

  /**
   * This attribute lets you specify how this element will behave when hidden.
   *
   * | Value        | Details                                                                     |
   * | ------------ | --------------------------------------------------------------------------- |
   * | `keep-space` | The element remains in the document flow, and it does occupy space.         |
   * | `collapse`   | The element is removed form the document flow, and it doesn't occupy space. |
   */
  @Prop() readonly invisibleMode: "collapse" | "keep-space" = "collapse";

  /**
   * The text to set as the label of the field.
   */
  @Prop() readonly labelCaption: string;

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
  @Prop() readonly labelPosition:
    | "none"
    | "top"
    | "right"
    | "bottom"
    | "left"
    | "float";

  componentDidLoad() {
    this.renderer.componentDidLoad();
  }

  render() {
    return this.renderer.render({ default: <slot /> });
  }
}
