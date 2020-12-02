import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  Method,
  Prop,
  Watch,
  h,
  Host
} from "@stencil/core";

import { GridBaseHelper, GridBase } from "../grid-base/grid-base";
import { VisibilityComponent } from "../common/interfaces";
import Swiper, { SwiperOptions } from "swiper";

@Component({
  styleUrl: "grid-horizontal.scss",
  tag: "gx-grid-horizontal"
})
export class GridHorizontal
  implements GridBase, ComponentInterface, VisibilityComponent {
  @Element() el!: HTMLGxGridHorizontalElement;

  private scrollbarEl?: HTMLElement;
  private paginationEl?: HTMLElement;
  private swiper: Swiper = null;
  private fillMode: "column" | "row" = "column";

  /**
   * This attribute defines if the control size will grow automatically,
   * to adjust to its content size.
   * If set to `false`, it won't grow automatically and it will show scrollbars
   * if the content overflows.
   */
  @Prop() readonly autoGrow: boolean;

  /**
   * Number of items per column (items visible at the same time on slider's container).
   */
  @Prop() readonly columns: number | "auto";

  /**
   * 1-Indexed number of currently active page
   */
  @Prop({ mutable: true }) currentPage = 1;

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
   * Grid loading state. It's purpose is to know whether the grid loading animation or the grid empty placeholder should be shown.
   *
   * | Value        | Details                                                                                        |
   * | ------------ | ---------------------------------------------------------------------------------------------- |
   * | `loading` | The grid is waiting the server for the grid data. Grid loading mask will be shown.                |
   * | `loaded`   | The grid data has been loaded. If the grid has no records, the empty place holder will be shown. |
   */

  @Prop() readonly loadingState: "loading" | "loaded";

  /**
   * Logging level. For troubleshooting component update and initialization.
   */
  @Prop() readonly logLevel: "debug" | "off" = "debug";

  /**
   * Set numbers of items to define and enable group sliding. Useful to use with rowsPerPage > 1
   */
  @Prop() readonly itemsPerGroup = 1;

  /**
   * Items layout direction: Could be 'horizontal' or 'vertical' (for vertical slider).
   */
  @Prop() readonly direction: "horizontal" | "vertical";
  /**
   * Advanced options to pass to the swiper instance.
   * See http://idangero.us/swiper/api/ for valid options
   */
  @Prop() readonly options: SwiperOptions = {};

  /**
   * If `true`, show the pagination buttons.
   */
  @Prop() readonly pager = true;

  /**
   * Grid current row count. This property is used in order to be able to re-render the Grid every time the Grid data changes.
   * If not specified, then grid empty and loading placeholders will not work correctly.
   */
  @Prop() readonly recordCount: number = null;

  /**
   * Number of items per column, for multirow layout.
   */
  @Prop() readonly rows: number;

  /**
   * If `true`, show the scrollbar.
   */
  @Prop() readonly scrollbar = false;

  /**
   * Set to false to enable slides in free mode position.
   */
  @Prop() readonly snapToGrid = true;

  /**
   * This Handler will be called every time grid threshold is reached. Needed for infinite scrolling grids.
   */
  @Event() gxInfiniteThresholdReached: EventEmitter<void>;

  /**
   * Emitted after Swiper initialization
   */
  @Event() gxGridDidLoad!: EventEmitter<void>;

  /**
   * Emitted when the user taps/clicks on the slide's container.
   */
  @Event() gxGridClick!: EventEmitter<void>;

  /**
   * Emitted when the user double taps on the slide's container.
   */
  @Event() gxGridDoubleClick!: EventEmitter<void>;

  /**
   * Emitted before the active slide has changed.
   */
  @Event() gxGridWillChange!: EventEmitter<void>;

  /**
   * Emitted after the active slide has changed.
   */
  @Event() gxGridDidChange!: EventEmitter<number>;

  /**
   * Emitted when the next slide has started.
   */
  @Event() gxGridNextStart!: EventEmitter<void>;

  /**
   * Emitted when the previous slide has started.
   */
  @Event() gxGridPrevStart!: EventEmitter<void>;

  /**
   * Emitted when the next slide has ended.
   */
  @Event() gxGridNextEnd!: EventEmitter<void>;

  /**
   * Emitted when the previous slide has ended.
   */
  @Event() gxGridPrevEnd!: EventEmitter<void>;

  /**
   * Emitted when the slide transition has started.
   */
  @Event() gxGridTransitionStart!: EventEmitter<void>;

  /**
   * Emitted when the slide transition has ended.
   */
  @Event() gxGridTransitionEnd!: EventEmitter<void>;

  /**
   * Emitted when the slider is actively being moved.
   */
  @Event() gxGridDrag!: EventEmitter<void>;

  /**
   * Emitted when the slider is at its initial position.
   */
  @Event() gxGridReachStart!: EventEmitter<void>;

  /**
   * Emitted when the slider is at the last slide.
   */
  @Event() gxGridReachEnd!: EventEmitter<void>;

  /**
   * Emitted when the user first touches the slider.
   */
  @Event() gxGridTouchStart!: EventEmitter<void>;

  /**
   * Emitted when the user releases the touch.
   */
  @Event() gxGridTouchEnd!: EventEmitter<void>;

  private getSwiperCurrentPage() {
    return this.currentPage - 1;
  }

  @Watch("currentPage")
  pageChanged() {
    if (this.isInitialized()) {
      this.swiper.slideTo(
        Math.floor(this.getSwiperCurrentPage() * this.itemsPerGroup)
      );
    }
  }

  @Watch("options")
  optionsChanged() {
    if (this.isInitialized()) {
      Object.assign(this.swiper.params, this.options);
    }
  }

  componentDidLoad() {
    window.requestAnimationFrame(() => this.ensureSwiper());
  }

  componentDidUpdate() {
    this.update();
  }

  componentDidUnload() {
    if (this.isInitialized()) {
      this.swiper.destroy(true, true);
    }
  }

  /**
   * Update the underlying slider implementation. Call this if you've added or removed
   * child slides.
   */
  @Method()
  async update() {
    if (this.loadingState !== "loading") {
      if (this.isInitialized()) {
        this.log("Updating Swiper..");
        this.swiper.update();
      } else {
        window.requestAnimationFrame(() => this.ensureSwiper());
      }
    }
  }

  /**
   * Force swiper to update its height (when autoHeight is enabled) for the duration
   * equal to 'speed' parameter.
   *
   * @param speed The transition duration (in ms).
   */
  @Method()
  async updateAutoHeight(speed?: number) {
    this.swiper.updateAutoHeight(speed);
  }

  /**
   * Transition to the specified slide.
   *
   * @param index The index of the slide to transition to.
   * @param speed The transition duration (in ms).
   * @param runCallbacks If true, the transition will produce [Transition/SlideChange][Start/End] transition events.
   */
  @Method()
  async slideTo(index: number, speed?: number, runCallbacks?: boolean) {
    this.swiper.slideTo(index, speed, runCallbacks);
  }

  /**
   * Transition to the next slide.
   *
   * @param speed The transition duration (in ms).
   * @param runCallbacks If true, the transition will produce [Transition/SlideChange][Start/End] transition events.
   */
  @Method()
  async slideNext(speed?: number, runCallbacks?: boolean) {
    this.swiper.slideNext(speed, runCallbacks);
  }

  /**
   * Transition to the previous slide.
   *
   * @param speed The transition duration (in ms).
   * @param runCallbacks If true, the transition will produce the [Transition/SlideChange][Start/End] transition events.
   */
  @Method()
  async slidePrev(speed?: number, runCallbacks?: boolean) {
    this.swiper.slidePrev(speed, runCallbacks);
  }

  /**
   * Get the index of the current active slide.
   */
  @Method()
  async getActiveIndex(): Promise<number> {
    return this.swiper.activeIndex;
  }

  /**
   * Get the index of the previous slide.
   */
  @Method()
  async getPreviousIndex(): Promise<number> {
    return this.swiper.previousIndex;
  }

  /**
   * Get the total number of slides.
   */
  @Method()
  async length(): Promise<number> {
    return this.swiper.slides.length;
  }

  /**
   * Get whether or not the current slide is the last slide.
   */
  @Method()
  async isLast(): Promise<boolean> {
    return this.swiper.isEnd;
  }

  /**
   * Get whether or not the current slide is the first slide.
   */
  @Method()
  async isStart(): Promise<boolean> {
    return this.swiper.isBeginning;
  }

  /**
   * Start auto play.
   */
  @Method()
  async startAutoplay() {
    if (this.swiper.autoplay !== null) {
      this.swiper.autoplay.start();
    }
  }

  /**
   * Stop auto play.
   */
  @Method()
  async stopAutoplay() {
    if (this.swiper.autoplay !== null) {
      this.swiper.autoplay.stop();
    }
  }

  /**
   * Lock or unlock the ability to slide to the next slide.
   *
   * @param lock If `true`, disable swiping to the next slide.
   */
  @Method()
  async toggleLockSwipeToNext(lock: boolean) {
    this.swiper.allowSlideNext = !lock;
  }

  /**
   * Lock or unlock the ability to slide to the previous slide.
   *
   * @param lock If `true`, disable swiping to the previous slide.
   */
  @Method()
  async toggleLockSwipeToPrev(lock: boolean) {
    this.swiper.allowSlidePrev = !lock;
  }

  /**
   * Lock or unlock the ability to slide to the next or previous slide.
   *
   * @param lock If `true`, disable swiping to the next and previous slide.
   */
  @Method()
  async toggleLockSwipes(lock: boolean) {
    this.swiper.allowSlideNext = !lock;
    this.swiper.allowSlidePrev = !lock;
    this.swiper.allowTouchMove = !lock;
  }

  private ensureSwiper(): boolean {
    if (
      this.swiper === null &&
      this.recordCount > 0 &&
      this.loadingState !== "loading"
    ) {
      const opts: SwiperOptions = this.normalizeOptions();
      const container: HTMLElement = this.el;
      container
        .querySelector("[slot='grid-content']")
        .classList.add("swiper-wrapper");
      this.log("Initializing Swiper..");
      this.swiper = new Swiper(container, opts);
    }
    return this.isInitialized();
  }

  private isInitialized(): boolean {
    return this.swiper !== null;
  }

  private log(msg: any): void {
    if (msg && this.logLevel !== "off") {
      // console.log(msg, this.recordCount, this.loadingState, this.el);
    }
  }

  private optionValueDefault(value: any, defaultValue: any): any {
    return value || defaultValue;
  }

  private normalizeOptions(): SwiperOptions {
    const swiperOptions: SwiperOptions = {
      autoHeight: false,
      autoplay: false,
      centeredSlides: false,
      direction: this.optionValueDefault(this.direction, "horizontal"),
      effect: undefined,
      freeMode: !this.snapToGrid,
      freeModeMomentum: false,
      freeModeMomentumRatio: 1,
      freeModeMomentumBounce: true,
      freeModeMomentumBounceRatio: 1,
      freeModeMomentumVelocityRatio: 1,
      freeModeSticky: false,
      freeModeMinimumVelocity: 0.02,
      initialSlide: this.getSwiperCurrentPage() * this.itemsPerGroup,
      loop: false,
      parallax: false,
      setWrapperSize: false,
      slidesOffsetAfter: 0,
      slidesOffsetBefore: 0,
      slidesPerColumn: this.optionValueDefault(this.rows, 1),
      slidesPerColumnFill: this.fillMode,
      slidesPerGroup: this.optionValueDefault(this.itemsPerGroup, 1),
      slidesPerView: this.optionValueDefault(this.columns, 1),
      spaceBetween: 0,
      speed: 300,
      touchEventsTarget: "container",
      zoom: {
        maxRatio: 3,
        minRatio: 1,
        toggle: true
      },
      touchRatio: 1,
      touchAngle: 45,
      simulateTouch: true,
      shortSwipes: true,
      longSwipes: true,
      longSwipesRatio: 0.5,
      longSwipesMs: 300,
      followFinger: true,
      threshold: 0,
      touchMoveStopPropagation: true,
      touchReleaseOnEdges: false,
      iOSEdgeSwipeDetection: false,
      iOSEdgeSwipeThreshold: 20,
      mousewheel: false,
      resistance: true,
      resistanceRatio: 0.85,
      roundLengths: true,
      watchSlidesProgress: false,
      watchSlidesVisibility: false,
      watchOverflow: this.pager,
      preventClicks: true,
      preventClicksPropagation: true,
      slideToClickedSlide: false,
      loopAdditionalSlides: 0,
      noSwiping: true,
      runCallbacksOnInit: true,
      coverflowEffect: {
        depth: 100,
        modifier: 1,
        rotate: 50,
        slideShadows: true,
        stretch: 0
      },
      flipEffect: {
        limitRotation: true,
        slideShadows: true
      },
      cubeEffect: {
        shadow: true,
        shadowOffset: 20,
        shadowScale: 0.94,
        slideShadows: true
      },
      fadeEffect: {
        crossFade: false
      }
    };

    if (this.pager) {
      swiperOptions.pagination = {
        clickable: false,
        el: this.paginationEl,
        hideOnClick: false,
        type: "bullets"
      };
    }

    if (this.scrollbar) {
      swiperOptions.scrollbar = {
        el: this.scrollbarEl,
        hide: true
      };
    }

    const eventOptions: SwiperOptions = {
      on: {
        doubleTap: this.gxGridDoubleClick.emit,
        init: () => {
          setTimeout(() => {
            this.gxGridDidLoad.emit();
          }, 20);
        },
        reachBeginning: this.gxGridReachStart.emit,
        reachEnd: () => {
          this.log("reachEnd");
          this.gxGridReachEnd.emit();
          this.gxInfiniteThresholdReached.emit();
        },
        slideChangeTransitionEnd: () => {
          if (this.swiper !== null) {
            this.log("pageChanged");
            const currentPage = Math.ceil(
              this.swiper.activeIndex / this.itemsPerGroup
            );
            this.gxGridDidChange.emit(currentPage + 1);
          }
        },
        slideChangeTransitionStart: this.gxGridWillChange.emit,
        slideNextTransitionStart: this.gxGridNextStart.emit,
        slidePrevTransitionStart: this.gxGridPrevStart.emit,
        slideNextTransitionEnd: this.gxGridNextEnd.emit,
        slidePrevTransitionEnd: this.gxGridPrevEnd.emit,
        sliderMove: this.gxGridDrag.emit,
        transitionStart: this.gxGridTransitionStart.emit,
        transitionEnd: this.gxGridTransitionEnd.emit,
        touchStart: this.gxGridTouchStart.emit,
        touchEnd: this.gxGridTouchEnd.emit,
        tap: this.gxGridClick.emit
      }
    };

    const customEvents = this.options.on || {};

    // merge "on" event listeners, while giving our event listeners priority
    const mergedEventOptions = { on: { ...customEvents, ...eventOptions.on } };

    // Merge the base, user options, and events together then pass to swiper
    return { ...swiperOptions, ...this.options, ...mergedEventOptions };
  }

  private ensureViewPort() {
    if (this.autoGrow || this.fillMode === "row") {
      return;
    }
    //When 'column' it uses flex-direction: column layout which requires specified height on swiper-container.
    const height = this.el.parentElement.offsetHeight;
    if (height > 0) {
      this.el.style.maxHeight = height + "px";
    }
  }

  render() {
    this.ensureViewPort();
    const hostData = GridBaseHelper.hostData(this);
    hostData.class = {
      ...hostData.class,
      ...{
        "swiper-container": true
      }
    };

    return (
      <Host {...hostData}>
        {[
          <slot name="grid-content" />,
          this.pager && (
            <div
              class="gx-grid-paging swiper-pagination"
              ref={el => (this.paginationEl = el)}
            />
          ),
          this.scrollbar && (
            <div class="swiper-scrollbar" ref={el => (this.scrollbarEl = el)} />
          ),
          <slot name="grid-empty-loading-placeholder" />,
          <div class="grid-empty-placeholder">
            <slot name="grid-content-empty" />
          </div>,
          <slot />
        ]}
      </Host>
    );
  }
}
