import { Element, Component, Prop } from "@stencil/core";
import { BaseComponent } from "../common/base-component";
import { FormFieldRender } from "../renders";

@Component({
  tag: "gx-form-field",
  styleUrl: "form-field.scss",
  shadow: false
})
export class FormField extends FormFieldRender(BaseComponent) {
  @Element() element: HTMLElement;

  @Prop() labelCaption: string;
  @Prop() labelClass: string;
  @Prop() labelPosition: "none" | "top" | "right" | "bottom" | "left" | "float";
}
