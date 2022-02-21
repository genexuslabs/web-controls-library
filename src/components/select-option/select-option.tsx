import {
  Component,
  Element,
  Event,
  EventEmitter,
  Prop,
  Watch,
  h,
  Host
} from "@stencil/core";
import {
  Component as GxComponent,
  DisableableComponent
} from "../common/interfaces";

@Component({
  shadow: false,
  tag: "gx-select-option"
})
export class SelectOption implements GxComponent, DisableableComponent {
  @Element() element: HTMLGxSelectOptionElement;

  /**
   * Indicates that the control is selected by default.
   */
  @Prop({ mutable: true }) selected = false;

  /**
   * A CSS class to set as the inner `input` element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * This attribute lets you specify if the element is disabled.
   * If disabled, it will not fire any user interaction related event
   * (for example, click event).
   */
  @Prop() readonly disabled = false;

  /**
   * The initial value of the control.
   */
  @Prop({ mutable: true }) value: string;

  /**
   * The `change` event is emitted when a change to the element's value is
   * committed by the user.
   */
  @Event() change: EventEmitter;

  /**
   * Emitted when the option is selected.
   */
  @Event() gxSelect: EventEmitter;

  /**
   * Emitted when the option is disabled.
   */
  @Event() gxDisable: EventEmitter;

  /**
   * Emitted when the option loads.
   */
  @Event() gxSelectDidLoad: EventEmitter;

  /**
   * Emitted when the option unloads.
   */
  @Event() gxSelectDidUnload: EventEmitter;

  @Watch("selected")
  protected selectedChanged(isSelected: boolean) {
    if (isSelected) {
      this.gxSelect.emit({ select: this });
    }
  }

  @Watch("disabled")
  protected disabledChanged(isDisabled: boolean) {
    if (isDisabled) {
      this.gxDisable.emit({ select: this });
    }
  }

  @Watch("value")
  protected valueChanged() {
    this.change.emit({ select: this });
  }

  componentDidLoad() {
    this.gxSelectDidLoad.emit({ select: this });
  }

  disconnectedCallback() {
    this.gxSelectDidUnload.emit({ select: this });
  }

  render() {
    return (
      <Host aria-hidden="true" hidden={true}>
        <slot />
      </Host>
    );
  }
}
