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
  const THRESHOLD_TO_DISMISS = 0.5; // 50% of dragging
  const WAIT_FOR_DISMISS = 250; // 250ms

  const elem = component.element;

  let elemWidth: number;
  let isMouseDown = false;
  let needForRAF = true; // To prevent redundant RAF (request animation frame) calls

  /** Relative to the left edge of the entire document */
  let currentXPosition: number;

  /** Relative to the left edge of the entire document */
  let initialXPosition: number;

  const startDragging = (event: MouseEvent) => {
    isMouseDown = true;
    initialXPosition = event.pageX;
    elemWidth = elem.offsetWidth; // Store element's width as it won't change when dragging

    // Since we will change the transform property of the element, we disable
    // the transition duration to avoid delays
    elem.style.transitionDuration = "unset";
    elem.classList.add(STOP_DISMISS);
  };

  const dragging = (event: MouseEvent) => {
    event.preventDefault();
    currentXPosition = event.pageX; // Store last pageX

    if (!isMouseDown || !needForRAF) {
      return;
    }
    needForRAF = false; // No need to call RAF up until next frame

    requestAnimationFrame(() => {
      needForRAF = true; // RAF now consumes the movement instruction so a new one can come

      // To reduce the drag's speed, multiply walk with a constant
      const walk = currentXPosition - initialXPosition;
      elem.style.transform = `translateX(${walk}px)`;
      elem.style.opacity = (1 - Math.abs(walk) / elemWidth).toFixed(2);
    });
  };

  const stopDragging = () => {
    requestAnimationFrame(() => {
      isMouseDown = false;

      // Re-enable transition duration property
      elem.style.transitionDuration = null;

      const { left } = elem.getBoundingClientRect();
      const elemShouldDismiss =
        Math.abs(left) > elemWidth * THRESHOLD_TO_DISMISS;

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
    elem.addEventListener("touchstart", startDragging);

    elem.addEventListener("touchmove", dragging);

    elem.addEventListener("touchcancel", stopDragging);
    elem.addEventListener("touchend", stopDragging);
  } else {
    elem.addEventListener("mousedown", startDragging);

    elem.addEventListener("mousemove", dragging);

    elem.addEventListener("mouseleave", stopDragging);
    elem.addEventListener("mouseup", stopDragging);
  }
}
