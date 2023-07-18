import {
  Component,
  Element,
  Event,
  EventEmitter,
  Host,
  Listen,
  Prop,
  State,
  Watch,
  h
} from "@stencil/core";
import {
  ClickableComponent,
  CustomizableComponent,
  DisableableComponent,
  Component as GxComponent,
  VisibilityComponent
} from "../common/interfaces";

import { Swipeable, makeSwipeable } from "../common/events/swipeable";
import {
  HighlightableComponent,
  makeHighlightable
} from "../common/highlightable";

import { DISABLED_CLASS } from "../../common/reserved-names";

// Class transforms
import { getClasses } from "../common/css-transforms/css-transforms";

const CANVAS_THRESHOLD = 1.75;

/* - - - - - - - - SELECTORS - - - - - - - - */
const ALL_CANVAS_CELLS = ":scope > gx-canvas-cell";

const AUTOGROW_CANVAS_CELLS = ":scope > .auto-grow-cell";

const AUTOGROW_CANVAS_CELL_CLASS = (id: string) => `auto-grow-cell-${id}`;

const AUTOGROW_CANVAS_CELL_BY_ID = (id: string) =>
  `:scope > .${AUTOGROW_CANVAS_CELL_CLASS(id)}`;

const WITHOUT_AUTOGROW_CANVAS_CELLS = ":scope > .without-auto-grow-cell";

