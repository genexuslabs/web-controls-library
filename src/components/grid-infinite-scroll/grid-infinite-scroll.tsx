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
  h,
  readTask,
  writeTask
} from "@stencil/core";

/**
 * gx-layout reference. Necessary to compute the intersection calculates when
 * the infinite scroll is attached on the window.
 */
let gxLayoutReference: HTMLGxLayoutElement = null;

@Component({
  shadow: true,
  styleUrl: "grid-infinite-scroll.scss",
  tag: "gx-grid-infinite-scroll"
})
export class GridInfiniteScroll implements ComponentInterface {
  /** `true` if the `componentDidLoad()` method was called */
  private didLoad = false;

  /** `true` if the parent grid has `direction = "vertical"` */
  private infiniteScrollSupport = true;

  private thresholdConfiguration: "pixel" | "percentage" = "percentage";
  private thresholdValue = 0;

  private scrollableParentElement: Element | HTMLElement = null;
  private scrollListenerElement: HTMLElement | Element | Window;

  private typeOfParentElementAttached: "virtual-scroller" | "window" | "other" =
    "virtual-scroller";

  // - - - - - - - Variables to implement inverse loading - - - - - - -
  /**
   * When the content overflows the first time, the scroll position correction
   * (`addedHeight`) has to be the difference between the current values of
   * clientHeight and scrollHeight.
   */
  private firstTimeContentOverflow = true;

  /**
   * `true` when the resizeObserver callback is being processed.
   *
   * Since the UI may take some time to be updated when the
   * resize observer callback is executed, we don't have to update interfere
   * with that update. Otherwise, the scroll top positioning may broke.
   *
   * This variable help us to not update the `lastScrollTop` variable in the
   * scroll event.
   */
  private scrollTopIsGoingToBeUpdated = false;

  private resizeObserver: ResizeObserver = null;
  private lastScrollTop = 0;
  private lastScrollHeight = 0;

  // - - - - - - - - -  Variables to debounce checks  - - - - - - - - -
  private needForRAF = true; // To prevent redundant RAF (request animation frame) calls
  private needForRAFResizeObserver = true; // To prevent redundant RAF (request animation frame) calls

  private scrollEventWasNotCauseByTheUser = false;

  @Element() el!: HTMLGxGridInfiniteScrollElement;

  @State() isBusyWaitingForCompleteEvent = false;

  /**
   * This property must be bounded to grid item count property.
   * It's unique purpose is to trigger gxInfinite as many times as needed to fullfill the Container space when the initial batch does not overflow the main container
   */
  @Prop() readonly itemCount: number = 0;

  /**
   * The main layout selector where the infinite scroll is contained.
   */
  @Prop() readonly layoutSelector: string = "gx-layout";

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
  @Prop({ mutable: true }) disabled = false;

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
   * Emitted when the scroll reaches the threshold distance. From within your
   * infinite handler, you must call the infinite scroll's `complete()` method
   * when your async operation has completed.
   */
  @Event({ bubbles: false }) gxInfinite!: EventEmitter<void>;

  @Watch("itemCount")
  handleItemCountChanged(newValue: number, oldValue: number) {
    // The infinite scroll must stay at the top position of the grid content.
    // To make that possible, the infinite scroll is placed as the "first" item
    // of the grid using the current itemCount.
    if (this.position === "top") {
      this.el.style.gridRowStart = `-${newValue + 2}`;
    }

    // In some cases, the following scenario can happen (in this particular order):
    //  - The grid fully loaded all its data.  ----> this.disabled == true
    //  - The grid's data was removed.         ----> this.itemCount == 0
    //  - Some new data is coming to the grid. ----> newValue != 0 && oldValue == 0
    // In this scenario, we have to re-enable the scroll events and set the resizeObserver
    if (this.disabled && newValue !== 0 && oldValue === 0) {
      this.disabled = false;
    }

    // The grid data is removed. Reset the variable
    if (newValue === 0 && oldValue !== 0) {
      this.firstTimeContentOverflow = true;
      this.lastScrollHeight = 0;
      this.lastScrollTop = 0;
    }

    if (
      this.disabled ||
      this.itemCount === 0 || // TODO: Check if this condition is useful
      !this.didLoad ||
      this.isBusyWaitingForCompleteEvent
    ) {
      return;
    }

    this.tryToFetchMoreItems();
  }

