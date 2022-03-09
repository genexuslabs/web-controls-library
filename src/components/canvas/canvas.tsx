import {
  Component,
  Element,
  Event,
  EventEmitter,
  Prop,
  h,
  Host,
  State,
  Watch
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
const ALL_CANVAS_CELLS = ":scope > .canvas-cells-container > gx-canvas-cell";

const AUTOGROW_CANVAS_CELLS =
  ":scope > .canvas-cells-container > .auto-grow-cell";

const AUTOGROW_CANVAS_CELL_CLASS = (id: string) => {
  return `autogrow-cell-${id}`;
};

const AUTOGROW_CANVAS_CELL_BY_ID = (id: string) => {
  return `:scope > .canvas-cells-container > .${AUTOGROW_CANVAS_CELL_CLASS(
    id
  )}`;
};

const WITHOUT_AUTOGROW_CANVAS_CELLS =
  ":scope > .canvas-cells-container > .without-auto-grow-cell";

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
  @Prop() readonly disabled: boolean = false;

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
   * This attribute defines when the layout has been fully loaded. Useful for
   * determining if the canvas control can set the auto-grow mechanism
   */
  @Prop() readonly layoutIsReady: boolean = false;

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

  /*  Used to optimize height adjustments. This variable stores the "absolute"
      maximum height of all gx-canvas-cells with auto-grow = False 
  */
  private canvasFixedMinHeight = 0;

  /*  Used to optimize height adjustments. This variable allows us to ignore
      the height adjustments triggered by a gx-canvas-cell that had less height
      than the highest gx-canvas-cell.
  */
  private highestCanvasCellId: string = null;

  // Observers
  private watchForItemsObserver: ResizeObserver;
  private watchForCanvasObserver: ResizeObserver;

  /**
   * If the layout is loaded, this property will change to true and we will
   * calculate an additional minHeight of the `gx-canvas` based on the absolute
   * height of the `gx-canvas-cell`s with `autoGrow == False`
   * (`maxHeight != null`), then we will set the observers to implement
   * autoGrow on the `gx-canvas` control.
   */
  @Watch("layoutIsReady")
  setCanvasAutoHeight() {
    this.setCanvasMinHeight();

    /*  At this point, if (this.canvasFixedHeight == null) we can assume that
        gx-canvas-cells with "auto-grow = False" were not taller than the
        gx-canvas. So, we need to set up the canvas observer
    */
    if (this.canvasFixedHeight == null) {
      this.setCanvasObserver();
    }

    this.setCanvasCellsObserver();
  }

  /*  In each gx-canvas-cell with auto-grow = False, we get their "absolute
      height". For example:
        - If top="calc(50% + -100px)" and min-height="200px" -> 200
        - If top="25px"               and min-height="200px" -> 225
        - If top="25%"                and min-height="75%"   -> 0
  
      'maxCanvasCellHeight' determines the max value of all "absolute heights".
      We use this variable to update the gx-canvas minHeight and to determinate
      if there is a gx-canvas-cell with auto-grow = False that is taller than
      the gx-canvas
  */
  private setCanvasMinHeight() {
    let maxCanvasCellHeight = 0;

    const withoutAutoGrowCanvasCells = this.element.querySelectorAll(
      WITHOUT_AUTOGROW_CANVAS_CELLS
    );
    withoutAutoGrowCanvasCells.forEach(
      (canvasCell: HTMLGxCanvasCellElement) => {
        let canvasCellHeight = 0;
        const { top, minHeight } = canvasCell;

        /*  If one of the properties includes "calc", it means that the other
            property has an absolute value (it includes "px")
        */
        if (top.includes("calc")) {
          canvasCellHeight = Number(minHeight.replace("px", "").trim());
        } else if (minHeight.includes("calc")) {
          canvasCellHeight = Number(top.replace("px", "").trim());

          /*  If neither property includes "calc", it means that both properties
              can be relative (they include "%") or absolute (they include "px")
          */
        } else {
          if (top.includes("px")) {
            canvasCellHeight = Number(top.replace("px", "").trim());
          }

          if (minHeight.includes("px")) {
            canvasCellHeight += Number(minHeight.replace("px", "").trim());
          }
        }
        maxCanvasCellHeight = Math.max(maxCanvasCellHeight, canvasCellHeight);
      }
    );
    /*  If there is a gx-canvas-cell with auto-grow = False that has absolute
        properties, we update the gx-canvas minHeight
    */
    this.canvasFixedMinHeight = maxCanvasCellHeight;

    /*  If one of the parent elements has display: none, we don't adjust the
        height of the gx-canvas
    */
    if (this.element.clientHeight == 0) {
      return;
    }

    /*  If there is a gx-canvas-cell with auto-grow = False that is taller than
        the canvas, we update the gx-canvas height
    */
    if (this.element.clientHeight < maxCanvasCellHeight) {
      this.fixCanvasHeight(maxCanvasCellHeight);
    }
  }

  /*  Observes canvas resizing. In each resize of the gx-canvas, it checks if
      there is a gx-canvas-cell that is taller than the gx-canvas.

      This observer is used while: this.canvasFixedHeight == null
  */
  private setCanvasObserver() {
    this.watchForCanvasObserver = new ResizeObserver(() => {
      if (this.canvasFixedHeight != null) {
        this.watchForCanvasObserver.disconnect();
        this.watchForCanvasObserver = undefined;
        return;
      }

      /*  If one of the parent elements has display: none, we don't adjust
          the height of the gx-canvas
      */
      if (this.element.clientHeight == 0) {
        return;
      }

      /*  If we reach the minHeight determined by the gx-canvas-cells with
          auto-grow = False, we have to fix the height of the canvas
      */
      if (this.element.clientHeight <= this.canvasFixedMinHeight) {
        this.fixCanvasHeight(this.canvasFixedMinHeight);
        return;
      }

      /*  If the canvas decreased its height and there is a gx-canvas-cell that
          provokes overflow-y, we fix the canvas height 
      */
      const maxHeightConstraint = this.getMaxHeightConstraint();
      if (this.element.clientHeight + THRESHOLD < maxHeightConstraint) {
        this.fixCanvasHeight(maxHeightConstraint);
      }
    });

    this.watchForCanvasObserver.observe(this.element);
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
    let maxCanvasCellMinHeight = 0;

    /*  In each gx-canvas-cell, we adapt its top, min-height and max-height
        values to make them absolute
    */
    const canvasCells = this.element.querySelectorAll(ALL_CANVAS_CELLS);
    canvasCells.forEach((canvasCell: HTMLGxCanvasCellElement) => {
      const minHeight = this.fixCanvasCellProperties(canvasCell);

      maxCanvasCellMinHeight = Math.max(maxCanvasCellMinHeight, minHeight);
    });

    this.canvasFixedHeight = maxHeightConstraint;
    this.canvasFixedMinHeight = maxCanvasCellMinHeight;
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

      Also, this functions returns: top + min-height in pixels
  */
  private fixCanvasCellProperties(canvasCell: HTMLGxCanvasCellElement): number {
    const fixedTop = canvasCell.offsetTop;
    canvasCell.style.setProperty("top", `${fixedTop}px`);

    const minHeight = canvasCell.minHeight;
    let fixedHeight: number;

    const canvasInitialHeight = this.element.clientHeight;

    // Mixed height. For example, "min-height: calc( 50% + -75px )"
    if (minHeight.includes("calc")) {
      const reRelative = /-?\d+%/g;
      const reAbsolute = /-?\d+px/g;

      const relative = Number(minHeight.match(reRelative)[0].replace("%", ""));
      const absolute = Number(minHeight.match(reAbsolute)[0].replace("px", ""));

      fixedHeight = absolute + canvasInitialHeight * (relative / 100);

      // Relative height. For example, "min-height: 50%"
    } else if (minHeight.includes("%")) {
      const relative = Number(minHeight.replace("%", "").trim());

      fixedHeight = canvasInitialHeight * (relative / 100);

      // Absolute height. For example, "min-height: 100px"
    } else {
      fixedHeight = Number(minHeight.replace("px", "").trim());
    }

    canvasCell.style.setProperty("min-height", `${fixedHeight}px`);

    /*  If the gx-canvas-cell has auto-grow == False, we limit its height and
        return: top + height
    */
    if (canvasCell.maxHeight != null) {
      canvasCell.style.setProperty("max-height", `${fixedHeight}px`);
      return fixedTop + fixedHeight;
    }

    // If the gx-canvas-cell has auto-grow == True, we return 0
    return 0;
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
      Also, it stores the id of the gx-canvas-cell that accomplish the previous
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

  private handleClick(event: UIEvent) {
    if (this.disabled) {
      return;
    }

    this.gxClick.emit(event);
  }

  componentDidLoad() {
    makeSwipeable(this);
  }

  disconnectedCallback() {
    if (this.watchForItemsObserver !== undefined) {
      this.watchForItemsObserver.disconnect();
      this.watchForItemsObserver = undefined;
    }

    if (this.watchForCanvasObserver !== undefined) {
      this.watchForCanvasObserver.disconnect();
      this.watchForCanvasObserver = undefined;
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
          "min-height":
            this.canvasFixedHeight == null
              ? this.minHeight
              : `${this.canvasFixedMinHeight}px`
        }}
      >
        <div class="canvas-cells-container">
          <slot />
        </div>
      </Host>
    );
  }
}
