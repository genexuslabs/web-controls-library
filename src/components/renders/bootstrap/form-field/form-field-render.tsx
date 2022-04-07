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
  private innerLabel: HTMLLabelElement = null;

  private LABEL_WIDTH_BY_POSITION = {
    bottom: "",
    float: "",
    left: "side-label",
    none: "",
    right: "side-label right-label",
    top: ""
  };

  private INNER_CONTROL_WIDTH_BY_LABEL_POSITION = {
    bottom: "",
    float: "",
    left: "side-field",
    none: "",
    right: "side-field",
    top: ""
  };

  private getInnerControlContainerClass() {
    const className = this.INNER_CONTROL_WIDTH_BY_LABEL_POSITION[
      this.component.labelPosition
    ];
    return {
      [className]: true
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

        if (formField.labelPosition === "none" || this.innerLabel == null) {
          return;
        }

        this.innerLabel.setAttribute("for", nativeInputId);
        this.innerLabel = null;
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
      <div
        class={{
          "form-field-group": true,
          [labelPositionClassName]: isValidLabelPosition
        }}
        aria-labelledby={labelId}
        role="group"
      >
        <div class={this.getInnerControlContainerClass()}>{slot}</div>
        {renderLabel && label}
      </div>
    );
  }

  render(slots) {
    const formField = this.component;
    const labelPosition = formField.labelPosition;

    const isRadioGroup =
      formField.element.querySelector("gx-radio-group[area='field']") !== null;
    const renderLabel = labelPosition !== "none";

    /*  Since the control can receive more than one class, we apply the
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
        <div
          class={{
            [this.LABEL_WIDTH_BY_POSITION[labelPosition]]: true,
            "gx-label-container": true
          }}
        >
          <label
            class={{
              "gx-label": true,
              [labelBaseClass]: true,
              [labelHighlightedClass]: true
            }}
            ref={el => (this.innerLabel = el as HTMLLabelElement)}
          >
            {formField.labelCaption}
          </label>
        </div>
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
              "form-field-group": true,
              "label-position-top": labelPosition === "top",
              "label-position-bottom": labelPosition === "bottom",
              "label-position-right": labelPosition === "right",
              "label-position-left": labelPosition === "left"
            }}
          >
            <div class={this.getInnerControlContainerClass()}>
              {slots.default}
            </div>
            {renderLabel && label}
          </div>
        );

      return <Host>{result}</Host>;
    }
  }
}
