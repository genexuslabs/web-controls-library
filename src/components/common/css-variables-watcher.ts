import { Component } from "./interfaces";
import { overrideMethod } from "./utils";

export function cssVariablesWatcher(
  component: Component,
  properties: CssVariableWatcherProperty[]
): void {
  // Set up a MutationObserver to monitor changes on style and class attributes.
  // When a change occurs on this attributes, the properties listed in
  // properties are updated with their corresponding CSS variables values.
  // The properties will be kept in sync with the CSS variables values.
  // The properties must have the mutable flag set to true.
  const classObserver = new MutationObserver(
    (mutationsList: MutationRecord[]) => {
      for (const mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          (mutation.attributeName === "class" ||
            mutation.attributeName === "style")
        ) {
          updatePropertiesFromCss();
        }
      }
    }
  );

  function updatePropertiesFromCss(): void {
    for (const prop of properties) {
      const propCssValue = getComputedStyle(component.element)
        .getPropertyValue(prop.cssVariableName)
        .trim();
      if (propCssValue && component[prop.propertyName] !== propCssValue) {
        component[prop.propertyName] = propCssValue;
      }
    }
  }

  // componentDidLoad, componentDidUpdate and componentDidUnload are overriden
  // to start and end observing the mutations, and to update the properties values.
  overrideMethod(component, "componentDidLoad", {
    after: () => updatePropertiesFromCss(),
    before: () => {
      classObserver.observe(component.element, {
        attributes: true,
        childList: false,
        subtree: false
      });
    }
  });

  overrideMethod(component, "componentDidUpdate", {
    after: () => updatePropertiesFromCss()
  });

  overrideMethod(component, "componentDidUnload", {
    before: () => classObserver.disconnect()
  });
}

export interface CssVariableWatcherProperty {
  propertyName: string;
  cssVariableName: string;
}
