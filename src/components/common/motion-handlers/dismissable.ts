import { onMobileDevice } from "../utils";

export interface DismissableComponent {
  element: HTMLElement;
  triggerDismiss: boolean;
}

export const SHOULD_DISMISS = "gx-should-dismiss";
export const STOP_DISMISS = "gx-stop-dismiss";

/**
 * Implement swipe left and swipe right to dismiss the `component` element
 * @param component Draggable element
 */
export function makeDismissable(component: DismissableComponent) {
  const SPEED_THRESHOLD = 1.4;
  const THRESHOLD_TO_DISMISS = 0.5; // 50% of dragging
  const THRESHOLD_TO_DISMISS_2 = 0.1; // 10% of dragging
  const WAIT_FOR_DISMISS = 250; // 250ms

  const elem = component.element;

  let elemWidth: number;
  let isMouseDown = false;

  /** Used to calculate the deltaT */
  let initialTimestamp: number;

  let needForRAF = true; // To prevent redundant RAF (request animation frame) calls

  /** Relative to the left edge of the entire document */
  let currentX: number;

  /** Relative to the left edge of the entire document */
  let initialX: number;

  const startDragging = () => {
    requestAnimationFrame(t => {
      initialTimestamp = t; // Initialize timestamp

      currentX = initialX;

      isMouseDown = true;
      elemWidth = elem.offsetWidth; // Store element's width as it won't change when dragging

      // Since we will change the transform property of the element, we disable
      // the transition duration to avoid delays
      elem.style.transitionDuration = "unset";
      elem.classList.add(STOP_DISMISS);
    });
  };

  // Web
  const startDraggingWeb = (e: MouseEvent) => {
    initialX = e.pageX;
    startDragging();
  };

  // Mobile
  const startDraggingMobile = (e: TouchEvent) => {
    initialX = e.touches[0].clientX;
    startDragging();
  };

  const draggingRAF = () => {
    if (!isMouseDown || !needForRAF) {
      return;
    }
    needForRAF = false; // No need to call RAF up until next frame

    requestAnimationFrame(() => {
      needForRAF = true; // RAF now consumes the movement instruction so a new one can come

      // To reduce the drag's speed, multiply walk with a constant
      const walk = currentX - initialX;
      elem.style.transform = `translateX(${walk}px)`;
      elem.style.opacity = (1 - Math.abs(walk) / elemWidth).toFixed(2);
    });
  };

  // Web
  const draggingWeb = (e: MouseEvent) => {
    e.preventDefault();
    currentX = e.pageX; // Store current pageX

    draggingRAF();
  };

  // Mobile
  const draggingMobile = (e: TouchEvent) => {
    e.preventDefault();
    currentX = e.touches[0].clientX; // Store current clientX

    draggingRAF();
  };

  const stopDragging = () => {
    // Only stop dragging if the mouse was clicked
    if (!isMouseDown) {
      return;
    }

    requestAnimationFrame(t => {
      const deltaT = t - initialTimestamp;
      const deltaX = currentX - initialX;
      const speed = deltaT !== 0 ? Math.abs(deltaX / deltaT) : 0;

      isMouseDown = false;

      // Re-enable transition duration property
      elem.style.transitionDuration = null;

      const { left } = elem.getBoundingClientRect();
      const elemShouldDismiss =
        Math.abs(left) > elemWidth * THRESHOLD_TO_DISMISS ||
        (Math.abs(left) > elemWidth * THRESHOLD_TO_DISMISS_2 &&
          speed > SPEED_THRESHOLD);

      if (elemShouldDismiss) {
        // Depending of the gesture of dismissing, we dismiss to the right or
        // to the left
        elem.style.transform =
          left > 0 ? "translateX(128%)" : "translateX(-128%)";
        elem.style.opacity = "0";

        setTimeout(() => {
          requestAnimationFrame(() => {
            elem.classList.add(SHOULD_DISMISS);
            elem.style.transform = null;
            elem.style.opacity = null;
            component.triggerDismiss = !component.triggerDismiss;
          });
        }, WAIT_FOR_DISMISS);

        // If the threshold was not exceeded, we return the element to its original
        // position
      } else {
        elem.style.transform = null;
        elem.style.opacity = null;
        elem.classList.remove(STOP_DISMISS);
      }
    });
  };

  // Dragging events
  if (onMobileDevice()) {
    elem.addEventListener("touchstart", startDraggingMobile, { passive: true });

    elem.addEventListener("touchmove", draggingMobile);

    elem.addEventListener("touchcancel", stopDragging);
    elem.addEventListener("touchend", stopDragging);
  } else {
    elem.addEventListener("mousedown", startDraggingWeb);

    elem.addEventListener("mousemove", draggingWeb);

    elem.addEventListener("mouseleave", stopDragging);
    elem.addEventListener("mouseup", stopDragging);
  }
}
