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

@Component({
  shadow: true,
  styleUrl: "grid-infinite-scroll.scss",
  tag: "gx-grid-infinite-scroll"
})
export class GridInfiniteScroll implements ComponentInterface {
  @Element() el!: HTMLGxGridInfiniteScrollElement;

  /**
   * This property must be bounded to grid item count property.
   * It's unique purpose is to trigger gxInfinite as many times as needed to fullfill the Container space when the initial batch does not overflow the main container
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
   * The position of the infinite scroll element.
   * The value can be either `top` or `bottom`.
   */
  @Prop() readonly position: "top" | "bottom" = "bottom";

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
  async complete() {}

  render() {
    return (
      <Host>
        <slot />
      </Host>
    );
  }
}
