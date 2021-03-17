import { Component, Element, Listen, Prop, h } from "@stencil/core";
import {
  DisableableComponent,
  Component as GxComponent,
  VisibilityComponent
} from "../common/interfaces";
import {
  HighlightableComponent,
  makeHighlightable
} from "../common/highlightable";

import { ButtonRender } from "../renders/bootstrap/button/button-render";

@Component({
  shadow: false,
  styleUrl: "button.scss",
  tag: "gx-button"
})
export class Button
  implements
    GxComponent,
    DisableableComponent,
    VisibilityComponent,
    HighlightableComponent {
  constructor() {
    this.renderer = new ButtonRender(this, {
      handleClick: this.handleClick.bind(this)
    });
  }

  private renderer: ButtonRender;

  @Element() element: HTMLGxButtonElement;

  /**
   * A CSS class to set as the inner `input` element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * This attribute lets you specify how this element will behave when hidden.
   *
   * | Value        | Details                                                                     |
   * | ------------ | --------------------------------------------------------------------------- |
   * | `keep-space` | The element remains in the document flow, and it does occupy space.         |
   * | `collapse`   | The element is removed form the document flow, and it doesn't occupy space. |
   */
  @Prop() readonly invisibleMode: "collapse" | "keep-space" = "collapse";

  /**
   * This attribute lets you specify if the element is disabled.
   * If disabled, it will not fire any user interaction related event
   * (for example, click event). If a disabled image has been specified,
   * it will be shown, hiding the base image (if specified).
   */
  @Prop() readonly disabled = false;

  /**
   * This attribute lets you specify the relative location of the image to the text.
   *
   * | Value    | Details                                                 |
   * | -------- | ------------------------------------------------------- |
   * | `above`  | The image is located above the text.                    |
   * | `before` | The image is located before the text, in the same line. |
   * | `after`  | The image is located after the text, in the same line.  |
   * | `below`  | The image is located below the text.                    |
   * | `behind` | The image is located behind the text.                   |
   */
  @Prop() readonly imagePosition:
    | "above"
    | "before"
    | "after"
    | "below"
    | "behind" = "above";

  /**
   * This attribute lets you specify the size of the button.
   *
   * | Value    | Details                                                 |
   * | -------- | ------------------------------------------------------- |
   * | `large`  | Large sized button.                                     |
   * | `normal` | Standard sized button.                                  |
   * | `small`  | Small sized button.                                     |
   */
  @Prop() readonly size: "large" | "normal" | "small" = "normal";

  /**
   * True to highlight control when an action is fired.
   */
  @Prop() readonly highlightable = false;

  @Listen("click", { capture: true })
  handleClick(event: UIEvent) {
    if (this.disabled) {
      event.stopPropagation();
      return;
    }
  }

  componentWillLoad() {
    this.renderer.componentWillLoad();
  }

  componentDidLoad() {
    makeHighlightable(this);
  }

  render() {
    return this.renderer.render({
      default: <slot />,
      disabledImage: <slot name="disabled-image" />,
      mainImage: <slot name="main-image" />
    });
  }
}