  @Watch("threshold")
  protected thresholdChanged(newValue: string) {
    // Threshold in percentage
    if (newValue.lastIndexOf("%") > -1) {
      this.thresholdConfiguration = "percentage";
      this.thresholdValue = parseFloat(newValue) / 100;
    }
    // Threshold in pixel
    else {
      this.thresholdConfiguration = "pixel";
      this.thresholdValue = parseFloat(newValue);
    }
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
    this.scrollTopIsGoingToBeUpdated = true;

    requestAnimationFrame(() => {
      writeTask(() => {
        // Re-enable item requests
        this.isBusyWaitingForCompleteEvent = false;

        this.checkIfTheGridFullyLoaded();
      });
    });
  }

  private checkIfTheGridFullyLoaded() {
    // When the grid loaded all its data, disconnect the resize observer.
    // In the Watch decorator the scroll listener will be disconnected
    if (this.disabled) {
      // Reset variables
      this.scrollTopIsGoingToBeUpdated = false;
      this.needForRAF = true;
      this.needForRAFResizeObserver = true;
    }
    // If the grid has not fully loaded, try to fetch more data
    else if (!this.isBusyWaitingForCompleteEvent) {
      this.tryToFetchMoreItems();
    }
  }

  private tryToFetchMoreItems() {
    // Debounce requests with RAF to ensure that the UI has been updated.
    // Otherwise, multiple requests can be done between animation frames
    // causing the scrollTop to be set at incorrect positions. Also, perform
    // a readTask to ensure the scrollTop property has been updated before
    // trying to read it
    requestAnimationFrame(() => {
      readTask(() => {
        if (this.isBusyWaitingForCompleteEvent) {
          return;
        }

        const shouldFetchMoreItems = this.infiniteScrollIsVisibleInViewport();

        if (shouldFetchMoreItems) {
          this.isBusyWaitingForCompleteEvent = true;
          this.gxInfinite.emit();
        }
      });
    });
  }

  /**
   * Determine if the infinite scroll is visible in the scrollable parent
   * element based on the configured threshold.
   *
   * @returns `true` if the infinite scroll element is visible in the viewport
   * of the scrollable parent element. In other words, `true` if the "last items"
   * of the scrollable parent element intersect the threshold set in the
   * infinite scroll.
   */
  private infiniteScrollIsVisibleInViewport(): boolean {
    const elementIsDisplayed = getComputedStyle(this.el).display !== "none";

    if (!elementIsDisplayed) {
      return false;
    }

    const threshold = this.getThresholdValue();
    const scrollTop = this.getScrollableParentScrollTop();

    // If the scroll is "close" to the last item
    if (this.position === "top") {
      return this.typeOfParentElementAttached === "window"
        ? scrollTop <=
            threshold +
              this.el.getBoundingClientRect().y -
              gxLayoutReference.getBoundingClientRect().y
        : scrollTop <= threshold;
    }

    const scrollHeight = this.getScrollableParentScrollHeight();
    const clientHeight = this.getScrollableParentClientHeight();

    /**
     * Determine the amount of scrollable space remaining until the infinite
     * scroll is reached.
     *  - First condition: The infinite scroll could not be at the "bottom: 0" position of the scrollable parent.
     *    The position must be deduced from the window's position.
     *  - Second condition: The infinite scroll is at the "bottom: 0" position of the scrollable parent.
     *    The position is inferred by the parent's scrollTop and parent's heights
     */
    const remainingSizeUntilReachingInfiniteScroll =
      this.typeOfParentElementAttached === "window"
        ? this.el.getBoundingClientRect().y - clientHeight
        : scrollHeight - (scrollTop + clientHeight);

    // If the scroll is "close" to the last item
    return remainingSizeUntilReachingInfiniteScroll <= threshold;
  }

  private getThresholdValue() {
    const parentElementClientHeight = this.getScrollableParentClientHeight();

    return this.thresholdConfiguration === "pixel"
      ? this.thresholdValue
      : parentElementClientHeight * this.thresholdValue;
  }

