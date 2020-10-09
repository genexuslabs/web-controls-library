const HIGHLIGHT_EVENT_NAME = "highlight";
const UNHIGHTLIGHT_EVENT_NAME = "unhighlight";
const HIGHLIGHT_CLASS_NAME = "gx-highlighted";
let isSetup = false;

export function makeHighlightable(element: HTMLElement) {
  if (!isSetup) {
    isSetup = true;
    setup();
  }

  element.addEventListener(HIGHLIGHT_EVENT_NAME, (event: CustomEvent) => {
    event.stopPropagation();
    element.classList.add(HIGHLIGHT_CLASS_NAME);
  });
  element.addEventListener(UNHIGHTLIGHT_EVENT_NAME, (event: CustomEvent) => {
    event.stopPropagation();
    element.classList.remove(HIGHLIGHT_CLASS_NAME);
  });
}

function setup() {
  setupEvent("mousedown", "mouseup", "mousemove");
  setupEvent("touchstart", "touchend", "touchmove");
}

function setupEvent(
  startEventName: string,
  endEventName: string,
  moveEventName: string
) {
  document.body.addEventListener(startEventName, startEvent => {
    fireCustomEvent(HIGHLIGHT_EVENT_NAME, startEvent.target as HTMLElement);
    const mouseUpHandler = endEvent => {
      fireCustomEvent(UNHIGHTLIGHT_EVENT_NAME, endEvent.target as HTMLElement);
      document.body.removeEventListener(endEventName, mouseUpHandler);
      document.body.removeEventListener(moveEventName, mouseUpHandler);
    };
    document.body.addEventListener(endEventName, mouseUpHandler);
    document.body.addEventListener(moveEventName, mouseUpHandler);
  });
}

function fireCustomEvent(eventName: string, element: HTMLElement) {
  const highlightEvent = new CustomEvent(eventName, {
    bubbles: true
  });
  element.dispatchEvent(highlightEvent);
}
