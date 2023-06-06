import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  Host,
  Method,
  Prop,
  State,
  Watch,
  h,
  writeTask
} from "@stencil/core";

const PRECISION_OFFSET = 2;

@Component({
  shadow: true,
  styleUrl: "grid-infinite-scroll.scss",
  tag: "gx-grid-infinite-scroll"
})
export class GridInfiniteScroll implements ComponentInterface {
  /**
   * `true` if the `componentDidLoad()` method was called
   */
  private didLoad = false;

  private hasInfiniteScroll = false;

  /**
   * `true` if the parent grid is gx-grid-smart-css and has
   * `direction = "vertical"`
   */
  private infiniteScrollSupport = true;

  // Stored values
  private lastClientHeight = 0;
  private lastScrollHeight = 0;
  private lastScrollTop = 0;

  // Observers
  private ioWatcher: IntersectionObserver;
  private resizeWatcher: ResizeObserver;

  // Refs
  private scrollableParent: Element | HTMLElement;

  private typeOfParentElementAttached: "virtual-scroller" | "window" | "other" =
    "virtual-scroller";

  @Element() el!: HTMLGxGridInfiniteScrollElement;

  @State() waitingForData = false;

  /**
   * If `true`, the infinite scroll will be hidden and scroll event listeners
   * will be removed.
   *
   * Set this to `false` to disable the infinite scroll from actively trying to
   * receive new data while reaching the threshold. This is useful when it is
   * known that there is no more data that can be added, and the infinite
   * scroll is no longer needed.
   */
  @Prop() readonly canFetchMoreData: boolean = false;
  @Watch("canFetchMoreData")
  handleCanFetchMoreDataChange(canFetch: boolean) {
    if (!this.didLoad) {
      return;
    }

    // The grid has data provider and there is data that can be loaded
    if (canFetch) {
      this.setInfiniteScroll();
    }
    // All data was fully loaded
    else {
      this.disconnectInfiniteScroll();
    }
  }

  /**
   * This property must be bounded to grid item count property.
   * It's unique purpose is to update the position of the control in the
   * inverse loading scenario (`position === "top"`).
   */
  @Prop() readonly recordCount: number = 0;
  @Watch("recordCount")
  handleItemCountChanged(newValue: number) {
    if (!this.didLoad) {
      return;
    }

    // The infinite scroll must stay at the top position of the grid content.
    // To make that possible, the infinite scroll is placed as the "first" item
    // of the grid using the current recordCount.
    if (this.position === "top") {
      this.el.style.gridRowStart = `-${newValue + 2}`;
    }
  }

  /**
   * The position of the infinite scroll element.
   * The value can be either `top` or `bottom`. When `position === "top"`, the
   * control also implements inverse loading.
   */
  @Prop() readonly position: "top" | "bottom" = "bottom";

  /**
   * The threshold distance from the bottom of the content to call the
   * `infinite` output event when scrolled.
   * The threshold value can be either a percent, or in pixels. For example,
   * use the value of `10%` for the `infinite` output event to get called when
   * the user has scrolled 10% from the bottom of the page. Use the value
   * `100px` when the scroll is within 100 pixels from the bottom of the page.
   */
  @Prop() readonly threshold: string = "15%";
  @Watch("threshold")
  protected thresholdChanged() {
    if (!this.canFetchMoreData && !this.waitingForData) {
      return;
    }
    // @todo TODO: Check if this works when a new threshold comes
    this.disconnectInfiniteScroll();
    this.setInfiniteScroll();
  }