  private getScrollableParentClientHeight(): number {
    return this.typeOfParentElementAttached === "window"
      ? window.innerHeight
      : this.scrollableParentElement.clientHeight;
  }

  private getScrollableParentScrollHeight(): number {
    return this.scrollableParentElement.scrollHeight;
  }

  private getScrollableParentScrollTop(): number {
    return this.scrollableParentElement.scrollTop;
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
      this.scrollListenerElement = window;

      return window.document.documentElement;
    }

    // If the parent grid has virtual scroller (only when auto-grow = False)
    if (this.viewportSelector) {
      const scrollParent = node.closest(this.viewportSelector);
      if (scrollParent != null) {
        this.scrollListenerElement = scrollParent;

        // When parent scroller is known before hand.
        return scrollParent;
      }
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

      this.scrollListenerElement = node;
      return node;
    }

    // Try with the next parent element
    return this.getScrollableParentToAttachInfiniteScroll(node.parentElement);
  }

  private connectResizeObserver() {
    if (this.resizeObserver) {
      return;
    }

    // Inverse loading is not supported when the scroll is attached to the window.
    // The current implementation "supports" this scenario, but since this use
    // case changes the position of the scroll every time the grid retrieves
    // data, unexpected behaviors will occur.
    // Also, Android does not support Inverse Loading in this scenario either.
    if (
      this.infiniteScrollSupport &&
      this.position === "top" &&
      this.typeOfParentElementAttached !== "window"
    ) {
      this.resizeObserver = new ResizeObserver(
        this.resizeObserverCallbackForInverseLoading
      );
    }
    // In any other case, a resize observer should be set up to detect changes
    // in the grid size and trigger the algorithm to deduce if there is
    // necessary to fetch more data.
    else {
      this.resizeObserver = new ResizeObserver(
        this.resizeObserverCallbackToCheckGridState
      );
    }

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
    const elementToWatch: Element =
      this.typeOfParentElementAttached === "virtual-scroller"
        ? this.scrollableParentElement.lastElementChild
        : this.el.parentElement;

    this.resizeObserver.observe(elementToWatch);
  }

  private resizeObserverCallbackForInverseLoading = () => {
    const currentScrollHeight = this.getScrollableParentScrollHeight();
    const currentClientHeight = this.getScrollableParentClientHeight();
    const currentScrollTop = this.getScrollableParentScrollTop();

    /**
     * The amount of height added since the last fetch. In other word, it
     * determines how much the `scrollTop` should be offset to keep the last
     * position of the items.
     */
    let addedHeight = currentScrollHeight - this.lastScrollHeight;

    // In most cases, when the resize observer interrupts the first time
    // the content might be overflowed (clientHeight < scrollHeight), but
    // "lastScrollTop == 0". In that case, "lastScrollTop" must be the
    // difference between scrollHeight and clientHeight
    if (
      this.firstTimeContentOverflow &&
      currentScrollTop === 0 &&
      currentClientHeight < currentScrollHeight
    ) {
      this.firstTimeContentOverflow = false;
      addedHeight = currentScrollHeight - currentClientHeight;
    }

    // Store the new scroll height value
    this.lastScrollHeight = currentScrollHeight;

    // Store the new scroll top value
    this.scrollTopIsGoingToBeUpdated = true;
    this.lastScrollTop += addedHeight;

    this.scrollEventWasNotCauseByTheUser = true;

    // Update the scroll top on the scrollable parent
    this.scrollableParentElement.scrollTop = this.lastScrollTop;

    requestAnimationFrame(() => {
      writeTask(() => {
        this.scrollTopIsGoingToBeUpdated = false;

        // Check the state of the grid, if there is not a request in progress
        if (!this.isBusyWaitingForCompleteEvent) {
          this.checkIfTheGridFullyLoaded();
        }
      });
    });
  };

  private resizeObserverCallbackToCheckGridState = () => {
    if (!this.needForRAFResizeObserver) {
      return;
    }
    this.needForRAFResizeObserver = false; // No need to call RAF up until next frame

    requestAnimationFrame(() => {
      this.needForRAFResizeObserver = true; // RAF now consumes the movement instruction so a new one can come

      // Check the state of the grid, if there is not a request in progress
      if (!this.isBusyWaitingForCompleteEvent) {
        this.checkIfTheGridFullyLoaded();
      }
    });
  };

  private disconnectResizeObserver() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }

  private handleScrollChange = () => {
    if (this.scrollEventWasNotCauseByTheUser) {
      this.scrollEventWasNotCauseByTheUser = false;
      return;
    }

    // Store the new scroll top value, if the current scroll position is not
    // going to be updated
    if (!this.scrollTopIsGoingToBeUpdated) {
      this.lastScrollTop = this.getScrollableParentScrollTop();
    }

    if (
      this.disabled ||
      !this.needForRAF ||
      this.isBusyWaitingForCompleteEvent
    ) {
      return;
    }
    this.needForRAF = false; // No need to call RAF up until next frame

    requestAnimationFrame(() => {
      readTask(() => {
        this.needForRAF = true; // RAF now consumes the movement instruction so a new one can come

        if (this.isBusyWaitingForCompleteEvent) {
          return;
        }
        const shouldFetchMoreItems = this.infiniteScrollIsVisibleInViewport();

        if (shouldFetchMoreItems) {
          this.isBusyWaitingForCompleteEvent = true;
          this.gxInfinite.emit();
        }
      });
    });
  };

  private setScrollListener(shouldSetEvent: boolean) {
    if (shouldSetEvent) {
      this.scrollListenerElement.addEventListener(
        "scroll",
        this.handleScrollChange,
        { passive: true }
      );
    }
    // Remove the event
    else {
      // If the component is disconnected before the `getScrollableParentToAttachInfiniteScroll()`
      // method is performed, the variable reference will be undefined
      this.scrollListenerElement?.removeEventListener(
        "scroll",
        this.handleScrollChange
      );
    }
  }

  /**
   * Store scrollable parent element reference and compute infinite scrolling
   * support.
   */
  componentWillLoad() {
    // Update threshold value
    this.thresholdChanged(this.threshold);

    // Update initial position in the grid
    if (this.position === "top") {
      this.el.style.gridRowStart = `-${this.itemCount + 2}`;
    }
  }

  componentDidLoad() {
    this.scrollableParentElement =
      this.getScrollableParentToAttachInfiniteScroll(this.el);

    // Store the gx-layout reference since is necessary to compute the
    // intersection calculates when the infinite scroll is attached on the
    // window.
    if (
      this.typeOfParentElementAttached === "window" &&
      gxLayoutReference == null
    ) {
      gxLayoutReference = document.querySelector(this.layoutSelector);
    }

    const gridComponent = this.el.closest(
      ".gx-grid-base"
    ) as HTMLGxGridSmartCssElement;

    // Horizontal Orientation not supported
    this.infiniteScrollSupport =
      gridComponent && gridComponent.direction === "vertical";

    // Read at the best moment the scrollHeight and clientHeight values
    readTask(() => {
      const currentScrollHeight = this.getScrollableParentScrollHeight();
      const currentClientHeight = this.getScrollableParentClientHeight();

      requestAnimationFrame(() => {
        writeTask(() => {
          // Update at the best moment the initial scrollTop
          if (this.infiniteScrollSupport && this.position === "top") {
            this.scrollableParentElement.scrollTop =
              currentScrollHeight - currentClientHeight;
          }

          // After the scrollTop update, set algorithms to check the grid state
          requestAnimationFrame(() => {
            this.didLoad = true;

            this.handleItemCountChanged(this.itemCount, this.itemCount);
            this.connectResizeObserver();

            this.setScrollListener(true);
          });
        });
      });
    });
  }

  disconnectedCallback() {
    this.scrollEventWasNotCauseByTheUser = false;
    this.isBusyWaitingForCompleteEvent = false;

    this.disconnectResizeObserver();

    // Remove scroll event since the parent element could be the window or
    // other element that will not be removed from the DOM
    this.setScrollListener(false);
  }

  render() {
    return (
      <Host
        class={{
          "not-loading": !this.isBusyWaitingForCompleteEvent
        }}
        aria-hidden={!this.isBusyWaitingForCompleteEvent ? "true" : undefined}
      >
        <slot />
      </Host>
    );
  }
}
