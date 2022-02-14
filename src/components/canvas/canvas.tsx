import {
  Component,
  Element,
  Event,
  EventEmitter,
  Prop,
  h,
  Host,
  State,
  Method
} from "@stencil/core";
import {
  ClickableComponent,
  Component as GxComponent,
  DisableableComponent,
  VisibilityComponent
} from "../common/interfaces";
import { Swipeable, makeSwipeable } from "../common/swipeable";

const THRESHOLD = 1.75;

/* - - - - - - - - SELECTORS - - - - - - - - */
const ALL_CANVAS_CELLS = ":scope > gx-canvas-cell";

const AUTOGROW_CANVAS_CELLS = ":scope > .auto-grow-cell";

const AUTOGROW_CANVAS_CELL_CLASS = (id: string) => {
  return `autogrow-cell-${id}`;
};

const AUTOGROW_CANVAS_CELL_BY_ID = (id: string) => {
  return `:scope > .${AUTOGROW_CANVAS_CELL_CLASS(id)}`;
};

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
   * This attribute lets you specify if the element is disabled.
   * If disabled, it will not fire any user interaction related event
   * (for example, click event).
   */
  @Prop() readonly disabled = false;

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
   * This attribute defines the minimum height of the cell when its contents
   * are visible.
   */
  @Prop() readonly minHeight: string = null;

  /**
   * This attribute lets you specify the width of the control.
   */
  @Prop() readonly width: string;

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

  /**
   * Its value is not null when there is a `gx-canvas-cell` that has more
   * height than the `gx-canvas` control. In this case, this state takes the
   * value of the highest `gx-canvas-cell`.
   */
  @State() canvasFixedHeight: number = null;

  /*  Used to optimize height adjustments. This variable allows us to ignore
      the height adjustments triggered by a gx-canvas-cell that had less height
      than the highest gx-canvas-cell.
  */
  private highestCanvasCellId: string = null;

  // Observers
  private watchForItemsObserver: ResizeObserver;

  /**
   *
   */
  @Method()
  async setObserver() {
    this.setCanvasCellsObserver();
  }

  /*  Observes each gx-canvas-cell that has auto-grow = True. When interrupt,
      it checks if is needed to update the canvas height
  */
  private setCanvasCellsObserver() {
    this.watchForItemsObserver = new ResizeObserver(entries => {
      let maxCanvasCellId: string;
      let maxCanvasCellHeight = 0;

      /*  If more than one gx-canvas-cell interrupted, we search for the cell
          with the maximum height
      */
      entries.forEach(entry => {
        const canvasCellId = entry.target.id;

        const canvasCell: HTMLGxCanvasCellElement = this.element.querySelector(
          AUTOGROW_CANVAS_CELL_BY_ID(canvasCellId)
        );
        const canvasCellHeight = this.getCanvasCellTotalHeight(canvasCell);

        if (maxCanvasCellHeight < canvasCellHeight) {
          maxCanvasCellHeight = canvasCellHeight;
          maxCanvasCellId = canvasCellId;
        }
      });

      /*  The gx-canvas-cell that represent the max height constraint is used
          to adjust the gx-canvas height
       */
      this.adjustCanvasHeight(maxCanvasCellId, maxCanvasCellHeight);
    });

    /*  ResizeObserver ONLY for:
          - gx-canvas-cell with auto-grow = True
    */
    const autoGrowCanvasCells = this.element.querySelectorAll(
      AUTOGROW_CANVAS_CELLS
    );
    autoGrowCanvasCells.forEach((canvasCell: HTMLGxCanvasCellElement, id) => {
      canvasCell.id = id.toString();
      canvasCell.classList.add(AUTOGROW_CANVAS_CELL_CLASS(id.toString()));

      this.watchForItemsObserver.observe(canvasCell);
    });
  }

  private fixCanvasHeight(maxHeightConstraint: number) {
    /*  In each gx-canvas-cell, we adapt its top, min-height and max-height
        values to make them absolute
    */
    const canvasCells = this.element.querySelectorAll(ALL_CANVAS_CELLS);
    canvasCells.forEach((canvasCell: HTMLGxCanvasCellElement) => {
      this.fixCanvasCellProperties(canvasCell);
    });

    this.canvasFixedHeight = maxHeightConstraint;
  }

  private handleClick(event: UIEvent) {
    if (this.disabled) {
      return;
    }

    this.gxClick.emit(event);
  }

  private getCanvasCellTotalHeight(
    canvasCell: HTMLGxCanvasCellElement
  ): number {
    return canvasCell.clientHeight + canvasCell.offsetTop;
  }

  /*  This functions is called the first time that
        this.canvasFixedHeight != null
  
      Due to at this point we have to resize the gx-canvas, we fix the relative
      values of top, min-height and max-height in all the gx-canvas-cell
  */
  private fixCanvasCellProperties(canvasCell: HTMLGxCanvasCellElement) {
    canvasCell.style.setProperty("top", `${canvasCell.offsetTop}px`);

    const minHeight = canvasCell.minHeight;
    let fixedHeight;

    const canvasInitialHeight = this.element.clientHeight;

    // Mixed height. For example, "min-height: calc( 50% + -75px )"
    if (minHeight.includes("calc")) {
      const reRelative = /-?\d+%/g;
      const reAbsolute = /-?\d+px/g;

      const relative = Number(minHeight.match(reRelative)[0].replace("%", ""));
      const absolute = Number(minHeight.match(reAbsolute)[0].replace("px", ""));

      fixedHeight = `${absolute + canvasInitialHeight * (relative / 100)}px`;

      // Relative height. For example, "min-height: 50%"
    } else if (minHeight.includes("%")) {
      const relative = Number(minHeight.replace("%", "").trim());

      fixedHeight = `${canvasInitialHeight * (relative / 100)}px`;

      // Absolute height. For example, "min-height: 100px"
    } else {
      fixedHeight = minHeight;
    }

    canvasCell.style.setProperty("min-height", fixedHeight);

    // If the gx-canvas-cell has auto-grow == False, we limit its height
    if (canvasCell.maxHeight != null) {
      canvasCell.style.setProperty("max-height", fixedHeight);
    }
  }

  componentDidLoad() {
    makeSwipeable(this);
  }

  /*  The height adjustment of the gx-canvas will trigger if one of the
      following conditions are true:
        - A gx-canvas-cell has more height than the gx-canvas.

        - The previous gx-canvas-cell that had the max-height and caused the
          gx-canvas to stretch, decreased now its height.
  */
  private adjustCanvasHeight(canvasCellId: string, canvasCellHeight: number) {
    if (this.canvasFixedHeight == null) {
      if (this.element.clientHeight + THRESHOLD < canvasCellHeight) {
        this.fixCanvasHeight(canvasCellHeight);
      }

      return;
    }

    // If the gx-canvas-cell provokes overflow-y
    if (this.canvasFixedHeight <= canvasCellHeight) {
      this.canvasFixedHeight = canvasCellHeight;
      this.highestCanvasCellId = canvasCellId;

      // If the gx-canvas-cell with the max-height decreased its height
    } else if (this.highestCanvasCellId === canvasCellId) {
      this.canvasFixedHeight = this.getMaxHeightConstraint();
    }
  }

  /*  Returns the maxHeight of all gx-canvas-cell that has auto-grow == True.
      Also, stores the id of the gx-canvas-cell that acomplish the previous
      condition
  */
  private getMaxHeightConstraint(): number {
    const autoGrowCanvasCells = this.element.querySelectorAll(
      AUTOGROW_CANVAS_CELLS
    );

    let maxCanvasCellHeight = 0;

    // id starts on 0
    autoGrowCanvasCells.forEach((canvasCell: HTMLGxCanvasCellElement, id) => {
      const canvasCellHeight = this.getCanvasCellTotalHeight(canvasCell);

      if (maxCanvasCellHeight < canvasCellHeight) {
        maxCanvasCellHeight = canvasCellHeight;
        this.highestCanvasCellId = id.toString();
      }
    });

    return maxCanvasCellHeight;
  }

  disconnectedCallback() {
    if (this.watchForItemsObserver !== undefined) {
      this.watchForItemsObserver.disconnect();
      this.watchForItemsObserver = undefined;
    }
  }

  render() {
    this.element.addEventListener("click", this.handleClick);

    return (
      <Host
        style={{
          width: this.width,
          height:
            this.canvasFixedHeight == null
              ? this.minHeight
              : `${this.canvasFixedHeight}px`,
          "min-height": this.minHeight
        }}
      >
        <slot />
      </Host>
    );
  }
}
