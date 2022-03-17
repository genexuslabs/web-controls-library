import { Component } from "./interfaces";
import { overrideMethod, debounce } from "./utils";

export function cssVariablesWatcher(
  component: Component,
  properties: CssVariableWatcherProperty[]
): void {
  const updatePropertiesFromCss = debounce(function(): void {
    for (const prop of properties) {
      const propCssValue =
        getComputedStyle(component.element)
          .getPropertyValue(prop.cssVariableName)
          .trim() || prop.defaultPropertyValue;
      if (propCssValue && component[prop.propertyName] !== propCssValue) {
        component[prop.propertyName] = propCssValue;
      }
    }
  }, 100);

  // Set up a MutationObserver to monitor changes on style and class attributes.
  // When a change occurs on this attributes, the properties listed in
  // properties are updated with their corresponding CSS variables values.
  // The properties will be kept in sync with the CSS variables values.
  // The properties must have the mutable flag set to true.
  const classObserver = new MutationObserver(() => {
    updatePropertiesFromCss();
  });

  // componentDidLoad and disconnectedCallback are overriden
  // to start and end observing the mutations, and to update the properties values.
  overrideMethod(component, "componentDidLoad", {
    before: () => {
      classObserver.observe(component.element, {
        attributeFilter: ["class", "style"],
        childList: false,
        subtree: false
      });
    }
  });

  overrideMethod(component, "disconnectedCallback", {
    before: () => classObserver.disconnect()
  });
}

export interface CssVariableWatcherProperty {
  propertyName: string;
  cssVariableName: string;
  defaultPropertyValue?: string;
}
