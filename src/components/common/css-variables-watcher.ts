import { IComponent } from "./interfaces";

export function cssVariablesWatcher(
  component: IComponent,
  properties: ICssVariableWatcherProperty[]
) {
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

  const updatePropertiesFromCss = () => {
    for (const prop of properties) {
      const propCssValue = getComputedStyle(component.element)
        .getPropertyValue(prop.cssVariableName)
        .trim();
      if (propCssValue && component[prop.propertyName] !== propCssValue) {
        component[prop.propertyName] = propCssValue;
      }
    }
  };

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

function overrideMethod(
  component: IComponent,
  methodName: string,
  { before, after }: { before?: () => void; after?: () => void }
) {
  const oldMethod = component[methodName];
  component[methodName] = () => {
    if (before) {
      before();
    }

    if (oldMethod) {
      oldMethod.call(component);
    }

    if (after) {
      after();
    }
  };
}

export interface ICssVariableWatcherProperty {
  propertyName: string;
  cssVariableName: string;
}
