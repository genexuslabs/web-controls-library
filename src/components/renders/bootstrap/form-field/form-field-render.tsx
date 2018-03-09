type Constructor<T> = new (...args: any[]) => T;
export function FormFieldRender<T extends Constructor<{}>>(Base: T) {
  return class extends Base {
    element: HTMLElement;

    labelCaption: string;
    labelClass: string;
    labelPosition: string;

    private LABEL_WIDTH_BY_POSITION = {
      top: "col-sm-12",
      right: "col-sm-2",
      bottom: "col-sm-12",
      left: "col-sm-2",
      float: "",
      none: "sr-only"
    };

    private INNER_CONTROL_WIDTH_BY_LABEL_POSITION = {
      top: "col-sm-12",
      right: "col-sm-10",
      bottom: "col-sm-12",
      left: "col-sm-10",
      float: "",
      none: "col-sm-12"
    };

    private getLabelCssClass() {
      const classList = [];

      classList.push(this.LABEL_WIDTH_BY_POSITION[this.labelPosition]);

      if (this.labelPosition != "float") {
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
        this.labelPosition == "top" ||
        this.labelPosition == "left" ||
        this.labelPosition == "none"
      );
    }

    componentDidLoad() {
      const innerControl: any = this.element.querySelector("[area='field']");
      const forAttr = innerControl.getNativeInputId();
      this.element.querySelector("label").setAttribute("for", forAttr);
    }

    render() {
      const label = (
        <label class={this.getLabelCssClass()}>{this.labelCaption}</label>
      );

      const renderLabelBefore = this.shouldRenderLabelBefore();

      if (this.labelPosition == "float") {
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
  };
}
