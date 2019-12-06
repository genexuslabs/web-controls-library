import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  Method,
  Prop,
  QueueApi,
  State,
  Watch
} from "@stencil/core";

@Component({
  shadow: false,
  styleUrl: "grid-infinite-scroll.scss",
  tag: "gx-grid-infinite-scroll"
})
export class GridInfiniteScroll implements ComponentInterface {
  constructor() {
    this.onScroll = this.onScroll.bind(this);
  }

  private thrPx = 0;
  private thrPc = 0;
  private scrollEl?: HTMLElement;
  private scrollListenerEl?: any;
  private didFire = false;
  private isBusy = false;
  private attachedToWindow = false;
  private attached = false;

  @Element() el!: HTMLElement;
  @State() isLoading = false;

  /**
   * This property must be bounded to grid item count property.
   * It's unique purpose is to trigger gxInfinite as many times as needed to fullfill the Container space when the intial batch does not overflow the main container
   */
  @Prop() itemCount = 0;

  @Prop({ context: "queue" })
  queue!: QueueApi;

  /**
   * The threshold distance from the bottom
   * of the content to call the `infinite` output event when scrolled.
   * The threshold value can be either a percent, or
   * in pixels. For example, use the value of `10%` for the `infinite`
   * output event to get called when the user has scrolled 10%
   * from the bottom of the page. Use the value `100px` when the
   * scroll is within 100 pixels from the bottom of the page.
   */
  @Prop() threshold = "15%";

  /**
   * If `true`, the infinite scroll will be hidden and scroll event listeners
   * will be removed.
   *
   * Set this to true to disable the infinite scroll from actively
   * trying to receive new data while scrolling. This is useful
   * when it is known that there is no more data that can be added, and
   * the infinite scroll is no longer needed.
   */
  @Prop() disabled = false;

  /**
   * The position of the infinite scroll element.
   * The value can be either `top` or `bottom`.
   */
  @Prop() position: "top" | "bottom" = "bottom";

  /**
   * Emitted when the scroll reaches
   * the threshold distance. From within your infinite handler,
   * you must call the infinite scroll's `complete()` method when
   * your async operation has completed.
   */
  @Event() gxInfinite!: EventEmitter<void>;

  componentWillLoad() {
    this.itemCountChanged();
  }

  @Watch("itemCount")
  public itemCountChanged() {
    if (this.disabled || this.itemCount === 0) {
      return;
    }

    setTimeout(() => {
      let emitInfinite = false;
      this.ensure();
      if (this.attached) {
        const containerHeight = this.scrollEl.offsetHeight;
        const contentHeight = this.scrollEl.querySelector("div").offsetHeight;
        emitInfinite = contentHeight < containerHeight;
      } else {
        emitInfinite = this.isVisibleInViewport(this.el);
      }
      if (emitInfinite) {
        this.gxInfinite.emit();
      }
    }, 100);
  }

  @Watch("disabled")
  protected disabledChanged(val: boolean) {
    if (this.disabled) {
      this.isLoading = false;
      this.isBusy = false;
    }
    this.enableScrollEvents(!val);
  }

  @Watch("threshold")
  protected thresholdChanged(val: string) {
    if (val.lastIndexOf("%") > -1) {
      this.thrPx = 0;
      this.thrPc = parseFloat(val) / 100;
    } else {
      this.thrPx = parseFloat(val);
      this.thrPc = 0;
    }
  }

  isVisibleInViewport(el) {
    const rect = el.getBoundingClientRect();
    const elemTop = rect.top;
    return elemTop >= 0 && elemTop <= window.innerHeight;
  }

  getScrollParent(node: any) {
    if (node == null) {
      return null;
    }

    if (node.scrollHeight > node.clientHeight) {
      return node;
    } else {
      return this.getScrollParent(node.parentNode);
    }
  }

