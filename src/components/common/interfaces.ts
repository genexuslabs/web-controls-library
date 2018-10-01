import { EventEmitter } from "@stencil/core";

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

export interface IComponent {
  element: HTMLElement;
  render: () => void;
}

export interface IFormComponent
  extends IComponent,
    IDisableableComponent,
    IVisibilityComponent {
  handleChange: (UIEvent) => void;
  id: string;
  onChange: EventEmitter;
  getNativeInputId: () => void;
}

export interface IRenderer {
  component: IComponent;
  render: () => void;
  componentWillLoad?: () => void;
  componentDidLoad?: () => void;
  componentWillUpdate?: () => void;
  componentDidUpdate?: () => void;
  componentDidUnload?: () => void;
}
