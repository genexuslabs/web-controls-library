import { Component } from "./interfaces";

// - - - - - - - - -  CACHE  - - - - - - - - -
/**
 * - Input: CSS color.
 * - Output: Contrast color (`"#000"` or `"#fff"`) of the input.
 */
const contrastColorCache = new Map<string, string>();

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

/**
 * @returns `true` if the application body has a vertical scroll. In other words, it returns `true` if the vertical content is not fully visible
 */
export function bodyOverflowsY() {
  return (
    document.documentElement.clientHeight !=
    document.documentElement.scrollHeight
  );
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
 * Find the contrast color (white or black) for the `rgb` parameter following the WCAG 2.0.
 * @param rgb An RGB string that represents a color.
 * @returns The contrast color (`"#000"` or `"#fff"`) for the `rgb` parameter.
 */
export function getContrastColor(rgb: string): string {
  let result = contrastColorCache.get(rgb);

  // TODO: Parse all kinds of colors, not just RGB colors

  // If the value has not yet been calculated
  if (result === undefined) {
    const colors: any = rgb.replace(/[^\d\s]/g, "").split(" ");

    for (let i = 0; i < 3; i++) {
      colors[i] /= 255.0;

      if (colors[i] <= 0.04045) {
        colors[i] /= 12.92;
      } else {
        colors[i] = ((colors[i] + 0.055) / 1.055) ** 2.4;
      }
    }
    const L = 0.2126 * colors[0] + 0.7152 * colors[1] + 0.0722 * colors[2];

    // Cache for the corresponding value
    result = L > 0.179 ? "#000" : "#fff";
    contrastColorCache.set(rgb, result);
  }

  return result;
}

export function setContrastColor(
  elemToRead: HTMLElement,
  elemToSet: HTMLElement,
  propName: string,
  cssVarName: string
) {
  const color = getComputedStyle(elemToRead).getPropertyValue(propName);

  if (color != undefined) {
    const contrast = getContrastColor(color);
    elemToSet.style.setProperty(cssVarName, contrast);
  }
}

export function getWindowsOrientation(): "portrait" | "landscape" {
  return window.matchMedia("(orientation: portrait)").matches
    ? "portrait"
    : "landscape";
}

export function onMobileDevice(): boolean {
  return window.matchMedia("(pointer: coarse)").matches;
}

export function getLottiePath(computed: CSSStyleDeclaration): string {
  // Anything other than "--gx-animation-type: lottie" is considered a native animation
  if (computed.getPropertyValue("--gx-animation-type").trim() != "lottie") {
    return "";
  }

  // Remove quotes from the lottie path
  return computed
    .getPropertyValue("--gx-lottie-file-path")
    .trim()
    .replace(/^"/, "")
    .replace(/"$/, "");
}

/**
 * Implement horizontal scrolling by dragging the `scrollableContainer` element
 * @param scrollableContainer Draggable element
 */
export function attachHorizontalScrollWithDragHandler(
  scrollableContainer: HTMLElement
) {
  // If we are on a mobile device
  if (onMobileDevice()) {
    return;
  }

  let isMouseDown = false;
  let needForRAF = true; // To prevent redundant RAF (request animation frame) calls
  let scrollableContainerHasBeenDragged = false;

  /** Relative to the left edge of the entire document */
  let currentXPosition: number;

  /** Relative to the left edge of the entire document */
  let initialXPosition: number;
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
    currentXPosition = event.pageX; // Store last pageX

    if (!isMouseDown || !needForRAF) {
      return;
    }
    needForRAF = false; // No need to call RAF up until next frame

    requestAnimationFrame(() => {
      needForRAF = true; // RAF now consumes the movement instruction so a new one can come

      // To reduce the drag's speed, multiply walk with a constant
      const walk = currentXPosition - initialXPosition;
      scrollableContainer.scrollLeft = initialScrollLeftPosition - walk;
      scrollableContainerHasBeenDragged =
        scrollableContainerHasBeenDragged ||
        initialScrollLeftPosition != scrollableContainer.scrollLeft;
    });
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
  if (onMobileDevice()) {
    return;
  }
  const SCROLL_SPEED = 0.1875; // 2^(-3) + 2^(-4)

  scrollableContainer.addEventListener("wheel", (event: WheelEvent) => {
    event.preventDefault();
    scrollableContainer.scrollLeft += event.deltaY * SCROLL_SPEED;
  });
}

export const delay = ms => new Promise(res => setTimeout(res, ms));
