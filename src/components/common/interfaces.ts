import { ComponentInterface, EventEmitter } from "@stencil/core";

export interface IClickableComponent {
  handleClick: (UIEvent) => void;
  onClick: EventEmitter;
}

export interface IVisibilityComponent {
  invisibleMode: "collapse" | "keep-space";
}

export interface IDisableableComponent {
  disabled: boolean;
}

export interface IComponent extends ComponentInterface {
  element: HTMLElement;
  render: () => void;
}

export interface IFormComponent
  extends IComponent,
    IDisableableComponent,
    IVisibilityComponent {
  handleChange: (UIEvent) => void;
  id: string;
  input: EventEmitter;
  /**
   * Returns the DOM Control Id of the "labelable" element inside the component. This Id will be used for <label> 'for' attribute.
   * Labelable elements are: button, input (if the type attribute is not in the Hidden state) progress, select, textarea, form-associated custom elements
   */
  getNativeInputId: () => void;
}

export interface IRenderer {
  component: IComponent;
  render: (slots?: any) => void;
  componentWillLoad?: () => void;
  componentDidLoad?: () => void;
  componentWillUpdate?: () => void;
  componentDidUpdate?: () => void;
  componentDidUnload?: () => void;
}