  ensure() {
    if (!this.attached && this.itemCount > 0) {
      let contentEl = this.getScrollParent(this.el);
      if (contentEl) {
        if (contentEl === window.document.documentElement) {
          this.scrollListenerEl = window;
          contentEl = window.document.body;
          this.attachedToWindow = true;
        } else {
          this.scrollListenerEl = contentEl.parentNode;
          contentEl = this.scrollListenerEl;
        }

        this.scrollEl = contentEl as HTMLElement;
        this.thresholdChanged(this.threshold);
        this.enableScrollEvents(!this.disabled);
        this.attached = !this.disabled;
        if (this.position === "top") {
          this.queue.write(() => {
            if (this.scrollEl) {
              this.scrollEl.scrollTop =
                this.scrollEl.scrollHeight - this.scrollEl.clientHeight;
            }
          });
        }
      }
    }
  }

  async componentDidLoad() {
    this.ensure();
  }

  componentDidUnload() {
    this.scrollEl = undefined;
    this.attachedToWindow = false;
    this.attached = false;
    this.scrollListenerEl = undefined;
  }

  protected onScroll() {
    const scrollEl = this.scrollEl;
    if (!scrollEl || !this.canStart()) {
      return 1;
    }

    const infiniteHeight = this.el.offsetHeight;
    const scrollTop = !this.attachedToWindow
      ? scrollEl.scrollTop
      : window.scrollY;
    const scrollHeight = scrollEl.scrollHeight;
    const height = !this.attachedToWindow
      ? scrollEl.offsetHeight
      : window.innerHeight;
    const threshold = this.thrPc !== 0 ? height * this.thrPc : this.thrPx;

    const distanceFromInfinite =
      this.position === "bottom"
        ? scrollHeight - infiniteHeight - scrollTop - threshold - height
        : scrollTop - infiniteHeight - threshold;

    if (distanceFromInfinite < 0) {
      if (!this.didFire) {
        this.isLoading = true;
        this.didFire = true;
        this.gxInfinite.emit();
        return 3;
      }
    } else {
      this.didFire = false;
    }

    return 4;
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
    if (!this.isLoading || !scrollEl) {
      return;
    }
    this.isLoading = false;

    if (this.position === "top") {
      /**
       * New content is being added at the top, but the scrollTop position stays the same,
       * which causes a scroll jump visually. This algorithm makes sure to prevent this.
       * (Frame 1)
       *    - complete() is called, but the UI hasn't had time to update yet.
       *    - Save the current content dimensions.
       *    - Wait for the next frame using _dom.read, so the UI will be updated.
       * (Frame 2)
       *    - Read the new content dimensions.
       *    - Calculate the height difference and the new scroll position.
       *    - Delay the scroll position change until other possible dom reads are done using _dom.write to be performant.
       * (Still frame 2, if I'm correct)
       *    - Change the scroll position (= visually maintain the scroll position).
       *    - Change the state to re-enable the InfiniteScroll.
       *    - This should be after changing the scroll position, or it could
       *    cause the InfiniteScroll to be triggered again immediately.
       * (Frame 3)
       *    Done.
       */
      this.isBusy = true;
      // ******** DOM READ ****************
      // Save the current content dimensions before the UI updates
      const prev = scrollEl.scrollHeight - scrollEl.scrollTop;

      // ******** DOM READ ****************
      requestAnimationFrame(() => {
        this.queue.read(() => {
          // UI has updated, save the new content dimensions
          const scrollHeight = scrollEl.scrollHeight;
          // New content was added on top, so the scroll position should be changed immediately to prevent it from jumping around
          const newScrollTop = scrollHeight - prev;

          // ******** DOM WRITE ****************
          requestAnimationFrame(() => {
            this.queue.write(() => {
              scrollEl.scrollTop = newScrollTop;
              this.isBusy = false;
            });
          });
        });
      });
    }
  }

  private canStart(): boolean {
    return !this.disabled && !this.isBusy && !!this.scrollEl && !this.isLoading;
  }

  private enableScrollEvents(shouldListen: boolean) {
    const scrollListener = this.scrollListenerEl;
    if (scrollListener) {
      if (shouldListen) {
        scrollListener.addEventListener("scroll", this.onScroll);
      } else {
        scrollListener.removeEventListener("scroll", this.onScroll);
      }
    }
  }

  hostData() {
    return {
      class: {
        "infinite-scroll-enabled": !this.disabled,
        "infinite-scroll-loading": this.isLoading
      }
    };
  }
}