  /**
   * Emitted when the scroll reaches the threshold distance. From within your
   * infinite handler, you must call the infinite scroll's `complete()` method
   * when your async operation has completed.
   */
  @Event({ bubbles: false }) gxInfinite!: EventEmitter<void>;

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
    this.waitingForData = false;
    this.checkIfCanFetchMoreData();
  }

  /**
   * This functions unobserves and re-observes the infinite scroll element when
   * new items are added in the grid. Without this configuration, if the grid
   * has no scroll even after new items are added, the intersection observer
   * won't fire a new interruption because it is still visible in the viewport.
   */
  private checkIfCanFetchMoreData() {
    // The infinite scroll was disconnected
    if (!this.canFetchMoreData || !this.ioWatcher) {
      return;
    }
    this.ioWatcher.unobserve(this.el);

    // Try to re-observe the element when the DOM is updated
    requestAnimationFrame(() => {
      writeTask(() => {
        // The infinite scroll was disconnected
        if (!this.canFetchMoreData || !this.ioWatcher) {
          return;
        }

        this.ioWatcher.observe(this.el);
      });
    });
  }

  private emitInfiniteEvent = () => {
    if (this.waitingForData) {
      return;
    }

    this.waitingForData = true;
    this.gxInfinite.emit();
  };

  private setInfiniteScroll() {
    // The observer was already set
    if (!this.infiniteScrollSupport || this.ioWatcher) {
      return;
    }

    requestAnimationFrame(() => {
      writeTask(() => {
        this.hasInfiniteScroll = true;

        const options: IntersectionObserverInit = {
          root: this.scrollableParent,
          rootMargin: this.threshold
        };

        this.ioWatcher = new IntersectionObserver(entries => {
          if (!entries[0].isIntersecting) {
            return;
          }
          this.emitInfiniteEvent();
        }, options);

        this.ioWatcher.observe(this.el);
      });
    });
  }

  private disconnectInfiniteScroll() {
    if (this.ioWatcher) {
      this.ioWatcher.disconnect();
      this.ioWatcher = null;
    }
  }

  /**
   * @todo TODO: Test this function when the element has an iframe as its parent element.
   *
   * Recursively look for a parent element in the `node`'s tree to calculate the
   * infinite scroll visibility and attach the scroll event listener.
   *
   * Considerations:
   *  - This algorithm starts with `node` === `this.el`.
   *  - If the parent grid has auto-grow = False, the return value should be
   *    the virtual scroller that is used in the parent grid.
   * @param node An element that will serve to recursively look up the parent element of `this.el` to attach the scroll event listener.
   * @returns A parent element of `node` in which the scroll event listener must be attached.
   */
  private getScrollableParentToAttachInfiniteScroll(
    node: Element | HTMLElement
  ): Element | HTMLElement {
    if (node === null || node === window.document.documentElement) {
      this.typeOfParentElementAttached = "window";

      return window.document.documentElement;
    }

    // We try to search for first scrollable parent element.
    const overflowY = window.getComputedStyle(node).overflowY;

    // The last condition must be used, as the parent container could clip
    // (overflow: hidden) its overflow. In that scenario, the scroll is "hidden"
    // or "locked" but set
    if (
      overflowY === "auto" ||
      overflowY === "scroll" ||
      node.scrollHeight > node.clientHeight
    ) {
      this.typeOfParentElementAttached =
        node.tagName === "virtual-scroller" ? "virtual-scroller" : "other";

      return node;
    }

    // Try with the next parent element
    return this.getScrollableParentToAttachInfiniteScroll(node.parentElement);
  }

  private trackLastScrollTop = () => {
    this.lastScrollTop = this.scrollableParent.scrollTop;
  };

  private setInverseLoading() {
    // Inverse loading is not supported when the scroll is attached to the window.
    // The current implementation "supports" this scenario, but since this use
    // case changes the position of the scroll every time the grid retrieves
    // data, unexpected behaviors will occur.
    // Also, Android does not support Inverse Loading in this scenario either.
    if (this.typeOfParentElementAttached === "window") {
      return;
    }

    this.resizeWatcher = new ResizeObserver(() => {
      // Current values
      const currentClientHeight = this.scrollableParent.clientHeight;
      const currentScrollHeight = this.scrollableParent.scrollHeight;

      const firstTimeThatContentOverflows =
        this.lastClientHeight === this.lastScrollHeight &&
        currentClientHeight < currentScrollHeight;

      // Must set the scroll at the bottom position
      if (firstTimeThatContentOverflows) {
        const newScrollTop = currentScrollHeight - currentClientHeight;

        this.lastClientHeight = currentClientHeight;
        this.lastScrollHeight = currentScrollHeight;
        this.scrollableParent.scrollTop = newScrollTop;
        return;
      }

      const scrollWasAtTheBottom =
        this.lastScrollHeight <=
        this.lastClientHeight + this.lastScrollTop + PRECISION_OFFSET;

      // The scroll is only adjusted if the grid has a data provider or the
      // scroll was at the bottom position. When the grid has a data provider
      // items can be loaded via infinite scroll, so the scroll position needs
      // adjusted when new items are added
      if (this.hasInfiniteScroll || scrollWasAtTheBottom) {
        const scrollOffset = currentScrollHeight - this.lastScrollHeight;
        const clientHeightOffset =
          currentClientHeight < this.lastClientHeight
            ? this.lastClientHeight - currentClientHeight
            : 0;

        const newScrollTop =
          this.lastScrollTop +
          scrollOffset +
          clientHeightOffset +
          (scrollWasAtTheBottom ? PRECISION_OFFSET : 0);

        this.scrollableParent.scrollTop = newScrollTop;
      }

      this.lastClientHeight = currentClientHeight;
      this.lastScrollHeight = currentScrollHeight;
    });

    /**
     * In the virtual scroller this element represents the container
     * (`.scrollable-content`) of the cells:
     * ```
     *   <gx-grid-smart-css>
     *     <virtual-scroller slot="grid-content">
     *       <div class="total-padding"></div>
     *       <div class="scrollable-content">
     *         <gx-grid-smart-cell>...</gx-grid-smart-cell>
     *         <gx-grid-smart-cell>...</gx-grid-smart-cell>
     *         ...
     *       </div>
     *     </virtual-scroller>
     *     ...
     *   </gx-grid-smart-css>
     * ```
     *
     * When there is no virtual scroller, this element represents the cell
     * container (`[slot="grid-content"]`)
     * ```
     *   <gx-grid-smart-css>
     *     <div slot="grid-content">
     *       <gx-grid-smart-cell>...</gx-grid-smart-cell>
     *       <gx-grid-smart-cell>...</gx-grid-smart-cell>
     *       ...
     *       <gx-grid-infinite-scroll></gx-grid-infinite-scroll>
     *     </div>
     *     ...
     *   </gx-grid-smart-css>
     * ```
     */
    const overflowingContent: Element =
      this.typeOfParentElementAttached === "virtual-scroller"
        ? this.scrollableParent.lastElementChild
        : this.el.parentElement;

    this.resizeWatcher.observe(overflowingContent);
    this.resizeWatcher.observe(this.scrollableParent);

    this.scrollableParent.addEventListener("scroll", this.trackLastScrollTop);
  }

  private disconnectInverseLoading() {
    if (this.resizeWatcher) {
      this.resizeWatcher.disconnect();
      this.resizeWatcher = null;

      this.scrollableParent.removeEventListener(
        "scroll",
        this.trackLastScrollTop
      );
    }
  }

  componentDidLoad() {
    this.didLoad = true;

    // Set infinite scroll position if position === "top"
    this.handleItemCountChanged(this.recordCount);

    const gridComponent = this.el.closest(
      "gx-grid-smart-css"
    ) as HTMLGxGridSmartCssElement;

    this.infiniteScrollSupport =
      gridComponent && gridComponent.direction === "vertical";

    if (!this.infiniteScrollSupport) {
      return;
    }

    this.scrollableParent = this.getScrollableParentToAttachInfiniteScroll(
      this.el
    );

    // Inverse Loading
    if (this.position === "top") {
      this.setInverseLoading();
    }

    // Infinite Scroll
    if (this.canFetchMoreData) {
      this.setInfiniteScroll();
    }
  }

  disconnectedCallback() {
    this.disconnectInfiniteScroll();
    this.disconnectInverseLoading();
  }

  render() {
    return (
      <Host
        class={this.waitingForData ? "gx-loading" : undefined}
        aria-hidden={!this.waitingForData ? "true" : undefined}
      >
        {this.waitingForData && <slot />}
      </Host>
    );
  }
}
