import { Component } from "./interfaces";

export function debounce(
  func: () => void,
  wait: number,
  immediate = false
): () => void {
  let timeout;
  return function(...args) {
    const later = function() {
      timeout = null;
      if (!immediate) {
        func.apply(this, args);
      }
    }.bind(this);
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(this, args);
    }
  };
}

/*  This functions overrides a method adding calls before (`before()`) and
    after (`after()`) 
*/
export function overrideMethod(
  component: Component,
  methodName: string,
  { before, after }: { before?: () => void; after?: () => void }
) {
  const oldMethod = component[methodName];
  component[methodName] = () => {
    if (before !== undefined) {
      before();
    }

    if (oldMethod !== undefined) {
      oldMethod.call(component);
    }

    if (after !== undefined) {
      after();
    }
  };
}

export function getFileNameWithoutExtension(filePath: string) {
  /*  If the function is called in the same folder as the file, 
      lastIndexOf("/") might return -1, but since we add 1 to the result, the
      value of fileNameStartIndex will be 0.

      If lastIndexOf("/") >= 0, it means that filePath has at least one "/" and
      adding 1 to the result of the function will return the index where the
      fileName starts.
  */
  const fileNameStartIndex = filePath.lastIndexOf("/") + 1;

  // We store the fileName that could have extension
  const fileName = filePath.substring(fileNameStartIndex);

  const extensionIndex = fileName.lastIndexOf(".");

  // If the file does not have extension
  if (extensionIndex === -1) {
    return fileName;
  }

  // Returns the name between the last "/" and the last "." of the `fileName`
  return fileName.substring(0, extensionIndex);
}

/**
 * Implement horizontal scrolling by dragging the `scrollableContainer` element
 * @param scrollableContainer Draggable element
 */
export function attachMouseHorizontalScrollHandler(
  scrollableContainer: HTMLElement
) {
  // If we are on a mobile device
  if (window.matchMedia("(pointer: coarse)").matches) {
    return;
  }
  const SCROLL_SPEED = 1;

  let isMouseDown = false;
  let scrollableContainerHasBeenDragged = false;

  /** Relative to the left edge of the entire document */
  let initialXPosition;
  let initialScrollLeftPosition;

  scrollableContainer.addEventListener("mousedown", (event: MouseEvent) => {
    // Reset variable as in some scenarios it might be true
    scrollableContainerHasBeenDragged = false;

    isMouseDown = true;
    initialXPosition = event.pageX;
    initialScrollLeftPosition = scrollableContainer.scrollLeft;
  });

  scrollableContainer.addEventListener("mousemove", (event: MouseEvent) => {
    event.preventDefault();
    if (!isMouseDown) {
      return;
    }
    scrollableContainerHasBeenDragged = true;

    const currentXPosition = event.pageX;
    const walk = (currentXPosition - initialXPosition) * SCROLL_SPEED;
    scrollableContainer.scrollLeft = initialScrollLeftPosition - walk;
  });

  /*
   * Since the click event fires when a mousedown and mouseup event occur on
   * the same element, we need to prevent event listeners from being dispatched
   * in the capture phase if the `scrollableContainer` has been dragged
   */
  scrollableContainer.addEventListener(
    "click",
    event => {
      if (!scrollableContainerHasBeenDragged) {
        return;
      }
      scrollableContainerHasBeenDragged = false;

      // Stop event listener
      event.stopImmediatePropagation();
      event.stopPropagation();
    },
    true
  );

  const stopDragging = () => {
    isMouseDown = false;
  };

  // Stop dragging events
  scrollableContainer.addEventListener("mouseleave", stopDragging);
  scrollableContainer.addEventListener("mouseup", stopDragging);
}

export function attachHorizontalScrollWithWheelHandler(
  scrollableContainer: HTMLElement
) {
  // If we are on a mobile device
  if (window.matchMedia("(pointer: coarse)").matches) {
    return;
  }
  const SCROLL_SPEED = 0.1875; // 2^(-3) + 2^(-4)

  scrollableContainer.addEventListener("wheel", (event: WheelEvent) => {
    event.preventDefault();
    scrollableContainer.scrollLeft += event.deltaY * SCROLL_SPEED;
  });
}
