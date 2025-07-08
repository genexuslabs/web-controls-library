import { Component, Element, Host, Prop, h } from "@stencil/core";
import { Component as GxComponent } from "../common/interfaces";

// Class transforms
import {
  tLabel,
  tLabelContainer,
  tLabelHighlighted,
  tLabelWidth
} from "../common/css-transforms/css-transforms";

interface LabelClasses {
  base: string;
  highlighted: string;
  container: string;
  width: string;
}

/**
 * Cache for computed label classes
 */
const labelClassesCache = new Map<string, LabelClasses>();

const EDIT_TAG_NAME = "gx-edit";

let autoFormFieldId = 0;

@Component({
  shadow: false,
  styleUrl: "form-field.scss",
  tag: "gx-form-field"
})
export class FormField implements GxComponent {
  private formFieldId: string;
  private labelId: string;

  private isRadioGroupInnerControl: boolean;

  // Refs
  private innerLabel: HTMLLabelElement = null;

  @Element() element: HTMLGxFormFieldElement;

  /**
   * A CSS class to set as the `gx-form-field` label element class. This
   * property must match with the `cssClass` used by the inner control.
   * Therefore, to style the `gx-form-field` label, the control applies some
   * transformations to the label to get the appropriate classes.
   */
  @Prop() readonly cssClass: string = null;

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

  /**
   * Computes the associated classes for the control's label.
   * @returns The associated classes for the control's label
   */
  private getLabelClasses(): LabelClasses {
    if (!this.cssClass || this.labelPosition === "none") {
      return { base: "", container: "", highlighted: "", width: "" };
    }

    let result: LabelClasses = labelClassesCache.get(this.cssClass);

    // If the value has not yet been calculated
    if (!result) {
      const splitClasses = this.cssClass.split(" ");

      const baseClass = splitClasses.map(tLabel).join(" ");
      const highlightedClass = splitClasses.map(tLabelHighlighted).join(" ");
      const containerClass = splitClasses.map(tLabelContainer).join(" ");
      const widthClass = splitClasses.map(tLabelWidth).join(" ");

      // Cache for the corresponding value
      result = {
        base: baseClass,
        highlighted: highlightedClass,
        container: containerClass,
        width: widthClass
      };
      labelClassesCache.set(this.cssClass, result);
    }

    return result;
  }

  private shouldFocusTheInnerControlOnLabelClick = (innerControl: any) =>
    (innerControl as HTMLElement).tagName.toLowerCase() === EDIT_TAG_NAME &&
    !innerControl.readonly;

  componentWillLoad() {
    // Sets IDs
    if (!this.formFieldId) {
      this.formFieldId =
        this.element.id || `gx-form-field-auto-id-${autoFormFieldId++}`;
    }
    this.labelId = `${this.formFieldId}-label`;

    this.isRadioGroupInnerControl =
      this.element.querySelector("gx-radio-group") !== null;
  }

  async componentDidLoad() {
    const innerControl: any = this.element.querySelector("[area='field']");

    if (innerControl && innerControl.getNativeInputId) {
      const nativeInputId = await innerControl.getNativeInputId();

      if (!nativeInputId) {
        return;
      }

      const nativeInput = this.element.querySelector(`#${nativeInputId}`);

      if (nativeInput !== null) {
        nativeInput.setAttribute("data-part", "field");
      }

      if (this.labelPosition === "none" || !this.innerLabel) {
        return;
      }

      // Check if the accessibility must be re-implemented
      if (this.shouldFocusTheInnerControlOnLabelClick(innerControl)) {
        this.innerLabel.addEventListener("click", (event: MouseEvent) => {
          event.stopPropagation();
          innerControl.click();
        });
      }
      // The control does not have Shadow DOM
      else {
        this.innerLabel.setAttribute("for", nativeInputId);
        this.innerLabel = null;
      }
    }
  }

  render() {
    const labelPosition = this.labelPosition;

    const shouldAddAriaLabelledBy =
      this.isRadioGroupInnerControl && labelPosition !== "none";

    const labelClasses = this.getLabelClasses();

    return (
      <Host
        role={shouldAddAriaLabelledBy ? "group" : undefined}
        aria-labelledby={shouldAddAriaLabelledBy ? this.labelId : undefined}
        class={{
          [`gx-label-position-${labelPosition}`]: true,
          [labelClasses.width]: true
        }}
      >
        <slot />
        {labelPosition !== "none" && (
          <div
            class={{
              "gx-label-container": true,
              [labelClasses.container]: true,
              "gx-label-right": labelPosition === "right"
            }}
          >
            <label
              id={shouldAddAriaLabelledBy ? this.labelId : undefined}
              class={{
                [labelClasses.base]: true,
                [labelClasses.highlighted]: true
              }}
              ref={el => (this.innerLabel = el as HTMLLabelElement)}
            >
              {this.labelCaption}
            </label>
          </div>
        )}
      </Host>
    );
  }
}
