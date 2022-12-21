import { EventEmitter } from "@stencil/core";

export function makeSwipeable(comp: Swipeable) {
  const element = comp.element;
  element.addEventListener("touchstart", startTouch);
  element.addEventListener("touchmove", moveTouch);

  let initialX: number = null;
  let initialY: number = null;

  function startTouch(e: TouchEvent) {
    initialX = e.touches[0].clientX;
    initialY = e.touches[0].clientY;
  }

  function moveTouch(e: TouchEvent) {
    if (initialX === null) {
      return;
    }

    if (initialY === null) {
      return;
    }

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;

    const diffX = initialX - currentX;
    const diffY = initialY - currentY;

    comp.swipe.emit(event);
    if (Math.abs(diffX) > Math.abs(diffY)) {
      // sliding horizontally
      if (diffX > 0) {
        // swiped left
        comp.swipeLeft.emit(event);
      } else {
        // swiped right
        comp.swipeRight.emit(event);
      }
    } else {
      // sliding vertically
      if (diffY > 0) {
        // swiped up
        comp.swipeUp.emit(event);
      } else {
        // swiped down
        comp.swipeDown.emit(event);
      }
    }

    initialX = null;
    initialY = null;
  }
}

export interface Swipeable {
  element: HTMLElement;
  swipe: EventEmitter;
  swipeLeft: EventEmitter;
  swipeRight: EventEmitter;
  swipeUp: EventEmitter;
  swipeDown: EventEmitter;
}
