import {
  Component,
  Element,
  Event,
  EventEmitter,
  Prop,
  h
} from "@stencil/core";
import {
  IClickableComponent,
  IComponent,
  IDisableableComponent,
  IVisibilityComponent
} from "../common/interfaces";
import { ISwipeable, makeSwipeable } from "../common/swipeable";

@Component({
  shadow: false,
  styleUrl: "canvas.scss",
  tag: "gx-canvas"
})
export class Canvas
  implements
    IComponent,
    IVisibilityComponent,
    IDisableableComponent,
    ISwipeable,
    IClickableComponent {
  @Element() element: HTMLElement;

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
   * Emitted when the element is clicked.
   */
  @Event() onClick: EventEmitter;
  // TODO: Implement touch devices events (Tap, DoubleTap, LongTap, SwipeX)

  /**
   * Emitted when the element is swiped.
   */
  @Event() onSwipe: EventEmitter;
  /**
   * Emitted when the element is swiped in upward direction.
   */
  @Event() onSwipeUp: EventEmitter;
  /**
   * Emitted when the element is swiped right direction.
   */
  @Event() onSwipeRight: EventEmitter;
  /**
   * Emitted when the element is swiped downward direction.
   */
  @Event() onSwipeDown: EventEmitter;
  /**
   * Emitted when the element is swiped left direction..
   */
  @Event() onSwipeLeft: EventEmitter;

  handleClick(event: UIEvent) {
    if (this.disabled) {
      return;
    }

    this.onClick.emit(event);
  }

  componentDidLoad() {
    makeSwipeable(this);
  }

  render() {
    this.element.addEventListener("click", this.handleClick.bind(this));

    return <slot />;
  }
}
