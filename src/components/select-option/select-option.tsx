import {
  Component,
  Element,
  Event,
  EventEmitter,
  Prop,
  Watch
} from "@stencil/core";
import { IComponent, IDisableableComponent } from "../common/interfaces";

@Component({
  shadow: false,
  tag: "gx-select-option"
})
export class SelectOption implements IComponent, IDisableableComponent {
  @Element() element;

  /**
   * Indicates that the control is selected by default.
   */
  @Prop({ mutable: true })
  selected: boolean;

  /**
   * A CSS class to set as the inner `input` element class.
   */
  @Prop() cssClass: string;

  /**
   * This attribute lets you specify if the element is disabled.
   * If disabled, it will not fire any user interaction related event
   * (for example, click event).
   */
  @Prop() disabled = false;

  /**
   * The initial value of the control.
   */
  @Prop({ mutable: true })
  value: string;

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

  componentDidUnload() {
    this.gxSelectDidUnload.emit({ select: this });
  }

  hostData() {
    return {
      "aria-hidden": "true",
      hidden: true
    };
  }

  render() {
    return <slot />;
  }
}