@Component({
  shadow: true,
  styleUrl: "canvas.scss",
  tag: "gx-canvas"
})
export class Canvas
  implements
    GxComponent,
    ClickableComponent,
    CustomizableComponent,
    DisableableComponent,
    HighlightableComponent,
    Swipeable,
    VisibilityComponent
{
  constructor() {
    this.handleClick = this.handleClick.bind(this);
  }

  @Element() element: HTMLGxCanvasElement;

  /**
   * A CSS class to set as the `gx-canvas` element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * This attribute lets you specify if the element is disabled.
   * If disabled, it will not fire any user interaction related event
   * (for example, click event).
   */
  @Prop() readonly disabled: boolean = false;

  /**
   * True to highlight control when an action is fired.
   */
  @Prop() readonly highlightable: boolean = false;

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
   * Stops event bubbling when the canvas is disabled
   * @param event The UI Event
   */
  @Listen("click", {})
  handleClick(event: UIEvent) {
    if (this.disabled) {
      event.stopPropagation();
    }

    // @todo: TODO Use a custom vdom event "gxClick"
  }

  /**
   * Its value is not null when there is a `gx-canvas-cell` that has more
   * height than the `gx-canvas` control. In this case, this state takes the
   * value of the highest `gx-canvas-cell`.
   */
  @State() canvasFixedHeight: number = null;

  // Useful to avoid extra calls for setCanvasAutoGrowMechanism()
  private autoGrowMechanismStarted = false;

  /*  Used to optimize height adjustments. This variable stores the "absolute"
      maximum height of all gx-canvas-cells with auto-grow = False
  */
  private canvasFixedMinHeight = 0;

  /**
   * `true` if the `componentDidLoad()` method was called
   */
  private didLoad = false;

  /*  Used to optimize height adjustments. This variable allows us to ignore
      the height adjustments triggered by a gx-canvas-cell that had less height
      than the highest gx-canvas-cell.
  */
  private highestCanvasCellId: string = null;

  /**
   * Reference to the  div `"canvas-cells-container"`. The height of this div
   * will be changed when at least one `gx-canvas-cell` needs to force
   * `auto-grow`
   */
  private innerCanvasContainer: HTMLDivElement;

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
  setCanvasAutoGrowMechanism() {
    if (!this.didLoad || this.autoGrowMechanismStarted) {
      return;
    }
    this.autoGrowMechanismStarted = true;

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

  /** In each gx-canvas-cell with `auto-grow = False`, we get their "absolute
      height". For example:
        - If `top="calc(50% + -100px)"` and `min-height="200px"` -> 200 + 0.5 * innerContainerCurrentHeight + -100px
        - If `top="25px"`               and `min-height="200px"` -> 225
        - If `top="25%"`                and `min-height="75%"`   -> 0

      `maxCanvasCellHeight` determines the max value of all "absolute heights".
      We use this variable to update the gx-canvas minHeight and to determinate
      if there is a gx-canvas-cell with auto-grow = False that is taller than
      the gx-canvas
  */
  private setCanvasMinHeight() {
    let maxCanvasCellHeight = 0;

    const withoutAutoGrowCanvasCells = this.element.querySelectorAll(
      WITHOUT_AUTOGROW_CANVAS_CELLS
    );
    const innerContainerCurrentHeight = this.innerCanvasContainer.clientHeight;

    withoutAutoGrowCanvasCells.forEach(
      (canvasCell: HTMLGxCanvasCellElement) => {
        let canvasCellHeight = 0;
        const { top, minHeight } = canvasCell;

        /*  If one of the properties includes "calc", it means that the other
            property has an absolute value (it includes "px")
        */
        if (top.includes("calc")) {
          canvasCellHeight =
            Number(minHeight.replace("px", "").trim()) +
            this.getValueOfCalcProperty(top, innerContainerCurrentHeight);
        } else if (minHeight.includes("calc")) {
          canvasCellHeight =
            Number(top.replace("px", "").trim()) +
            this.getValueOfCalcProperty(minHeight, innerContainerCurrentHeight);

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
    if (this.element.clientHeight === 0) {
      return;
    }

    /*  If there is a gx-canvas-cell with auto-grow = False that is taller than
        the canvas, we update the gx-canvas height
    */
    if (this.innerCanvasContainer.clientHeight < maxCanvasCellHeight) {
      this.fixCanvasHeight(maxCanvasCellHeight);
    }
  }

  /*  Observes canvas resizing. In each resize of the gx-canvas, it checks if
      there is a gx-canvas-cell that is taller than the gx-canvas.

      This observer is used while: this.canvasFixedHeight == null
  */
  private setCanvasObserver() {
    this.watchForCanvasObserver = new ResizeObserver(() => {
      /*  If one of the parent elements has display: none, we don't adjust
          the height of the gx-canvas
      */
      if (this.element.clientHeight === 0) {
        return;
      }

      /*  If we reach the minHeight determined by the gx-canvas-cells with
          auto-grow = False, we have to fix the height of the canvas
      */
      if (this.innerCanvasContainer.clientHeight <= this.canvasFixedMinHeight) {
        this.fixCanvasHeight(this.canvasFixedMinHeight);
        return;
      }

      /*  If the canvas decreased its height and there is a gx-canvas-cell that
          provokes overflow-y, we fix the canvas height
      */
      const maxHeightConstraint = this.getMaxHeightConstraint();
      if (
        this.innerCanvasContainer.clientHeight + CANVAS_THRESHOLD <
        maxHeightConstraint
      ) {
        this.fixCanvasHeight(maxHeightConstraint);
      }
    });

    this.watchForCanvasObserver.observe(this.innerCanvasContainer);
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

    /*  The gx-canvas observer is no longer needed, because resizing the layout
        will not cause any interruptions in this observer
     */
    this.disconnectCanvasObserver();

    this.canvasFixedHeight = maxHeightConstraint;
    this.canvasFixedMinHeight = maxCanvasCellMinHeight;
  }

  private getCanvasCellTotalHeight(
    canvasCell: HTMLGxCanvasCellElement
  ): number {
    return canvasCell.clientHeight + canvasCell.offsetTop;
  }

  /**
   * @param property The min-height or top property of a gx-canvas-cell
   * containing the string `"calc"`. For example, `"calc( 50% + -75px )"`
   * @param innerContainerCurrentHeight Height of div `"canvas-cells-container"`
   * @returns the absolute value of the `property` parameter
   */
  private getValueOfCalcProperty(
    property: string,
    innerContainerCurrentHeight: number
  ) {
    const reRelative = /-?\d+%/g;
    const reAbsolute = /-?\d+px/g;

    const relative = Number(property.match(reRelative)[0].replace("%", ""));
    const absolute = Number(property.match(reAbsolute)[0].replace("px", ""));

    return absolute + innerContainerCurrentHeight * (relative / 100);
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

    const innerContainerCurrentHeight = this.innerCanvasContainer.clientHeight;

    // Mixed height. For example, "min-height: calc( 50% + -75px )"
    if (minHeight.includes("calc")) {
      fixedHeight = this.getValueOfCalcProperty(
        minHeight,
        innerContainerCurrentHeight
      );

      // Relative height. For example, "min-height: 50%"
    } else if (minHeight.includes("%")) {
      const relative = Number(minHeight.replace("%", "").trim());

      fixedHeight = innerContainerCurrentHeight * (relative / 100);

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
      if (
        this.innerCanvasContainer.clientHeight + CANVAS_THRESHOLD <
        canvasCellHeight
      ) {
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

  private disconnectCanvasObserver() {
    if (this.watchForCanvasObserver) {
      this.watchForCanvasObserver.disconnect();
      this.watchForCanvasObserver = undefined;
    }
  }

  /**
   * In the following scenario:
   * ```
   *   <gx-canvas-cell min-height="680px">
   *     <gx-canvas min-height="90%">
   *        ...
   *     </gx-canvas>
   *   </gx-canvas-cell>
   * ```
   * Change the height of the `gx-canvas` to `calc(0.9 * 680px)`
   */
  private adjustHeightIfParentElementIsACanvasCell() {
    // Only applies when the canvas has a percentage height, not calc or px
    if (this.minHeight.includes("px") || this.minHeight.includes("calc")) {
      return;
    }
    const parentCell = this.element.parentElement;

    // The parent element must be a canvas cell
    if (parentCell.tagName.toLowerCase() !== "gx-canvas-cell") {
      return;
    }
    const parentCellHeight = (
      parentCell as HTMLGxCanvasCellElement
    ).minHeight.trim();

    // The parent canvas cell must have an absolute height, not calc or %
    if (parentCellHeight.includes("%")) {
      return;
    }

    /**
     * If `this.minHeight = 90%` --> `canvasPercentageHeightValue = 0.9`
     */
    const canvasPercentageHeightValue =
      Number(this.minHeight.replace("%", "")) / 100;

    this.element.style.setProperty(
      "height",
      `calc(${canvasPercentageHeightValue} * ${parentCellHeight})`
    );
  }

  componentDidLoad() {
    makeHighlightable(this);
    makeSwipeable(this);
    this.didLoad = true;

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // WA to adjust the height of the canvas in a certain scenario (nested canvas):
    //  - Canvas with relative value (%)
    //  - Parent element is a gx-canvas-cell with an absolute height (px)
    //
    // This WA won't solve the issue if the gx-canvas-cell has relative value.
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    this.adjustHeightIfParentElementIsACanvasCell();

    // The layout could be ready after the gx-canvas is rendered for the first time
    if (this.layoutIsReady) {
      this.setCanvasAutoGrowMechanism();
    }
  }

  disconnectedCallback() {
    if (this.watchForItemsObserver) {
      this.watchForItemsObserver.disconnect();
      this.watchForItemsObserver = undefined;
    }

    this.disconnectCanvasObserver();
  }

  render() {
    // Styling for gx-canvas control.
    const classes = getClasses(this.cssClass);

    return (
      <Host
        class={{
          [this.cssClass]: !!this.cssClass,
          [classes.vars]: true,
          [DISABLED_CLASS]: this.disabled
        }}
        style={{
          width: this.width,
          height: this.canvasFixedHeight == null ? this.minHeight : null,
          "min-height": this.canvasFixedHeight == null ? this.minHeight : null
        }}
      >
        <div
          class="canvas-cells-container"
          style={{
            height:
              this.canvasFixedHeight != null && `${this.canvasFixedHeight}px`,
            "min-height":
              this.canvasFixedHeight != null && `${this.canvasFixedMinHeight}px`
          }}
          ref={(el: HTMLDivElement) => (this.innerCanvasContainer = el)}
        >
          <slot />
        </div>
      </Host>
    );
  }
}
