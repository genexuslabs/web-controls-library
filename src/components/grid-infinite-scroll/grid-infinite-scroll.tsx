import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  Method,
  Prop,
  State,
  Watch,
  Host,
  h
} from "@stencil/core";

@Component({
  shadow: false,
  styleUrl: "grid-infinite-scroll.scss",
  tag: "gx-grid-infinite-scroll"
})
export class GridInfiniteScroll implements ComponentInterface {
  private scrollEl?: HTMLElement = null;

  @Element() el!: HTMLGxGridInfiniteScrollElement;
  @State() isLoading = false;

  /**
   * This property must be bounded to grid item count property.
   * It's unique purpose is to trigger gxInfinite as many times as needed to fullfill the Container space when the intial batch does not overflow the main container
   */
  @Prop() readonly itemCount: number = 0;

  /**
   * The threshold distance from the bottom
   * of the content to call the `infinite` output event when scrolled.
   * The threshold value can be either a percent, or
   * in pixels. For example, use the value of `10%` for the `infinite`
   * output event to get called when the user has scrolled 10%
   * from the bottom of the page. Use the value `100px` when the
   * scroll is within 100 pixels from the bottom of the page.
   */
  @Prop() readonly threshold: string = "15%";

  /**
   * If `true`, the infinite scroll will be hidden and scroll event listeners
   * will be removed.
   *
   * Set this to true to disable the infinite scroll from actively
   * trying to receive new data while scrolling. This is useful
   * when it is known that there is no more data that can be added, and
   * the infinite scroll is no longer needed.
   */
  @Prop() readonly disabled: boolean = false;

  /**
   * The position of the infinite scroll element.
   * The value can be either `top` or `bottom`.
   */
  @Prop() readonly position: "top" | "bottom" = "bottom";

  /**
   * The View Port parent element selector where the infinite component would be attached to
   * and listening to Scroll Events.
   */
  @Prop() readonly viewportSelector: string;

  /**
   * Emitted when the scroll reaches
   * the threshold distance. From within your infinite handler,
   * you must call the infinite scroll's `complete()` method when
   * your async operation has completed.
   */
  @Event({ bubbles: false }) gxInfinite!: EventEmitter<void>;

  @Watch("disabled")
  protected disabledChanged() {
    if (this.disabled) {
      this.isLoading = false;
    }
  }

  private getScrollParent(node: any): HTMLElement {
    if (node === null) {
      return null;
    }

    if (node === window.document.documentElement) {
      return node;
    }

    if (this.viewportSelector) {
      const scrollParent = node.closest(this.viewportSelector);
      if (scrollParent != null) {
        //When parent scroller is known before hand.
        return scrollParent;
      }
    }

    //We try to search for first scrollable parent element.
    const overflow = window.getComputedStyle(node).overflowY;
    if (node.scrollHeight > node.clientHeight || overflow === "scroll") {
      return node;
    }

    return this.getScrollParent(node.parentNode);
  }

  disconnectedCallback() {
    this.scrollEl = null;
  }

  /**
   * Call `complete()` within the `gxInfinite` output event handler when
   * your async operation has completed. For example, the `loading`
   * state is while the app is performing an asynchronous operation,
   * such as receiving more data from an AJAX request to add more items
   * to a data list. Once the data has been received and UI updated, you
   * then call this method to signify that the loading has completed.
   * This method will change the infinite scroll's state from `loading`
   * to `enabled`.
   */
  @Method()
  async complete() {
    const scrollEl = this.scrollEl;
    if (!this.isLoading || scrollEl === null) {
      return;
    }
    this.isLoading = false;
  }

  render() {
    return (
      <Host
        class={{
          "infinite-scroll-enabled": !this.disabled,
          "infinite-scroll-loading": this.isLoading
        }}
      />
    );
  }
}
