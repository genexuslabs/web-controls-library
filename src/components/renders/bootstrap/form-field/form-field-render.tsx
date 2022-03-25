import { h, Host } from "@stencil/core";
import { Renderer } from "../../../common/interfaces";
import { FormField } from "../../../form-field/form-field";

// Class transforms
import {
  tLabel,
  tLabelHighlighted
} from "../../../common/css-transforms/css-transforms";

let autoFormFieldId = 0;

export class FormFieldRender implements Renderer {
  constructor(private component: FormField) {}

  private formFieldId: string;

  private LABEL_WIDTH_BY_POSITION = {
    bottom: "label-bottom",
    float: "",
    left: "label-left",
    none: "sr-only",
    right: "label-right",
    top: "label-top"
  };

  private INNER_CONTROL_WIDTH_BY_LABEL_POSITION = {
    bottom: "field-label-bottom",
    float: "",
    left: "field-label-left",
    none: "field-label-top",
    right: "field-label-right",
    top: "field-label-top"
  };

  private getInnerControlContainerClass() {
    const className = this.INNER_CONTROL_WIDTH_BY_LABEL_POSITION[
      this.component.labelPosition
    ];
    return {
      [className]: true,
      "d-flex": true
    };
  }

  async componentDidLoad() {
    const formField = this.component;

    const innerControl: any = formField.element.querySelector("[area='field']");
    if (innerControl && innerControl.getNativeInputId) {
      const nativeInputId = await innerControl.getNativeInputId();
      if (nativeInputId) {
        const nativeInput = formField.element.querySelector(
          `#${nativeInputId}`
        );
        if (nativeInput !== null) {
          nativeInput.setAttribute("data-part", "field");
        }
        const innerLabel: any = formField.element.querySelector("label");
        if (nativeInputId && innerLabel) {
          innerLabel.setAttribute("for", nativeInputId);
        }
      }
    }
  }

  renderForRadio(renderLabel: boolean, slot) {
    const labelId = `${this.formFieldId}-label`;
    const formField = this.component;
    const labelPosition = formField.labelPosition;

    const label = (
      <div
        class={{
          [this.LABEL_WIDTH_BY_POSITION[labelPosition]]: true,
          "gx-label": true
        }}
        id={labelId}
      >
        <div class="gx-label-content">{formField.labelCaption}</div>
      </div>
    );

    const labelPositionClassName = `label-position-${labelPosition}`;
    const isValidLabelPosition =
      labelPosition === "top" ||
      labelPosition === "right" ||
      labelPosition === "bottom" ||
      labelPosition === "left";

    return (
      <div class="form-group mb-0" aria-labelledby={labelId} role="group">
        <div
          class={{
            "radio-group": true,
            "no-gutters": true,
            [labelPositionClassName]: isValidLabelPosition
          }}
        >
          <div class={this.getInnerControlContainerClass()}>{slot}</div>
          {renderLabel && label}
        </div>
      </div>
    );
  }

  render(slots) {
    const formField = this.component;
    const labelPosition = formField.labelPosition;

    const isRadioGroup =
      formField.element.querySelector("gx-radio-group[area='field']") !== null;
    const renderLabel = labelPosition !== "none";

    /*  Since the control can recieve more than one class, we apply the 
        "tLabel" and "tLabelHighlighted" transforms for each class.
    */
    const labelSplitClasses =
      renderLabel && formField.cssClass ? formField.cssClass.split(" ") : [];

    const labelBaseClass = labelSplitClasses.map(tLabel).join(" ");

    const labelHighlightedClass = labelSplitClasses
      .map(tLabelHighlighted)
      .join(" ");

    if (!this.formFieldId) {
      this.formFieldId =
        formField.element.id || `gx-form-field-auto-id-${autoFormFieldId++}`;
    }

    if (isRadioGroup) {
      return this.renderForRadio(renderLabel, slots.default);
    } else {
      const label = (
        <label
          class={{
            [this.LABEL_WIDTH_BY_POSITION[labelPosition]]: true,
            "gx-label": true,
            [labelBaseClass]: true,
            [labelHighlightedClass]: true
          }}
        >
          <div class="gx-label-content">{formField.labelCaption}</div>
        </label>
      );

      const result =
        labelPosition === "float" ? (
          <div>
            {slots.default}
            {label}
          </div>
        ) : (
          <div
            class={{
              "form-group": true,
              "no-gutters": true,
              "mb-0": true,
              "flex-column-reverse": labelPosition === "top",
              "flex-column": labelPosition === "bottom",
              "flex-row": labelPosition === "right",
              "flex-row-reverse": labelPosition === "left"
            }}
          >
            <div class={this.getInnerControlContainerClass()}>
              {slots.default}
            </div>
            {renderLabel && label}
          </div>
        );

      return (
        <Host>
          <gx-bootstrap />
          {result}
        </Host>
      );
    }
  }
}
