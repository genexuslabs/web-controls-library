import { h } from "@stencil/core";
import { IRenderer } from "../../../common/interfaces";
import { FormField } from "../../../form-field/form-field";

export class FormFieldRender implements IRenderer {
  constructor(public component: FormField) {}

  private formFieldId: string;

  private LABEL_WIDTH_BY_POSITION = {
    bottom: "col-sm-12",
    float: "",
    left: "col-sm-2",
    none: "sr-only",
    right: "col-sm-2",
    top: "col-sm-12"
  };

  private INNER_CONTROL_WIDTH_BY_LABEL_POSITION = {
    bottom: "col-sm-12",
    float: "",
    left: "col-sm-10",
    none: "col-sm-12",
    right: "col-sm-10",
    top: "col-sm-12"
  };

  private getLabelCssClass() {
    const classList = [];

    classList.push(this.LABEL_WIDTH_BY_POSITION[this.component.labelPosition]);

    if (this.component.labelPosition !== "float") {
      classList.push("col-form-label");
    }

    return classList.join(" ");
  }

  private getInnerControlContainerClass() {
    const className = this.INNER_CONTROL_WIDTH_BY_LABEL_POSITION[
      this.component.labelPosition
    ];
    return {
      [className]: true,
      "d-flex": true
    };
  }

  private shouldRenderLabelBefore() {
    const formField = this.component;

    return (
      !formField.labelPosition ||
      formField.labelPosition === "top" ||
      formField.labelPosition === "left" ||
      formField.labelPosition === "none"
    );
  }

  async componentDidLoad() {
    const formField = this.component;

    const innerControl: any = formField.element.querySelector("[area='field']");
    if (innerControl && innerControl.getNativeInputId) {
      const nativeInputId = await innerControl.getNativeInputId();
      const nativeInput = formField.element.querySelector(`#${nativeInputId}`);
      if (nativeInput) {
        nativeInput.setAttribute("data-part", "field");
      }
      const innerLabel: any = formField.element.querySelector("label");
      if (nativeInputId && innerLabel) {
        innerLabel.setAttribute("for", nativeInputId);
      }
    }
  }

  renderForRadio(renderLabel: boolean, renderLabelBefore: boolean, slot) {
    const labelId = `${this.formFieldId}-label`;
    const label = (
      <div class={this.getLabelCssClass()} id={labelId} data-part="label">
        <div class="label-content">{this.component.labelCaption}</div>
      </div>
    );
    return (
      <div class="form-group mb-0" aria-labelledby={labelId} role="group">
        <div class="row no-gutters">
          {renderLabel && renderLabelBefore ? label : null}
          <div class={this.getInnerControlContainerClass()}>{slot}</div>
          {renderLabel && !renderLabelBefore ? label : null}
        </div>
      </div>
    );
  }

  render(slots) {
    const formField = this.component;

    const isRadioGroup = !!formField.element.querySelector(
      "gx-radio-group[area='field']"
    );
    const renderLabelBefore = this.shouldRenderLabelBefore();
    const renderLabel = formField.labelPosition !== "none";

    if (!this.formFieldId) {
      this.formFieldId =
        formField.id || `gx-form-field-auto-id-${autoFormFieldId++}`;
    }

    if (isRadioGroup) {
      return this.renderForRadio(renderLabel, renderLabelBefore, slots.default);
    } else {
      const label = (
        <label class={this.getLabelCssClass()} data-part="label">
          <div class="label-content">{formField.labelCaption}</div>
        </label>
      );

      const result =
        formField.labelPosition === "float" ? (
          <div>
            {slots.default}
            {label}
          </div>
        ) : (
          <div class="form-group row no-gutters mb-0">
            {renderLabel && renderLabelBefore ? label : null}
            <div class={this.getInnerControlContainerClass()}>
              {slots.default}
            </div>
            {renderLabel && !renderLabelBefore ? label : null}
          </div>
        );

      return [<gx-bootstrap />, result];
    }
  }
}

let autoFormFieldId = 0;
