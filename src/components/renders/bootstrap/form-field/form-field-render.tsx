type Constructor<T> = new (...args: any[]) => T;
export function FormFieldRender<T extends Constructor<{}>>(Base: T) {
  return class extends Base {
    element: HTMLElement;

    labelCaption: string;
    labelClass: string;
    labelPosition: string;

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

      if (this.labelClass) {
        classList.push(this.labelClass);
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
        const forAttr = innerControl.getNativeInputId();
        if (forAttr) {
          this.element.querySelector("label").setAttribute("for", forAttr);
        }
      }
    }

    renderForRadio(renderLabelBefore: boolean) {
      const legend = (
        <legend class={this.getLabelCssClass()}>{this.labelCaption}</legend>
      );
      return (
        <fieldset class="form-group">
          <div class="row">
            {renderLabelBefore ? legend : null}
            <div class={this.getInnerControlContainerClass()}>
              <slot />
            </div>
            {!renderLabelBefore ? legend : null}
          </div>
        </fieldset>
      );
    }

    render() {
      const isRadioGroup = !!this.element.querySelector(
        "gx-radio-group[area='field']"
      );
      const renderLabelBefore = this.shouldRenderLabelBefore();

      if (isRadioGroup) {
        return this.renderForRadio(renderLabelBefore);
      } else {
        const label = (
          <label class={this.getLabelCssClass()}>{this.labelCaption}</label>
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
