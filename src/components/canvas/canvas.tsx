import {
  Component,
  Element,
  Event,
  EventEmitter,
  Prop,
  h,
  State,
  Host
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
  @Event() gxClick: EventEmitter;
  // TODO: Implement touch devices events (Tap, DoubleTap, LongTap, SwipeX)

  /**
   * Emitted when the element is swiped.
   */
  @Event() swipe: EventEmitter;

  /**
   * Emitted when the element is swiped in upward direction.
   */
  @Event() swipeUp: EventEmitter;

  /**
   * Emitted when the element is swiped right direction.
   */
  @Event() swipeRight: EventEmitter;

  /**
   * Emitted when the element is swiped downward direction.
   */
  @Event() swipeDown: EventEmitter;

  /**
   * Emitted when the element is swiped left direction.
   */
  @Event() swipeLeft: EventEmitter;

  @State() width: number = null;
  @State() height: number = null;

  private watchForItemsObserver: MutationObserver;

  private handleClick(event: UIEvent) {
    if (this.disabled) {
      return;
    }

    this.gxClick.emit(event);
  }

  componentDidLoad() {
    makeSwipeable(this);
    this.watchForItemsObserver = new MutationObserver(mutationsList => {
      const shouldUpdateDimensions = mutationsList.some(
        mutation =>
          mutation.type === "attributes" || mutation.type === "childList"
      );
      if (shouldUpdateDimensions) {
        this.calculateDimensions();
      }
    });
    this.watchForItemsObserver.observe(this.element, { childList: true });
    this.calculateDimensions();
  }

  disconnectedCallback() {
    if (this.watchForItemsObserver !== undefined) {
      this.watchForItemsObserver.disconnect();
      this.watchForItemsObserver = undefined;
    }
  }

  private calculateDimensions() {
    const dimensions = Array.from(this.element.childNodes)
      .filter(node => node instanceof HTMLElement)
      .map((element: HTMLElement) => [
        element.clientWidth + element.offsetLeft,
        element.clientHeight + element.offsetTop
      ]);
    this.width = Math.max(...dimensions.map(tuple => tuple[0]));
    this.height = Math.max(...dimensions.map(tuple => tuple[1]));
  }

  render() {
    this.element.addEventListener("click", this.handleClick);

    return (
      <Host
        style={{
          width:
            this.width !== null && this.width != 0
              ? `${this.width}px`
              : this.element.style.width, // Default width
          height:
            this.height !== null && this.height != 0
              ? `${this.height}px`
              : this.element.style.height // Default height
        }}
      >
        <slot />
      </Host>
    );
  }
}
