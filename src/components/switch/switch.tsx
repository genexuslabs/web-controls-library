import {
  Component,
  Element,
  Event,
  EventEmitter,
  Method,
  Prop,
  Watch
} from "@stencil/core";
import { SwitchRender } from "../renders/bootstrap/switch/switch-render";
import {
  IComponent,
  IDisableableComponent,
  IVisibilityComponent
} from "../common/interfaces";
@Component({
  host: {
    role: "switch"
  },
  shadow: false,
  styleUrl: "switch.scss",
  tag: "gx-switch"
})
export class Switch
  implements IComponent, IDisableableComponent, IVisibilityComponent {
  constructor() {
    this.renderer = new SwitchRender(this);
  }

  private renderer: SwitchRender;

  @Element() element;

  /**
   * Attribute that provides the caption to the control.
   */
  @Prop() caption: string;
  /**
   * Indicates if switch control is checked by default.
   */
  @Prop({ mutable: true })
  checked: boolean;
  /**
   * This attribute allows you specify if the element is disabled.
   * If disabled, it will not trigger any user interaction related event
   * (for example, click event).
   */
  @Prop() disabled = false;

  /**
   * The control id. Must be unique per control!
   */
  @Prop() id: string;

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
   * The 'change' event is emitted when a change to the element's value is committed by the user.
   */
  @Event() onChange: EventEmitter;

  /**
   * Returns the id of the inner `input` element (if set).
   */
  @Method()
  getNativeInputId() {
    return this.renderer.getNativeInputId();
  }

  @Watch("checked")
  protected checkedChanged() {
    this.renderer.checkedChanged();
  }

  render() {
    return this.renderer.render();
  }
}
