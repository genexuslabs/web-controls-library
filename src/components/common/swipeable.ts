import { EventEmitter } from "@stencil/core";

export function makeSwipeable(comp: ISwipeable) {
  const element = comp.element;
  element.addEventListener("touchstart", startTouch);
  element.addEventListener("touchmove", moveTouch);

  let initialX = null;
  let initialY = null;

  function startTouch(e) {
    initialX = e.touches[0].clientX;
    initialY = e.touches[0].clientY;
  }

  function moveTouch(e) {
    e.preventDefault();

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

    comp.onSwipe.emit(event);
    if (Math.abs(diffX) > Math.abs(diffY)) {
      // sliding horizontally
      if (diffX > 0) {
        // swiped left
        comp.onSwipeLeft.emit(event);
      } else {
        // swiped right
        comp.onSwipeRight.emit(event);
      }
    } else {
      // sliding vertically
      if (diffY > 0) {
        // swiped up
        comp.onSwipeUp.emit(event);
      } else {
        // swiped down
        comp.onSwipeDown.emit(event);
      }
    }

    initialX = null;
    initialY = null;
  }
}

export interface ISwipeable {
  element: HTMLElement;
  onSwipe: EventEmitter;
  onSwipeLeft: EventEmitter;
  onSwipeRight: EventEmitter;
  onSwipeUp: EventEmitter;
  onSwipeDown: EventEmitter;
}
