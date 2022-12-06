import { ComponentInterface, EventEmitter } from "@stencil/core";

export interface ClickableComponent {
  gxClick: EventEmitter;
}

export interface CustomizableComponent {
  cssClass: string;
}

export interface CssClasses {
  vars: string;
}

export interface CssTransformedClassesWithoutFocus {
  transformedCssClass: string;
  vars: string;
}

export interface VisibilityComponent {
  invisibleMode: "collapse" | "keep-space";
}

export interface DisableableComponent {
  disabled: boolean;
}

export interface Component extends ComponentInterface {
  element: any;
  render: () => void;
}

export interface FormComponent
  extends Component,
    DisableableComponent,
    VisibilityComponent {
  input: EventEmitter;
  /**
   * Returns the DOM Control Id of the "labelable" element inside the component. This Id will be used for <label> 'for' attribute.
   * Labelable elements are: button, input (if the type attribute is not in the Hidden state) progress, select, textarea, form-associated custom elements
   */
  getNativeInputId: () => void;
}

export interface Renderer {
  render: (slots?: object) => void;
  componentWillLoad?: () => void;
  componentDidLoad?: () => void;
  componentWillUpdate?: () => void;
  componentDidUpdate?: () => void;
  disconnectedCallback?: () => void;
}

export interface RendererConstructor {
  new (
    component: Component,
    handlers?: { [key: string]: (event: UIEvent) => void }
  ): Renderer;
}

declare const Renderer: RendererConstructor;
