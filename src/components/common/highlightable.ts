import { tHighlighted } from "./css-transforms/css-transforms";

const HIGHLIGHT_EVENT_NAME = "highlight";
const UNHIGHTLIGHT_EVENT_NAME = "unhighlight";
let isSetup = false;

export interface HighlightableComponent {
  element: HTMLElement;
  cssClass?: string;
  highlightable: boolean;
}

/**
 * @param component The highlightable component.
 * @param innerElement Specifies a descendant of the `component`. If defined, the highlight class will be applied to this element.
 */
export function makeHighlightable(
  component: HighlightableComponent,
  innerElement?: HTMLElement
) {
  const actualHighlightableElement = innerElement || component.element;

  // Used to store the last value of the cssClass property
  let lastCssClass: string;

  // Used to remove the last highlighted class when the click event has ended
  let highlightedClasses: string[];

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
          highlightedClasses = null;

          // If the class did change since the last tap event, we recalculate the highlighted class
        } else if (component.cssClass != lastCssClass) {
          lastCssClass = component.cssClass;
          highlightedClasses = lastCssClass.split(" ").map(tHighlighted);
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
