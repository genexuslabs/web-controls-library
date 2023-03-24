import {
  Component,
  Element,
  Event,
  EventEmitter,
  Listen,
  Method,
  Prop,
  State,
  Watch,
} from "@stencil/core";
import { SelectRender } from "../renders/bootstrap/select/select-render";
import { FormComponent } from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "select.scss",
  tag: "gx-select",
})
export class Select implements FormComponent {
  constructor() {
    this.renderer = new SelectRender(this);
  }

  private renderer: SelectRender;

  // Used to show the placeholder when no options are selected
  private anOptionHasBeenSelected = false;

  @State() protected options: any[] = [];
  private didLoad: boolean;

  @Element() element: HTMLGxSelectElement;

  /**
   * A CSS class to set as the `gx-select` element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * This attribute lets you specify how this element will behave when hidden.
   *
   * | Value        | Details                                                                     |
   * | ------------ | --------------------------------------------------------------------------- |
   * | `keep-space` | The element remains in the document flow, and it does occupy space.         |
   * | `collapse`   | The element is removed form the document flow, and it doesn't occupy space. |
   */
  @Prop() readonly invisibleMode: "collapse" | "keep-space" = "collapse";

  /**
   * This attribute lets you specify if the element is disabled.
   * If disabled, it will not fire any user interaction related event
   * (for example, click event).
   */
  @Prop() readonly disabled = false;

  /**
   * This attribute indicates that the user cannot modify the value of the control.
   * Same as [readonly](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-readonly)
   * attribute for `input` elements.
   */
  @Prop() readonly readonly: boolean;

  /**
   * Render a text input showing a list of suggested elements.
   */
  @Prop() suggest: boolean;

  /**
   * Text that appears in the form control when it has no value set
   */
  @Prop() placeholder: string;

  /**
   * The initial value of the control. Setting the value automatically selects
   * the corresponding option.
   */
  @Prop({ mutable: true }) value: string;

  /**
   * The `input` event is emitted when a change to the element's value is
   * committed by the user.
   */
  @Event() input: EventEmitter;

  private getChildOptions() {
    return Array.from(this.element.querySelectorAll("gx-select-option")).map(
      (option: any) => {
        return {
          disabled: option.disabled,
          innerText: option.innerText,
          selected: option.selected,
          value: option.value,
        };
      }
    );
  }

  private updateOptions(options: any[]) {
    this.options = options;
    this.renderer.updateOptions(options);
  }

  @Watch("value")
  valueChanged() {
    // the select value just changed
    this.anOptionHasBeenSelected = false;

    const optionsElement = Array.from(
      this.element.querySelectorAll("gx-select-option")
    );
    // let's set the new check state to all options
    // regardless if it is checked or not
    optionsElement.forEach((option) => {
      if (option.value === this.value) {
        // the option value matches with the new select value
        // let's check this option
        option.selected = true;
        this.anOptionHasBeenSelected = true;
      } else {
        // the option value doesn't match
        // with the new select value
        // let's uncheck this option
        option.selected = false;
      }
      // if the new select value doesn't
      // match with any option, all options
      // will be unchecked
    });
    // after set the new check state to all options
    // let's update the options list
    this.updateOptions(
      optionsElement.map((option: any) => {
        return {
          disabled: option.disabled,
          innerText: option.innerText,
          selected: option.selected,
          value: option.value,
        };
      })
    );
    if (this.didLoad) {
      // emit the new value
      this.input.emit({ value: this.value });
    }
  }

  @Listen("gxSelectDidLoad")
  onSelectOptionDidLoad(ev: HTMLSelectOptionElementEvent) {
    const option = ev.target;
    if (this.value) {
      // check if the select has a setted value
      if (this.value === option.value) {
        // this select has a value and this
        // option equals the correct select value
        // so let's set this option as checked
        option.selected = true;
      } else {
        // if the option value does not match
        // with the select value,
        // the option will be unchecked
        // regardless if the option was
        // initialized as checked
        option.selected = false;
      }
    } else {
      // if the select does not have a value
      // let's look for options initialized as checked
      if (option.selected) {
        // this option was initialized as checked,
        // so let's set the select's value
        // equals to the checked option value
        this.value = option.value;
      }
      // If there is no option checked
      // and no value was set in the select,
      // it will keep undefined until any
      // change or checked option
    }
    this.updateOptions(this.getChildOptions());
  }

  @Listen("gxSelectDidUnload")
  onSelectOptionDidUnload() {
    this.updateOptions(this.getChildOptions());
  }

  @Listen("gxDisable")
  onSelectOptionDisable() {
    this.updateOptions(this.getChildOptions());
  }

  @Listen("onChange")
  onSelectOptionChange() {
    this.updateOptions(this.getChildOptions());
  }

  @Listen("gxSelect")
  onSelectOptionSelect(ev: HTMLSelectOptionElementEvent) {
    this.options.forEach((option) => {
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
  async getNativeInputId() {
    return this.renderer.getNativeInputId();
  }

  componentDidLoad() {
    this.didLoad = true;
  }

  render() {
    return this.renderer.render(this.anOptionHasBeenSelected);
  }
}

interface HTMLSelectOptionElementEvent extends CustomEvent {
  target: any;
}
