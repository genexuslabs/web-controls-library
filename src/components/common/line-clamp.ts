import { debounce, overrideMethod } from "./utils";
import { Component } from "./interfaces";

const LINE_HEIGHT_CLAMP_THRESHOLD = 0.3;

// There is an issue, which loops this call
export function makeLinesClampable(
  component: LineClampComponent,
  contentElementSelect: string,
  lineMeasuringElementSelector: string
) {
  const applyLineClamp = debounce(function() {
    requestAnimationFrame(function applyLineClampImpl() {
      const contentElement = component.element.querySelector(
        contentElementSelect
      ) as HTMLElement;
      const lineMeasuringElement = component.element.querySelector(
        lineMeasuringElementSelector
      ) as HTMLElement;

      if (contentElement === null || lineMeasuringElement === null) {
        return;
      }

      const { offsetHeight, scrollHeight } = contentElement;
      const delta = scrollHeight - offsetHeight;
      const lineHeight = lineMeasuringElement.clientHeight;

      if (delta > lineHeight * LINE_HEIGHT_CLAMP_THRESHOLD) {
        component.maxLines = Math.trunc(offsetHeight / lineHeight);
        component.maxHeight = component.maxLines * lineHeight;
      }
    });
  }, 100);

  const resetLineClamp = function resetLineClampImpl() {
    component.maxLines = 0;
  };

  let resizeObserver: ResizeObserver = null;
  overrideMethod(component, "componentDidLoad", {
    before: () => {
      if (component.lineClamp) {
        resizeObserver = new ResizeObserver(() => {
          // If the component resizes, we reset the clamping and wait after the next paint to calculate sizes again
          // to check if clamping is needed
          resetLineClamp();
          applyLineClamp();
        });
        resizeObserver.observe(component.element);
      }
    }
  });

  overrideMethod(component, "componentDidRender", {
    before: () => {
      if (component.lineClamp) {
        applyLineClamp();
      }
    }
  });

  overrideMethod(component, "disconnectedCallback", {
    before: () => {
      if (resizeObserver !== null) {
        resizeObserver.disconnect();
      }
    }
  });

  return {
    applyLineClamp,
    resetLineClamp
  };
}

export interface LineClampComponent extends Component {
  lineClamp: boolean;
  maxLines: number;
  maxHeight: number;
}
