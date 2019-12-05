import {
  Component,
  Element,
  Event,
  EventEmitter,
  Prop,
  h
} from "@stencil/core";
import {
  ClickableComponent,
  Component as GxComponent,
  DisableableComponent,
  VisibilityComponent
} from "../common/interfaces";
import { Swipeable, makeSwipeable } from "../common/swipeable";

@Component({
  shadow: false,
  styleUrl: "canvas.scss",
  tag: "gx-canvas"
})
export class Canvas
  implements
    GxComponent,
    VisibilityComponent,
    DisableableComponent,
    Swipeable,
    ClickableComponent {
  constructor() {
    this.handleClick = this.handleClick.bind(this);
  }

  @Element() element: HTMLGxCanvasElement;

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

  private handleClick(event: UIEvent) {
    if (this.disabled) {
      return;
    }

    this.onClick.emit(event);
  }

  componentDidLoad() {
    makeSwipeable(this);
  }

  render() {
    this.element.addEventListener("click", this.handleClick);

    return <slot />;
  }
}
