import {
  tHighlighted,
  tEvenRowHighlighted,
  tOddRowHighlighted,
  tSelectedTabCaptionHighlighted,
  tUnselectedTabCaptionHighlighted
} from "./css-transforms/css-transforms";

const HIGHLIGHT_EVENT_NAME = "highlight";
const UNHIGHTLIGHT_EVENT_NAME = "unhighlight";
let isSetup = false;

export interface HighlightableComponent {
  element: HTMLElement;
  cssClass?: string;
  highlightable: boolean;

  /** (`gx-grid-smart-cell` property) */
  isRowEven?: boolean;

  /**
   * (`gx-tab-caption` property) This attribute lets you specify if the tab page corresponding to this caption is selected
   */
  selected?: boolean;
  /**
   * (`gx-tab-caption` property) A CSS class to set as the `gx-tab-caption` element class when `selected = true`.
   */
  selectedCssClass?: string;
  /**
   * (`gx-tab-caption` property) A CSS class that is used by the `gx-tab` parent container.
   */
  tabCssClass?: string;
}

/**
 * @param component The highlightable component.
 * @param innerElement Specifies a descendant of the `component`. If defined, the highlight class will be applied to this element.
   @param highlightableOption Useful to customizing gx-grid cells and tab captions.
*/
export function makeHighlightable(
  component: HighlightableComponent,
  innerElement?: HTMLElement,
  highlightableOption?: "grid-cell" | "tab-caption"
) {
  const actualHighlightableElement = innerElement || component.element;

  /*  Used to store the last value of the cssClass, selected selectedCssClass
      and tabCssClass properties
  */
  let lastCssClass: string;
  // let lastSelected: string;
  // let lastSelectedCssClass: string;
  // let lastTabCssClass: string;

  // Used to remove the last highlighted class when the click event has ended
  let highlightedClasses: string[];

  let highlightedFunction: (x: string) => string;

  // Depending on the component, we implement different highlighting functions
  switch (highlightableOption) {
    case undefined:
      highlightedFunction = tHighlighted;
      break;

    case "grid-cell":
      highlightedFunction = component.isRowEven
        ? tEvenRowHighlighted
        : tOddRowHighlighted;
      break;

    case "tab-caption":
      highlightedFunction = component.selected
        ? tSelectedTabCaptionHighlighted
        : tUnselectedTabCaptionHighlighted;
      break;
  }

  if (component.highlightable) {
    if (!isSetup) {
      isSetup = true;
      setup();
    }

    actualHighlightableElement.addEventListener(
      HIGHLIGHT_EVENT_NAME,
      (event: CustomEvent) => {
        event.stopPropagation();

        // If the component does not have a class, we reset the highlighted class
        if (component.cssClass == null) {
          lastCssClass = null;
          highlightedClasses = [];

          // If the class did change since the last tap event, we recalculate the highlighted class
        } else if (component.cssClass != lastCssClass) {
          lastCssClass = component.cssClass;
          highlightedClasses = lastCssClass.split(" ").map(highlightedFunction);
        }

        highlightedClasses.forEach(highlightedClass => {
          actualHighlightableElement.classList.add(highlightedClass);
        });
      }
    );
    actualHighlightableElement.addEventListener(
      UNHIGHTLIGHT_EVENT_NAME,
      (event: CustomEvent) => {
        event.stopPropagation();

        highlightedClasses.forEach(highlightedClass => {
          actualHighlightableElement.classList.remove(highlightedClass);
        });
      }
    );
  }
}

function setup() {
  setupEvent("mousedown", "mouseup", "mouseout");
  setupEvent("touchstart", "touchend", "touchcancel");
}

function setupEvent(
  startEventName: string,
  endEventName1: string,
  endEventName2: string
) {
  document.body.addEventListener(startEventName, startEvent => {
    fireCustomEvent(HIGHLIGHT_EVENT_NAME, startEvent.target as HTMLElement);
    const mouseUpHandler = endEvent => {
      fireCustomEvent(UNHIGHTLIGHT_EVENT_NAME, endEvent.target as HTMLElement);
      document.body.removeEventListener(endEventName1, mouseUpHandler);
      document.body.removeEventListener(endEventName2, mouseUpHandler);
    };
    document.body.addEventListener(endEventName1, mouseUpHandler);
    document.body.addEventListener(endEventName2, mouseUpHandler);
  });
}

function fireCustomEvent(eventName: string, element: HTMLElement) {
  const highlightEvent = new CustomEvent(eventName, {
    bubbles: true
  });
  element.dispatchEvent(highlightEvent);
}
