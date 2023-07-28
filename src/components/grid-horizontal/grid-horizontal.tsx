import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  Host,
  Method,
  Prop,
  Watch,
  h
} from "@stencil/core";
import Swiper, { FreeMode, Grid, Pagination, SwiperOptions } from "swiper";
import { GridBase, GridBaseHelper } from "../grid-base/grid-base";

import { HighlightableComponent } from "../common/highlightable";
import { getWindowsOrientation } from "../common/utils";

import {
  AccessibleNameByComponent,
  AccessibleNameComponent
} from "../../common/interfaces";

@Component({
  styleUrl: "grid-horizontal.scss",
  tag: "gx-grid-horizontal"
})
export class GridHorizontal
  implements
    GridBase,
    AccessibleNameByComponent,
    AccessibleNameComponent,
    ComponentInterface,
    HighlightableComponent
{
  @Element() element!: HTMLGxGridHorizontalElement;

  private scrollbarEl?: HTMLElement;
  private paginationEl?: HTMLElement;
  private swiper: Swiper = null;
  private fillMode: "column" | "row" = "row";

  // Refs
  private horizontalGridContent: HTMLDivElement = null;
  private scrollableContainer: HTMLElement = null;

  /**
   * Specifies the accessible name property value by providing the ID of the
   * HTMLElement that has the accessible name text.
   */
  @Prop() readonly accessibleNameBy: string;

  /**
   * Specifies a short string, typically 1 to 3 words, that authors associate
   * with an element to provide users of assistive technologies with a label
   * for the element.
   */
  @Prop() readonly accessibleName: string;

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
   * A CSS class to set as the `gx-grid-horizontal` element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * 1-Indexed number of currently active page
   */
  @Prop({ mutable: true }) currentPage = 1;

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
   * Specifies the orientation mode.
   */
  @Prop({ mutable: true }) orientation: "portrait" | "landscape" = "portrait";

  /**
   * A CSS class to set as the  Page Controller element class when
   * `showPageController = "true"`.
   */
  @Prop() readonly pageControllerClass: string;

  /**
   * Grid current row count. This property is used in order to be able to re-render the Grid every time the Grid data changes.
   * If not specified, then grid empty and loading placeholders will not work correctly.
   */
  @Prop() readonly recordCount: number = null;

  /**
   * Specifies the number of rows that will be displayed in the portrait mode.
   */
  @Prop() readonly rows: number = 1;

  /**
   * Specifies the number of rows that will be displayed in the landscape mode.
   */
  @Prop() readonly rowsLandscape: number = 1;

  /**
   * If `true`, show the scrollbar.
   */
  @Prop() readonly scrollbar: boolean = false;

  /**
   * If `true`, show the pagination buttons (page controller).
   */
  @Prop() readonly showPageController: boolean = true;

  /**
   * Set to false to enable slides in free mode position.
   */
  @Prop() readonly snapToGrid: boolean = true;

  /**
   * True to highlight control when an action is fired.
   */
  @Prop() readonly highlightable: boolean = false;

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
  @Event() gxGridClick!: EventEmitter;

  /**
   * Emitted when the user double taps on the slide's container.
   */
  @Event() gxGridDoubleClick!: EventEmitter;

  /**
   * Emitted before the active slide has changed.
   */
  @Event() gxGridWillChange!: EventEmitter;

  /**
   * Emitted after the active slide has changed.
   */
  @Event() gxGridDidChange!: EventEmitter<number>;

  /**
   * Emitted when the next slide has started.
   */
  @Event() gxGridNextStart!: EventEmitter;

  /**
   * Emitted when the previous slide has started.
   */
  @Event() gxGridPrevStart!: EventEmitter;

  /**
   * Emitted when the next slide has ended.
   */
  @Event() gxGridNextEnd!: EventEmitter;

  /**
   * Emitted when the previous slide has ended.
   */
  @Event() gxGridPrevEnd!: EventEmitter;

  /**
   * Emitted when the slide transition has started.
   */
  @Event() gxGridTransitionStart!: EventEmitter;

  /**
   * Emitted when the slide transition has ended.
   */
  @Event() gxGridTransitionEnd!: EventEmitter;

  /**
   * Emitted when the slider is actively being moved.
   */
  @Event() gxGridDrag!: EventEmitter;

  /**
   * Emitted when the slider is at its initial position.
   */
  @Event() gxGridReachStart!: EventEmitter;

  /**
   * Emitted when the slider is at the last slide.
   */
  @Event() gxGridReachEnd!: EventEmitter<void>;

  /**
   * Emitted when the user first touches the slider.
   */
  @Event() gxGridTouchStart!: EventEmitter;

  /**
   * Emitted when the user releases the touch.
   */
  @Event() gxGridTouchEnd!: EventEmitter;

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

  @Watch("orientation")
  updateSlidesPerColumn() {
    window.requestAnimationFrame(() => this.ensureSwiper(true));
  }

  componentWillLoad() {
    this.orientation = getWindowsOrientation();
  }

  componentDidLoad() {
    this.scrollableContainer = this.element.querySelector(
      ":scope > .gx-grid-horizontal-content > [slot='grid-content']"
    );
    this.scrollableContainer.classList.add("swiper-wrapper");

    this.ensureSwiper();
    GridBaseHelper.init(this);
  }

  componentDidUpdate() {
    this.update();
  }

  disconnectedCallback() {
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

  private ensureSwiper(orientationDidChange = false): boolean {
    if (
      (this.swiper === null || orientationDidChange) &&
      this.recordCount > 0 &&
      this.loadingState !== "loading"
    ) {
      const opts: SwiperOptions = this.normalizeOptions();

      this.log("Initializing Swiper..");

      this.swiper = new Swiper(this.horizontalGridContent, opts);
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
    const slidesPerColumnOrientation =
      this.orientation === "portrait" ? this.rows : this.rowsLandscape;

    const swiperOptions: SwiperOptions = {
      modules: [FreeMode, Grid, Pagination],

      autoHeight: false,
      autoplay: false,
      centeredSlides: false,
      direction: this.optionValueDefault(this.direction, "horizontal"),
      effect: undefined,

      freeMode: {
        enabled: !this.snapToGrid,
        minimumVelocity: 0.02,
        momentum: false,
        momentumRatio: 1,
        momentumBounce: true,
        momentumBounceRatio: 1,
        momentumVelocityRatio: 1,
        sticky: false
      },

      grid: {
        rows: this.optionValueDefault(slidesPerColumnOrientation, 1),
        fill: this.fillMode
      },

      initialSlide: this.getSwiperCurrentPage() * this.itemsPerGroup,
      loop: false,
      parallax: false,
      setWrapperSize: false,
      slidesOffsetAfter: 0,
      slidesOffsetBefore: 0,
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
      edgeSwipeDetection: false,
      edgeSwipeThreshold: 20,
      mousewheel: false,
      resistance: true,
      resistanceRatio: 0.85,
      roundLengths: true,

      // This aditionally triggers previous: watchSlidesVisibility: false
      // https://swiperjs.com/swiper-api#param-watchSlidesProgress
      watchSlidesProgress: false,
      watchOverflow: this.showPageController,
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

    if (this.showPageController) {
      swiperOptions.pagination = {
        bulletElement: "button",
        clickable: true,
        el: this.paginationEl,
        enabled: true,
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

  render() {
    const hostData = GridBaseHelper.hostData(this);

    return (
      <Host
        {...hostData}
        style={{
          "--rows":
            this.orientation === "portrait"
              ? this.rows.toString()
              : this.rowsLandscape.toString()
        }}
      >
        {[
          <div
            class={{
              "gx-grid-horizontal-content swiper": true,
              "gx-grid-horizontal--no-auto-grow": !this.autoGrow
            }}
            ref={el => (this.horizontalGridContent = el as HTMLDivElement)}
          >
            <slot name="grid-content" />
          </div>,

          this.showPageController && (
            <div
              class={{
                "swiper-pagination": true,
                [this.pageControllerClass]: !!this.pageControllerClass
              }}
              ref={el => (this.paginationEl = el)}
            />
          ),

          this.scrollbar && (
            <div class="swiper-scrollbar" ref={el => (this.scrollbarEl = el)} />
          ),

          <slot name="grid-empty-loading-placeholder" />,

          <slot name="grid-content-empty" />,
          <slot />
        ]}
      </Host>
    );
  }
}
