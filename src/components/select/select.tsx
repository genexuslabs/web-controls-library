import {
  Component,
  Element,
  Event,
  EventEmitter,
  Listen,
  Method,
  Prop,
  State,
  Watch
} from "@stencil/core";
import { BaseComponent } from "../common/base-component";
import { SelectRender } from "../renders";
import { IHTMLSelectOptionElementEvent } from "../select-option/select-option";

@Component({
  shadow: false,
  tag: "gx-select"
})
export class Select extends SelectRender(BaseComponent) {
  @State() protected options: any[] = [];
  private didLoad: boolean;

  @Element() protected element: HTMLElement;

  /**
   * A CSS class to set as the inner `input` element class.
   */
  @Prop() cssClass: string;

  /**
   * This attribute lets you specify how this element will behave when hidden.
   *
   * | Value        | Details                                                                     |
   * | ------------ | --------------------------------------------------------------------------- |
   * | `keep-space` | The element remains in the document flow, and it does occupy space.         |
   * | `collapse`   | The element is removed form the document flow, and it doesn't occupy space. |
   */
  @Prop() invisibleMode: "collapse" | "keep-space" = "collapse";

  /**
   * This attribute lets you specify if the element is disabled.
   * If disabled, it will not fire any user interaction related event
   * (for example, click event).
   */
  @Prop() disabled = false;

  /**
   * The identifier of the control. Must be unique.
   */
  @Prop() id: string;

  /**
   * This attribute indicates that the user cannot modify the value of the control.
   * Same as [readonly](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-readonly)
   * attribute for `input` elements.
   */
  @Prop() readonly: boolean;

  /**
   * The initial value of the control. Setting the value automatically selects
   * the corresponding option.
   */
  @Prop({ mutable: true })
  value: string;

  /**
   * The `change` event is emitted when a change to the element's value is
   * committed by the user.
   */
  @Event() onChange: EventEmitter;

  // private getValueFromEvent(event: UIEvent): string {
  //   return event.target && (event.target as HTMLInputElement).value;
  // }
  //
  // handleChange(event: UIEvent) {
  //   this.value = this.getValueFromEvent(event);
  //   this.onChange.emit(event);
  // }

  // @Watch("disabled")
  // disabledChanged() {
  //   this.setDisabled();
  // }

  private getChildOptions() {
    return Array.from(this.element.querySelectorAll("gx-select-option")).map(
      (option: any) => ({
        disabled: option.getAttribute("disabled") !== null,
        innerText: option.innerText,
        selected: option.getAttribute("selected") !== null,
        value: option.value
      })
    );
  }

  @Watch("value")
  valueChanged() {
    // this select's value just changed
    // double check the option with this value is selected
    if (this.value === undefined) {
      // set to undefined
      // ensure all that are checked become unchecked
      this.options.filter(o => o.selected).forEach(option => {
        option.selected = false;
      });
    } else {
      let hasSelected = false;

      this.options.forEach(option => {
        if (option.value === this.value) {
          if (!option.selected && !hasSelected) {
            // correct value for this option
            // but this option isn't selected yet
            // and we haven't found a selected yet
            // so SELECT IT!
            option.selected = true;
          } else if (hasSelected && option.selected) {
            // somehow we've got multiple options
            // with the same value, but only one can be selected
            option.selected = false;
          }

          // remember we've got a selected option now
          hasSelected = true;
        } else if (option.selected) {
          // this option doesn't have the correct value
          // and it's also selected, so let's unselect it
          option.selected = false;
        }
      });
    }

    if (this.didLoad) {
      // emit the new value
      this.onChange.emit({ value: this.value });
    }
  }

  @Listen("gxSelectDidLoad")
  onSelectOptionDidLoad(ev: IHTMLSelectOptionElementEvent) {
    const option = ev.target;
    this.options = this.getChildOptions();

    if (this.value !== undefined && option.value === this.value) {
      // this select has a value and this
      // option equals the correct select value
      // so let's check this option
      option.selected = true;
    } else if (this.value === undefined && option.selected) {
      // this select does not have a value
      // but this option is checked, so let's set the
      // select's value from the checked option
      this.value = option.value;
    } else if (option.selected) {
      // if it doesn't match one of the above cases, but the
      // option is still checked, then we need to uncheck it
      option.selected = false;
    }
  }

  @Listen("gxSelectDidUnload")
  onSelectOptionDidUnload() {
    this.options = this.getChildOptions();
  }

  @Listen("gxDisable")
  onSelectOptionDisable() {
    this.options = this.getChildOptions();
  }

  @Listen("onChange")
  onSelectOptionChange() {
    this.options = this.getChildOptions();
  }

  @Listen("gxSelect")
  onSelectOptionSelect(ev: IHTMLSelectOptionElementEvent) {
    this.options.forEach(option => {
      if (option === ev.target) {
        if (option.value !== this.value) {
          this.value = option.value;
        }
      } else {
        option.selected = false;
      }
    });
  }

  /**
   * Returns the id of the inner `input` element (if set).
   */
  @Method()
  getNativeInputId() {
    return super.getNativeInputId();
  }

  setDisabled() {
    this.options.forEach(option => {
      option.disabled = this.disabled;
    });
  }

  componentDidLoad() {
    this.setDisabled();
    this.didLoad = true;
  }

  hostData() {
    return {
      role: "combobox"
    };
  }
}
