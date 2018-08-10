type Constructor<T> = new (...args: any[]) => T;
export function FormFieldRender<T extends Constructor<{}>>(Base: T) {
  return class extends Base {
    element: HTMLElement;
    id: string;

    labelCaption: string;
    labelPosition: string;

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

      classList.push(this.LABEL_WIDTH_BY_POSITION[this.labelPosition]);

      if (this.labelPosition !== "float") {
        classList.push("col-form-label");
      }

      return classList.join(" ");
    }

    private getInnerControlContainerClass() {
      return this.INNER_CONTROL_WIDTH_BY_LABEL_POSITION[this.labelPosition];
    }

    private shouldRenderLabelBefore() {
      return (
        !this.labelPosition ||
        this.labelPosition === "top" ||
        this.labelPosition === "left" ||
        this.labelPosition === "none"
      );
    }

    componentDidLoad() {
      const innerControl: any = this.element.querySelector("[area='field']");
      if (innerControl && innerControl.getNativeInputId) {
        const nativeInputId = innerControl.getNativeInputId();
        const nativeInput = this.element.querySelector(`#${nativeInputId}`);
        if (nativeInput) {
          nativeInput.setAttribute("data-part", "field");
        }
        if (nativeInputId) {
          this.element
            .querySelector("label")
            .setAttribute("for", nativeInputId);
        }
      }
    }

    renderForRadio(renderLabelBefore: boolean) {
      const labelId = `${this.formFieldId}-label`;
      const label = (
        <div class={this.getLabelCssClass()} id={labelId} data-part="label">
          <div class="label-content">{this.labelCaption}</div>
        </div>
      );
      return (
        <div class="form-group" aria-labelledby={labelId} role="group">
          <div class="row">
            {renderLabelBefore ? label : null}
            <div class={this.getInnerControlContainerClass()}>
              <slot />
            </div>
            {!renderLabelBefore ? label : null}
          </div>
        </div>
      );
    }

    render() {
      const isRadioGroup = !!this.element.querySelector(
        "gx-radio-group[area='field']"
      );
      const renderLabelBefore = this.shouldRenderLabelBefore();

      if (!this.formFieldId) {
        this.formFieldId =
          this.id || `gx-form-field-auto-id-${autoFormFieldId++}`;
      }

      if (isRadioGroup) {
        return this.renderForRadio(renderLabelBefore);
      } else {
        const label = (
          <label class={this.getLabelCssClass()} data-part="label">
            <div class="label-content">{this.labelCaption}</div>
          </label>
        );

        if (this.labelPosition === "float") {
          return (
            <div>
              <slot />
              {label}
            </div>
          );
        } else {
          return (
            <div class="form-group row">
              {renderLabelBefore ? label : null}
              <div class={this.getInnerControlContainerClass()}>
                <slot />
              </div>
              {!renderLabelBefore ? label : null}
            </div>
          );
        }
      }
    }
  };
}

let autoFormFieldId = 0;
