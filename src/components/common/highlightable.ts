const HIGHLIGHT_EVENT_NAME = "highlight";
const UNHIGHTLIGHT_EVENT_NAME = "unhighlight";
const HIGHLIGHT_CLASS_NAME = "gx-highlighted";
let isSetup = false;

export interface HighlightableComponent {
  element: HTMLElement;
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

  if (component.highlightable) {
    if (!isSetup) {
      isSetup = true;
      setup();
    }

    actualHighlightableElement.addEventListener(
      HIGHLIGHT_EVENT_NAME,
      (event: CustomEvent) => {
        event.stopPropagation();
        component.element.classList.add(HIGHLIGHT_CLASS_NAME);
      }
    );
    actualHighlightableElement.addEventListener(
      UNHIGHTLIGHT_EVENT_NAME,
      (event: CustomEvent) => {
        event.stopPropagation();
        component.element.classList.remove(HIGHLIGHT_CLASS_NAME);
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
