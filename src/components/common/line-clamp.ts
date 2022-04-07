import { debounce, overrideMethod } from "./utils";
import { Component } from "./interfaces";

export function makeLinesClampable(
  component: LineClampComponent,
  contentContainerElementSelector: string,
  lineMeasuringElementSelector: string
) {
  // Used to know the sizes of the `content-container`
  let contentContainerElement;

  // Used to measure the line height
  let lineMeasuringElement;

  // Used to keep the state of the component
  let contentContainerHeight = -1;
  let lineMeasuringHeight = -1;

  const applyLineClamp = debounce(function() {
    requestAnimationFrame(function applyLineClampImpl() {
      const currentContentContainerHeight =
        contentContainerElement.clientHeight;

      if (currentContentContainerHeight == 0) {
        return;
      }

      const currentLineMeasuringHeight = lineMeasuringElement.clientHeight;

      /*  If the container height and the line height have not been changed,
          there is not need to update `component.maxLines`
      */
      if (
        contentContainerHeight == currentContentContainerHeight &&
        lineMeasuringHeight == currentLineMeasuringHeight
      ) {
        return;
      }

      // Stores the current height of the content container and line measurement
      contentContainerHeight = currentContentContainerHeight;
      lineMeasuringHeight = currentLineMeasuringHeight;

      // At least, one line will be displayed
      component.maxLines = Math.max(
        Math.trunc(currentContentContainerHeight / lineMeasuringHeight),
        1
      );
    });
  }, 50);

  let resizeObserverContainer: ResizeObserver = null;

  if (component.lineClamp) {
    overrideMethod(component, "componentDidLoad", {
      before: () => {
        contentContainerElement = component.element.querySelector(
          contentContainerElementSelector
        ) as HTMLElement;

        lineMeasuringElement = component.element.querySelector(
          lineMeasuringElementSelector
        ) as HTMLElement;

        if (contentContainerElement === null || lineMeasuringElement === null) {
          return;
        }

        /*  If the `content-container` resizes or the `font-size` changes, it
            checks if it is necessary to update `component.maxLines`
        */
        resizeObserverContainer = new ResizeObserver(() => {
          applyLineClamp();
        });

        // Observe the `content-container` and line height
        resizeObserverContainer.observe(component.element);
        resizeObserverContainer.observe(lineMeasuringElement);
      }
    });
  }

  overrideMethod(component, "disconnectedCallback", {
    before: () => {
      if (resizeObserverContainer !== null) {
        resizeObserverContainer.disconnect();
      }
    }
  });

  return {
    applyLineClamp
  };
}

export interface LineClampComponent extends Component {
  lineClamp: boolean;
  maxLines: number;
}
