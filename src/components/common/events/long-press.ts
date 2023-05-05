import { EventEmitter } from "@stencil/core";

const START_LONG_PRESS_EVENT_NAME = "start-long-press";
const END_LONG_PRESS_EVENT_NAME = "end-long-press";
const LONG_PRESS_DELAY = 500; // 500ms

let isSetup = false;
let timer: NodeJS.Timeout = null;

export interface LongPressComponent {
  element: HTMLElement;
  longPressable: boolean;
  longPress: EventEmitter<any>;
}

/**
 * Set up event listeners to implement a long-press action on the component.
 * @param component The long pressable component.
 * @param innerElement Specifies a descendant of the `component`. If defined, the long press event will be listened in this element.
 */
export function makeLongPressable(
  component: LongPressComponent,
  innerElement?: HTMLElement
) {
  if (component.longPressable) {
    if (!isSetup) {
      isSetup = true;
      setup();
    }
    const actualLongPressableElement = innerElement || component.element;

    actualLongPressableElement.addEventListener(
      START_LONG_PRESS_EVENT_NAME,
      (event: CustomEvent) => {
        event.stopPropagation();

        // Emit longPress event
        timer = setTimeout(function () {
          component.longPress.emit(event);
        }, LONG_PRESS_DELAY);
      }
    );
    actualLongPressableElement.addEventListener(
      END_LONG_PRESS_EVENT_NAME,
      (event: CustomEvent) => {
        event.stopPropagation();
        clearTimeout(timer);
      }
    );
  }
}

// The body will listen to these events
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
    fireCustomEvent(
      START_LONG_PRESS_EVENT_NAME,
      startEvent.target as HTMLElement
    );

    const mouseUpHandler = (endEvent: Event) => {
      fireCustomEvent(
        END_LONG_PRESS_EVENT_NAME,
        endEvent.target as HTMLElement
      );

      // Remove end event listeners
      document.body.removeEventListener(endEventName1, mouseUpHandler);
      document.body.removeEventListener(endEventName2, mouseUpHandler);
    };

    // When the mouse is down, we listen for end events
    document.body.addEventListener(endEventName1, mouseUpHandler);
    document.body.addEventListener(endEventName2, mouseUpHandler);
  });
}

function fireCustomEvent(eventName: string, element: HTMLElement) {
  const tapEvent = new CustomEvent(eventName, { bubbles: true });
  element.dispatchEvent(tapEvent);
}
