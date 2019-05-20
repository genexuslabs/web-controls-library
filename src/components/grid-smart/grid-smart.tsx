import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  Listen,
  Method,
  Prop,
  Watch
} from "@stencil/core";

import { GridBaseHelper, IGridBase } from "../grid-base/grid-base";
import { IVisibilityComponent } from "../common/interfaces";
// tslint:disable:no-duplicate-imports
import Swiper from "swiper";
import { SwiperOptions } from "swiper";

@Component({
  styleUrl: "grid-smart.scss",
  tag: "gx-grid-smart"
})
export class GridSmart
  implements IGridBase, ComponentInterface, IVisibilityComponent {
  @Element() el!: HTMLElement;

  private scrollbarEl?: HTMLElement;
  private paginationEl?: HTMLElement;
  private didInit = false;
  private readySwiper!: (swiper: Swiper) => void;

  private swiper: Promise<Swiper> = new Promise(resolve => {
    this.readySwiper = resolve;
  });

  /**
   * Number of items per view (items visible at the same time on slider's container).
   */
  @Prop() columns: number | "auto";

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
   * Grid loading State. It's purpose is to know rather the Grid Loading animation or the Grid Empty placeholder should be shown.
   *
   * | Value        | Details                                                                                        |
   * | ------------ | ---------------------------------------------------------------------------------------------- |
   * | `loading` | The grid is waiting the server for the grid data. Grid loading mask will be shown.                |
   * | `loaded`   | The grid data has been loaded. If the grid has no records, the empty place holder will be shown. |
   */

  @Prop() loadingState: "loading" | "loaded";

  /**
   * Set numbers of items to define and enable group sliding. Useful to use with rowsPerPage > 1
   */
  @Prop() itemsPerGroup: number;

  /**
   * Could be 'horizontal' or 'vertical' (for vertical slider).
   */
  @Prop() direction: "horizontal" | "vertical";
  /**
   * Advanced options to pass to the swiper instance.
   * See http://idangero.us/swiper/api/ for valid options
   */
  @Prop() options: SwiperOptions = {};

  /**
   * If `true`, show the pagination buttons.
   */
  @Prop() pager = false;

  /**
   * Grid current row count. This property is used in order to be able to re-render the Grid every time the Grid data changes.
   * If not specified, then grid empty and loading placeholders will not work correctly.
   */
  @Prop() recordCount: number;

  /**
   * Number of items per column, for multirow layout.
   */
  @Prop() rows: number;

  /**
   * If `true`, show the scrollbar.
   */
  @Prop() scrollbar = false;

  /**
   * Emitted after Swiper initialization
   */
  @Event() gxGridDidLoad!: EventEmitter<void>;

  /**
   * Emitted when the user taps/clicks on the slide's container.
   */
  @Event() gxGridTap!: EventEmitter<void>;

  /**
   * Emitted when the user double taps on the slide's container.
   */
  @Event() gxGridDoubleTap!: EventEmitter<void>;

  /**
   * Emitted before the active slide has changed.
   */
  @Event() gxGridWillChange!: EventEmitter<void>;

  /**
   * Emitted after the active slide has changed.
   */
  @Event() gxGridDidChange!: EventEmitter<void>;

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

  @Watch("options")
  @Watch("recordCount")
  @Watch("loadingState")
  async optionsChanged() {
    if (this.initSwiper()) {
      const swiper = await this.getSwiper();
      Object.assign(swiper.params, this.options);
      await this.update();
    }
  }

  componentDidLoad() {
    window.requestAnimationFrame(() => this.initSwiper());
  }

  async componentDidUnload() {
    const swiper = await this.getSwiper();
    swiper.destroy(true, true);
  }

  @Listen("gxGridChanged")
  onSlideChanged() {
    if (this.initSwiper()) {
      this.update();
    }
  }

  /**
   * Update the underlying slider implementation. Call this if you've added or removed
   * child slides.
   */
  @Method()
  async update() {
    this.initSwiper();
    const swiper = await this.getSwiper();
    swiper.update();
  }

  /**
   * Force swiper to update its height (when autoHeight is enabled) for the duration
   * equal to 'speed' parameter.
   *
   * @param speed The transition duration (in ms).
   */
  @Method()
  async updateAutoHeight(speed?: number) {
    const swiper = await this.getSwiper();
    swiper.updateAutoHeight(speed);
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
    const swiper = await this.getSwiper();
    swiper.slideTo(index, speed, runCallbacks);
  }

  /**
   * Transition to the next slide.
   *
   * @param speed The transition duration (in ms).
   * @param runCallbacks If true, the transition will produce [Transition/SlideChange][Start/End] transition events.
   */
  @Method()
  async slideNext(speed?: number, runCallbacks?: boolean) {
    const swiper = await this.getSwiper();
    swiper.slideNext(speed, runCallbacks);
  }

  /**
   * Transition to the previous slide.
   *
   * @param speed The transition duration (in ms).
   * @param runCallbacks If true, the transition will produce the [Transition/SlideChange][Start/End] transition events.
   */
  @Method()
  async slidePrev(speed?: number, runCallbacks?: boolean) {
    const swiper = await this.getSwiper();
    swiper.slidePrev(speed, runCallbacks);
  }

  /**
   * Get the index of the active slide.
   */
  @Method()
  async getActiveIndex(): Promise<number> {
    const swiper = await this.getSwiper();
    return swiper.activeIndex;
  }

  /**
   * Get the index of the previous slide.
   */
  @Method()
  async getPreviousIndex(): Promise<number> {
    const swiper = await this.getSwiper();
    return swiper.previousIndex;
  }

  /**
   * Get the total number of slides.
   */
  @Method()
  async length(): Promise<number> {
    const swiper = await this.getSwiper();
    return swiper.slides.length;
  }

  /**
   * Get whether or not the current slide is the last slide.
   */
  @Method()
  async isEnd(): Promise<boolean> {
    const swiper = await this.getSwiper();
    return swiper.isEnd;
  }

  /**
   * Get whether or not the current slide is the first slide.
   */
  @Method()
  async isBeginning(): Promise<boolean> {
    const swiper = await this.getSwiper();
    return swiper.isBeginning;
  }

  /**
   * Start auto play.
   */
  @Method()
  async startAutoplay() {
    const swiper = await this.getSwiper();
    if (swiper.autoplay) {
      swiper.autoplay.start();
    }
  }

  /**
   * Stop auto play.
   */
  @Method()
  async stopAutoplay() {
    const swiper = await this.getSwiper();
    if (swiper.autoplay) {
      swiper.autoplay.stop();
    }
  }

  /**
   * Lock or unlock the ability to slide to the next slide.
   *
   * @param lock If `true`, disable swiping to the next slide.
   */
  @Method()
  async lockSwipeToNext(lock: boolean) {
    const swiper = await this.getSwiper();
    swiper.allowSlideNext = !lock;
  }

  /**
   * Lock or unlock the ability to slide to the previous slide.
   *
   * @param lock If `true`, disable swiping to the previous slide.
   */
  @Method()
  async lockSwipeToPrev(lock: boolean) {
    const swiper = await this.getSwiper();
    swiper.allowSlidePrev = !lock;
  }

  /**
   * Lock or unlock the ability to slide to the next or previous slide.
   *
   * @param lock If `true`, disable swiping to the next and previous slide.
   */
  @Method()
  async lockSwipes(lock: boolean) {
    const swiper = await this.getSwiper();
    swiper.allowSlideNext = !lock;
    swiper.allowSlidePrev = !lock;
    swiper.allowTouchMove = !lock;
  }

  private async initSwiper() {
    if (!this.didInit && this.recordCount > 0) {
      const container: HTMLElement = this.el;
      container
        .querySelector("[slot='grid-content']")
        .classList.add("swiper-wrapper");
      const swiper = new Swiper(container, this.normalizeOptions());
      this.readySwiper(swiper);
      this.didInit = true;
    }
    return this.didInit;
  }

  private getSwiper() {
    return this.swiper;
  }

  private optionValueDefault(value: any, defaultValue: any): any {
    return value || defaultValue;
  }

  private normalizeOptions(): SwiperOptions {
    // tslint:disable:object-literal-sort-keys
    const swiperOptions: SwiperOptions = {
      autoHeight: false,
      autoplay: false,
      centeredSlides: false,
      direction: this.optionValueDefault(this.direction, "horizontal"),
      effect: undefined,
      freeMode: false,
      freeModeMomentum: true,
      freeModeMomentumRatio: 1,
      freeModeMomentumBounce: true,
      freeModeMomentumBounceRatio: 1,
      freeModeMomentumVelocityRatio: 1,
      freeModeSticky: false,
      freeModeMinimumVelocity: 0.02,
      initialSlide: 0,
      loop: false,
      parallax: false,
      setWrapperSize: false,
      slidesOffsetAfter: 0,
      slidesOffsetBefore: 0,
      slidesPerColumn: this.optionValueDefault(this.rows, 1),
      slidesPerColumnFill: "column",
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
      resistance: true,
      resistanceRatio: 0.85,
      watchSlidesProgress: false,
      watchSlidesVisibility: false,
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
        crossfade: false
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
        doubleTap: this.gxGridDoubleTap.emit,
        init: () => {
          setTimeout(() => {
            this.gxGridDidLoad.emit();
          }, 20);
        },
        reachBeginning: this.gxGridReachStart.emit,
        reachEnd: this.gxGridReachEnd.emit,
        slideChangeTransitionEnd: this.gxGridDidChange.emit,
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
        tap: this.gxGridTap.emit
      }
    };

    const customEvents =
      !!this.options && !!this.options.on ? this.options.on : {};

    // merge "on" event listeners, while giving our event listeners priority
    const mergedEventOptions = { on: { ...customEvents, ...eventOptions.on } };

    // Merge the base, user options, and events together then pass to swiper
    return { ...swiperOptions, ...this.options, ...mergedEventOptions };
  }

  hostData() {
    const hostData = GridBaseHelper.hostData(this);
    hostData.class = {
      ...hostData.class,
      ...{
        "swiper-container": true
      }
    };
    return hostData;
  }

  render() {
    return [
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
      <div class="grid-empty-placeholder">
        <slot name="grid-content-empty" />
      </div>,
      <slot />
    ];
  }
}
