import { h, Host } from "@stencil/core";
import { Renderer } from "../../../common/interfaces";
import { FormField } from "../../../form-field/form-field";

// Class transforms
import {
  tLabel,
  tLabelContainer,
  tLabelHighlighted,
  tLabelPositionLeft,
  tLabelPositionRight
} from "../../../common/css-transforms/css-transforms";

let autoFormFieldId = 0;

export class FormFieldRender implements Renderer {
  constructor(private component: FormField) {}

  private formFieldId: string;
  private innerLabel: HTMLLabelElement = null;

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

  renderForRadio(
    renderLabel: boolean,
    labelBaseClass: string,
    labelHighlightedClass: string,
    labelContainerClass: string,
    labelLeftOrRightPositionClass: string,
    slot
  ) {
    const labelId = `${this.formFieldId}-label`;
    const formField = this.component;
    const labelPosition = formField.labelPosition;

    const label = (
      <div
        class={{
          "gx-label-container": true,
          [labelContainerClass]: true,
          "right-label": labelPosition === "right"
        }}
        data-part={!!formField.cssClass ? "label-container" : undefined}
      >
        <label
          class={{
            [labelBaseClass]: !!formField.cssClass,
            [labelHighlightedClass]: true
          }}
          id={labelId}
        >
          {formField.labelCaption}
        </label>
      </div>
    );

    const labelPositionClassName = `label-position-${labelPosition}`;
    const shouldCustomLabelPosition =
      !!formField.cssClass &&
      (labelPosition === "left" || labelPosition === "right");

    return (
      <div
        class={{
          "form-field-group": true,
          [labelPositionClassName]: true,
          [labelLeftOrRightPositionClass]: shouldCustomLabelPosition
        }}
        aria-labelledby={labelId}
        role="group"
      >
        <div class="gx-inner-control-container">{slot}</div>
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
      renderLabel && !!formField.cssClass ? formField.cssClass.split(" ") : [];

    const labelBaseClass = labelSplitClasses.map(tLabel).join(" ");

    const labelHighlightedClass = labelSplitClasses
      .map(tLabelHighlighted)
      .join(" ");

    const labelContainerClass = labelSplitClasses
      .map(tLabelContainer)
      .join(" ");

    const labelLeftOrRightPositionClass =
      labelPosition === "left"
        ? labelSplitClasses.map(tLabelPositionLeft).join(" ")
        : labelSplitClasses.map(tLabelPositionRight).join(" ");

    if (!this.formFieldId) {
      this.formFieldId =
        formField.element.id || `gx-form-field-auto-id-${autoFormFieldId++}`;
    }

    if (isRadioGroup) {
      return this.renderForRadio(
        renderLabel,
        labelBaseClass,
        labelHighlightedClass,
        labelContainerClass,
        labelLeftOrRightPositionClass,
        slots.default
      );
    } else {
      const label = (
        <div
          class={{
            "gx-label-container": true,
            [labelContainerClass]: true,
            "right-label": labelPosition === "right"
          }}
          data-part={!!formField.cssClass ? "label-container" : undefined}
        >
          <label
            class={{
              [labelBaseClass]: !!formField.cssClass,
              [labelHighlightedClass]: true
            }}
            ref={el => (this.innerLabel = el as HTMLLabelElement)}
          >
            {formField.labelCaption}
          </label>
        </div>
      );

      const labelPositionClassName = `label-position-${labelPosition}`;
      const shouldCustomLabelPosition =
        !!formField.cssClass &&
        (labelPosition === "left" || labelPosition === "right");

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
              [labelPositionClassName]: true,
              [labelLeftOrRightPositionClass]: shouldCustomLabelPosition
            }}
          >
            <div class="gx-inner-control-container">{slots.default}</div>
            {renderLabel && label}
          </div>
        );

      return <Host>{result}</Host>;
    }
  }
}
